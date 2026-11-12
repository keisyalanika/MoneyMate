import { Request, Response } from 'express';
import { userService, walletService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class UserController {
  constructor(
    private readonly users = userService,
    private readonly wallets = walletService
  ) {}

  getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.users.getAllUsers();

    return AppBaseResponse.success(
      res,
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '-',
        role: user.role || 'student',
        saldo: Number(user.saldo) || 0,
        status: user.is_active ? 'Aktif' : 'Nonaktif',
        userId: `USR-${String(user.id).padStart(3, '0')}`,
        created_at: user.created_at,
      }))
    );
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone, saldo } = req.body;
    if (!name || !email) {
      throw AppError.badRequest('Nama dan email wajib diisi.', 'VALIDATION_ERROR');
    }

    const created = await this.users.createUser({
      name,
      email,
      password: password || 'MoneyMate123!',
      phone: phone || null,
    });

    if (saldo) {
      const numSaldo = typeof saldo === 'string' ? Number(saldo.replace(/\D/g, '')) : Number(saldo);
      if (!isNaN(numSaldo) && numSaldo > 0) {
        await this.wallets.createWallet({
          user_id: created.id,
          name: 'Dompet Utama',
          balance: numSaldo,
          is_default: true,
        });
      }
    }

    return AppBaseResponse.created(res, created, 'Pengguna baru berhasil ditambahkan ke database');
  });

  getProfileMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id || 1;
    const user = await this.users.getUserById(userId);
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }

    const { wallets, totalBalance } = await this.wallets.getWallets(userId);

    return AppBaseResponse.success(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar_url: user.avatar_url,
      role: user.role,
      totalBalance,
      wallets,
    });
  });

  updateProfileMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id || 1;
    const { name, phone, avatar_url } = req.body;
    const updated = await this.users.updateUser(userId, { name, phone, avatar_url });

    return AppBaseResponse.success(res, updated, 'Profil berhasil diperbarui');
  });

  updateUserSaldo = asyncHandler(async (req: AuthRequest, res: Response) => {
    const targetUserId = Number(req.params.id);
    const { amount, action, note } = req.body;
    if (amount === undefined) {
      throw AppError.badRequest('amount is required', 'VALIDATION_ERROR');
    }

    const numAmount = Number(amount);
    let wallet;

    if (action === 'set') {
      wallet = await this.wallets.setupInitialBalance(targetUserId, numAmount);
    } else {
      const type = action === 'subtract' ? 'subtract' : 'add';
      const userWallets = await this.wallets.getWallets(targetUserId);
      const walletId = userWallets.wallets.length > 0 ? userWallets.wallets[0].id : 1;
      wallet = await this.wallets.adjustWalletBalance(targetUserId, walletId, {
        type,
        amount: numAmount,
        note: note || 'Penyesuaian saldo oleh Administrator',
      });
    }

    return AppBaseResponse.success(res, wallet, 'Saldo pengguna berhasil diperbarui');
  });
}

export const userController = new UserController();
