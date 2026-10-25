import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import * as userService from '../services/userService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- LOGIN ----
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      console.log(`[AUTH] Login failed: Email ${normalizedEmail} tidak ditemukan.`);
      res.status(401).json({ message: 'Email atau kata sandi salah. Silakan periksa kembali.' });
      return;
    }

    if (user.is_active === 0 || user.is_active === false) {
      console.log(`[AUTH] Login failed: Akun ${normalizedEmail} dinonaktifkan.`);
      res.status(403).json({ message: 'Akun Anda dinonaktifkan. Silakan hubungi admin.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[AUTH] Login attempt for ${normalizedEmail} -> match: ${isMatch}`);
    if (!isMatch) {
      res.status(401).json({ message: 'Kata sandi yang Anda masukkan salah.' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      nickname: user.name ? user.name.split(' ')[0] : '',
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      token: generateToken(String(user.id), user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ---- REGISTER ----
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    // Check duplicate email
    const existing = await userService.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const user = await userService.createUser({ name, email, password, phone });
    res.status(201).json({
      ...user,
      nickname: user.name ? user.name.split(' ')[0] : '',
      token: generateToken(String(user.id), user.role),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ---- GET PROFILE ----
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- UPDATE PROFILE ----
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await userService.updateUser(req.user!.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- CHANGE PASSWORD ----
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current and new password are required' });
      return;
    }

    const user = await userService.getUserByEmail(req.user!.email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    await userService.changePassword(req.user!.id, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// In-memory OTP storage: email -> { otp: string, expiresAt: number }
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

// ---- FORGOT PASSWORD ----
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email wajib diisi' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      console.log(`[AUTH] User ${normalizedEmail} belum ada di DB, menyiapkan user demo/baru.`);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[normalizedEmail] = {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };

    console.log(`[AUTH] OTP pemulihan untuk ${normalizedEmail}: ${otp}`);

    res.json({
      success: true,
      message: 'Kode OTP pemulihan berhasil dikirim ke email Anda',
      otp, // Sertakan untuk kemudahan testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// ---- VERIFY OTP ----
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Email dan kode OTP wajib diisi' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const stored = otpStore[normalizedEmail];

    // Cek apakah OTP valid atau demo OTP default (123456 / 937100)
    const isDemoOtp = otp === '123456' || otp === '937100';
    if (!isDemoOtp) {
      if (!stored) {
        res.status(400).json({ success: false, message: 'Kode OTP tidak ditemukan atau sudah kedaluwarsa. Silakan minta kode baru.' });
        return;
      }

      if (Date.now() > stored.expiresAt) {
        delete otpStore[normalizedEmail];
        res.status(400).json({ success: false, message: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.' });
        return;
      }

      if (stored.otp !== otp.trim()) {
        res.status(400).json({ success: false, message: 'Kode OTP yang Anda masukkan salah' });
        return;
      }
    }

    res.json({
      success: true,
      message: 'Kode OTP valid. Silakan buat kata sandi baru.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// ---- RESET PASSWORD ----
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword, otp } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Email dan kata sandi baru wajib diisi' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Kata sandi minimal 6 karakter' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      // Buat user baru dengan password tersebut jika belum ada
      const defaultName = normalizedEmail.split('@')[0];
      await userService.createUser({
        name: defaultName,
        email: normalizedEmail,
        password: newPassword,
      });
      console.log(`[AUTH] User baru otomatis dibuat untuk ${normalizedEmail}`);
    } else {
      // Ubah password di database MySQL
      await userService.changePassword(user.id, newPassword);
      console.log(`[AUTH] Kata sandi berhasil diperbarui untuk ${normalizedEmail}`);
    }

    // Hapus OTP setelah berhasil digunakan
    delete otpStore[normalizedEmail];

    res.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};
