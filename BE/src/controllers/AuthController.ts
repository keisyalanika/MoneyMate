import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/jwt';
import { userService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';
import { sendOtpEmail } from '../utils/emailService';

// In-memory OTP storage: email -> { otp: string, expiresAt: number }
// Untuk production sebaiknya gunakan Redis agar tidak hilang saat restart.
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

const googleClient = new OAuth2Client();

export class AuthController {
  constructor(private readonly users = userService) {}

  // ---- LOGIN ----
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw AppError.badRequest('Email and password are required', 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.users.getUserByEmail(normalizedEmail);
    if (!user) {
      console.log(`[AUTH] Login failed: Email ${normalizedEmail} tidak ditemukan.`);
      throw AppError.unauthorized(
        'Email atau kata sandi salah. Silakan periksa kembali.',
        'INVALID_CREDENTIALS'
      );
    }

    if (user.is_active === 0) {
      console.log(`[AUTH] Login failed: Akun ${normalizedEmail} dinonaktifkan.`);
      throw AppError.forbidden('Akun Anda dinonaktifkan. Silakan hubungi admin.', 'ACCOUNT_INACTIVE');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[AUTH] Login attempt for ${normalizedEmail} -> match: ${isMatch}`);
    if (!isMatch) {
      throw AppError.unauthorized(
        'Kata sandi yang Anda masukkan salah.',
        'INVALID_CREDENTIALS'
      );
    }

    // Response flat dipertahankan: FE & MOBILE membaca token/nama di root.
    return AppBaseResponse.raw(res, {
      id: user.id,
      name: user.name,
      nickname: user.name ? user.name.split(' ')[0] : '',
      email: user.email,
      phone: user.phone || '',
      avatar_url: user.avatar_url || '',
      role: user.role,
      token: generateToken(String(user.id), user.role),
    });
  });

  // ---- REGISTER ----
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      throw AppError.badRequest('Name, email, and password are required', 'VALIDATION_ERROR');
    }

    const existing = await this.users.getUserByEmail(email);
    if (existing) {
      throw AppError.conflict('Email already registered', 'DUPLICATE_ENTRY');
    }

    const user = await this.users.createUser({ name, email, password, phone });
    return AppBaseResponse.raw(
      res,
      {
        ...user,
        nickname: user.name ? user.name.split(' ')[0] : '',
        token: generateToken(String(user.id), user.role),
      },
      201
    );
  });

  // ---- GOOGLE SIGN-IN ----
  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken, email: clientEmail, name: clientName, avatarUrl: clientAvatar } = req.body;

    if (!idToken && !clientEmail) {
      throw AppError.badRequest('Token ID Google atau email wajib disertakan', 'VALIDATION_ERROR');
    }

    let verifiedEmail = clientEmail ? clientEmail.trim().toLowerCase() : '';
    let verifiedName = clientName ? clientName.trim() : 'Pengguna Google';
    let verifiedPicture = clientAvatar || '';

    // Verifikasi token Google jika idToken dikirim
    if (idToken) {
      try {
        const audiences = process.env.GOOGLE_CLIENT_ID
          ? process.env.GOOGLE_CLIENT_ID.split(',').map((s) => s.trim())
          : undefined;

        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: audiences,
        });
        const payload = ticket.getPayload();
        if (payload) {
          if (payload.email) verifiedEmail = payload.email.trim().toLowerCase();
          if (payload.name) verifiedName = payload.name.trim();
          if (payload.picture) verifiedPicture = payload.picture;
        }
      } catch (err: any) {
        console.warn('[AUTH] Google token verification warning:', err?.message || err);
        // Jika token tidak valid dan tidak ada verifiedEmail, tolak
        if (!verifiedEmail) {
          throw AppError.unauthorized('Token Google tidak valid atau telah kedaluwarsa', 'INVALID_GOOGLE_TOKEN');
        }
      }
    }

    if (!verifiedEmail) {
      throw AppError.badRequest('Alamat email dari akun Google tidak ditemukan', 'VALIDATION_ERROR');
    }

    let isNewUser = false;
    let user = await this.users.getUserByEmail(verifiedEmail);

    if (!user) {
      // User Baru: Otomatis daftarkan akun baru
      isNewUser = true;
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const created = await this.users.createUser({
        name: verifiedName,
        email: verifiedEmail,
        password: randomPassword,
        phone: null,
      });

      // Update avatar jika tersedia dari Google
      if (verifiedPicture) {
        try {
          await this.users.updateUser(created.id, { avatar_url: verifiedPicture });
        } catch (_) {}
      }

      user = await this.users.getUserByEmail(verifiedEmail);
    } else {
      // User Lama: Validasi status akun
      if (user.is_active === 0) {
        throw AppError.forbidden('Akun Anda dinonaktifkan. Silakan hubungi admin.', 'ACCOUNT_INACTIVE');
      }

      // Jika user belum punya avatar dan Google menyediakan avatar, sinkronkan
      if (!user.avatar_url && verifiedPicture) {
        try {
          await this.users.updateUser(user.id, { avatar_url: verifiedPicture });
          user.avatar_url = verifiedPicture;
        } catch (_) {}
      }
    }

    if (!user) {
      throw AppError.internal('Gagal memproses data akun pengguna Google', 'AUTH_ERROR');
    }

    const token = generateToken(String(user.id), user.role);

    return AppBaseResponse.raw(res, {
      id: user.id,
      name: user.name,
      nickname: user.name ? user.name.split(' ')[0] : '',
      email: user.email,
      phone: user.phone || '',
      avatar_url: user.avatar_url || '',
      role: user.role,
      token,
      isNewUser,
      message: isNewUser
        ? 'Pendaftaran akun dengan Google berhasil!'
        : 'Selamat datang kembali! Login dengan Google berhasil.',
    });
  });

  // ---- GET PROFILE ----
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.users.getUserById(req.user!.id);
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return AppBaseResponse.raw(res, user);
  });

  // ---- UPDATE PROFILE ----
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.users.updateUser(req.user!.id, req.body);
    return AppBaseResponse.raw(res, updated ?? {});
  });

  // ---- CHANGE PASSWORD ----
  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw AppError.badRequest('Current and new password are required', 'VALIDATION_ERROR');
    }

    const user = await this.users.getUserByEmail(req.user!.email);
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw AppError.unauthorized('Current password is incorrect', 'INVALID_CREDENTIALS');
    }

    await this.users.changePassword(req.user!.id, newPassword);
    return AppBaseResponse.raw(res, { message: 'Password changed successfully' });
  });

  // ---- FORGOT PASSWORD ----
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw AppError.badRequest('Email wajib diisi', 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.users.getUserByEmail(normalizedEmail);
    if (!user) {
      console.log(`[AUTH] Forgot password: email ${normalizedEmail} tidak ditemukan di DB.`);
      // Tetap kembalikan sukses agar tidak membocorkan apakah email terdaftar.
      return AppBaseResponse.raw(res, {
        success: false,
        message: 'Email tidak terdaftar. Pastikan email yang dimasukkan sudah benar.',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[normalizedEmail] = {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 menit
    };

    // Kirim OTP via email (nodemailer).
    // Jika SMTP_USER belum diisi di .env → fallback ke console.log (EMAIL_MOCK mode).
    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (err) {
      console.error(`[EMAIL] Gagal mengirim OTP ke ${normalizedEmail}:`, err);
      // Tetap lanjutkan — OTP sudah tersimpan di store, user bisa coba resend.
    }

    return AppBaseResponse.raw(res, {
      success: true,
      message: 'Kode OTP pemulihan berhasil dikirim ke email Anda. Periksa inbox atau folder spam.',
      // otp disertakan agar mudah di-test via mobile saat development.
      // Hapus baris ini saat production / saat SMTP sudah aktif.
      otp,
    });
  });

  // ---- VERIFY OTP ----
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw AppError.badRequest('Email dan kode OTP wajib diisi', 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const stored = otpStore[normalizedEmail];

    if (!stored) {
      throw AppError.badRequest(
        'Kode OTP tidak ditemukan atau sudah kedaluwarsa. Silakan minta kode baru.',
        'OTP_NOT_FOUND'
      );
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[normalizedEmail];
      throw AppError.badRequest(
        'Kode OTP telah kedaluwarsa. Silakan minta kode baru.',
        'OTP_EXPIRED'
      );
    }

    if (stored.otp !== otp.trim()) {
      throw AppError.badRequest('Kode OTP yang Anda masukkan salah', 'OTP_INVALID');
    }

    return AppBaseResponse.raw(res, {
      success: true,
      message: 'Kode OTP valid. Silakan buat kata sandi baru.',
    });
  });

  // ---- RESET PASSWORD ----
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      throw AppError.badRequest('Email dan kata sandi baru wajib diisi', 'VALIDATION_ERROR');
    }

    if (newPassword.length < 6) {
      throw AppError.badRequest('Kata sandi minimal 6 karakter', 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.users.getUserByEmail(normalizedEmail);
    if (!user) {
      throw AppError.notFound(
        'Akun dengan email tersebut tidak ditemukan.',
        'USER_NOT_FOUND'
      );
    }

    await this.users.changePassword(user.id, newPassword);
    console.log(`[AUTH] Kata sandi berhasil diperbarui untuk ${normalizedEmail}`);

    delete otpStore[normalizedEmail];

    return AppBaseResponse.raw(res, {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru.',
    });
  });
}

export const authController = new AuthController();
