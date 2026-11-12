import { Response } from 'express';
import { walletService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class WalletController {
  constructor(private readonly wallets = walletService) {}

  // ---- GET user wallets ----
  getWallets = asyncHandler(async (req: AuthRequest, res: Response) => {
    let data = await this.wallets.getWallets(req.user!.id);

    if (!data.wallets || data.wallets.length === 0) {
      await this.wallets.createWallet({
        user_id: req.user!.id,
        name: 'Dompet Utama',
        balance: 2450000,
        is_default: true,
      });
      data = await this.wallets.getWallets(req.user!.id);
    }

    return AppBaseResponse.success(res, data.wallets, 'Wallets retrieved successfully', {
      totalBalance: data.totalBalance,
    });
  });

  // ---- GET single wallet ----
  getWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
    const wallet = await this.wallets.getWalletById(Number(req.params.id));
    if (!wallet) {
      throw AppError.notFound('Wallet not found', 'WALLET_NOT_FOUND');
    }
    return AppBaseResponse.success(res, wallet);
  });

  // ---- CREATE wallet ----
  createWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, balance, currency, is_default } = req.body;
    if (!name) {
      throw AppError.badRequest('Wallet name is required', 'VALIDATION_ERROR');
    }

    const created = await this.wallets.createWallet({
      user_id: req.user!.id,
      name,
      balance: balance ? Number(balance) : 0,
      currency,
      is_default,
    });

    return AppBaseResponse.created(res, created, 'Wallet created successfully');
  });

  // ---- UPDATE wallet ----
  updateWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.wallets.updateWallet(Number(req.params.id), req.body);
    if (!updated) {
      throw AppError.notFound('Wallet not found', 'WALLET_NOT_FOUND');
    }
    return AppBaseResponse.updated(res, updated, 'Wallet updated successfully');
  });

  // ---- DELETE wallet ----
  deleteWallet = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.wallets.deleteWallet(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Wallet not found', 'WALLET_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Wallet deleted successfully');
  });

  // ---- ADJUST balance (Add / Subtract directly) ----
  adjustBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, amount, note } = req.body;
    if (!type || amount === undefined) {
      throw AppError.badRequest(
        'type (add/subtract) and amount are required',
        'VALIDATION_ERROR'
      );
    }

    const updated = await this.wallets.adjustWalletBalance(
      req.user!.id,
      Number(req.params.id),
      {
        type: type === 'subtract' ? 'subtract' : 'add',
        amount: Number(amount),
        note,
      }
    );

    return AppBaseResponse.success(
      res,
      updated,
      `Balance successfully ${type === 'add' ? 'increased' : 'reduced'} by Rp ${Number(amount).toLocaleString('id-ID')}`
    );
  });

  // ---- SETUP INITIAL BALANCE ----
  setupInitialBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { amount, wallet_name } = req.body;
    if (amount === undefined) {
      throw AppError.badRequest('amount is required', 'VALIDATION_ERROR');
    }

    const wallet = await this.wallets.setupInitialBalance(
      req.user!.id,
      Number(amount),
      wallet_name || 'Dompet Utama'
    );

    return AppBaseResponse.success(
      res,
      wallet,
      `Initial balance of Rp ${Number(amount).toLocaleString('id-ID')} has been set successfully`
    );
  });
}

export const walletController = new WalletController();
