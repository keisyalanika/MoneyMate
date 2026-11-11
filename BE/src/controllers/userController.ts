import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as walletService from '../services/walletService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      status: 'success',
      data: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '-',
        role: u.role || 'student',
        saldo: Number(u.saldo) || 0,
        status: u.is_active ? 'Aktif' : 'Nonaktif',
        userId: `USR-${String(u.id).padStart(3, '0')}`,
        created_at: u.created_at
      }))
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, saldo } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Nama dan email wajib diisi.' });
    }

    const created = await userService.createUser({
      name,
      email,
      password: password || 'MoneyMate123!',
      phone: phone || null
    });

    if (saldo) {
      const numSaldo = typeof saldo === 'string' ? Number(saldo.replace(/\D/g, '')) : Number(saldo);
      if (!isNaN(numSaldo) && numSaldo > 0) {
        await walletService.createWallet({
          user_id: created.id,
          name: 'Dompet Utama',
          balance: numSaldo,
          is_default: true,
        });
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Pengguna baru berhasil ditambahkan ke database',
      data: created
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getProfileMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 1;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { wallets, totalBalance } = await walletService.getWallets(userId);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar_url: user.avatar_url,
        role: user.role,
        totalBalance,
        wallets,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfileMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || 1;
    const { name, phone, avatar_url } = req.body;
    const updated = await userService.updateUser(userId, { name, phone, avatar_url });
    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserSaldo = async (req: AuthRequest, res: Response) => {
  try {
    const targetUserId = Number(req.params.id);
    const { amount, action, note } = req.body; // action: 'set' | 'add' | 'subtract'
    if (amount === undefined) {
      return res.status(400).json({ success: false, message: 'amount is required' });
    }

    const numAmount = Number(amount);
    let wallet: any;

    if (action === 'set') {
      wallet = await walletService.setupInitialBalance(targetUserId, numAmount);
    } else {
      const type = action === 'subtract' ? 'subtract' : 'add';
      const userWallets = await walletService.getWallets(targetUserId);
      const walletId = userWallets.wallets.length > 0 ? userWallets.wallets[0].id : 1;
      wallet = await walletService.adjustWalletBalance(targetUserId, walletId, {
        type,
        amount: numAmount,
        note: note || 'Penyesuaian saldo oleh Administrator'
      });
    }

    res.json({
      success: true,
      message: 'Saldo pengguna berhasil diperbarui',
      data: wallet
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
