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

    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
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

// ---- FORGOT PASSWORD (Send OTP) ----
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email wajib diisi' });
      return;
    }

    const normEmail = email.toLowerCase().trim();
    const user = await userService.getUserByEmail(normEmail);
    if (!user) {
      res.status(404).json({ success: false, message: 'Akun dengan email ini tidak ditemukan' });
      return;
    }

    const otpCode = await userService.createOtpCode(normEmail);

    res.json({
      success: true,
      message: 'Kode pemulihan OTP 6-digit berhasil dikirimkan ke email Anda',
      email: normEmail,
      otp_preview: otpCode, // Provided for easy development & testing
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ---- VERIFY OTP ----
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp_code } = req.body;
    if (!email || !otp_code) {
      res.status(400).json({ success: false, message: 'Email dan kode OTP wajib diisi' });
      return;
    }

    const isValid = await userService.verifyOtpCode(email, otp_code);
    if (!isValid) {
      res.status(400).json({ success: false, message: 'Kode OTP salah atau sudah kadaluarsa (berlaku 15 menit)' });
      return;
    }

    res.json({
      success: true,
      message: 'Kode OTP berhasil diverifikasi',
      reset_token: `reset_${Buffer.from(email + ':' + otp_code).toString('base64')}`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ---- RESET PASSWORD ----
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp_code, new_password } = req.body;
    if (!email || !otp_code || !new_password) {
      res.status(400).json({ success: false, message: 'Email, kode OTP, dan kata sandi baru wajib diisi' });
      return;
    }

    if (new_password.length < 6) {
      res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter' });
      return;
    }

    const success = await userService.resetPasswordWithOtp(email, otp_code, new_password);
    if (!success) {
      res.status(400).json({ success: false, message: 'Gagal mengatur ulang kata sandi. Pastikan kode OTP valid.' });
      return;
    }

    res.json({
      success: true,
      message: 'Kata sandi baru berhasil disimpan! Silakan masuk dengan kata sandi baru Anda.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

