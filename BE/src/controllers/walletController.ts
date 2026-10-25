import { Response } from 'express';
import * as walletService from '../services/walletService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET user wallets ----
export const getWallets = async (req: AuthRequest, res: Response) => {
  try {
    let data = await walletService.getWallets(req.user!.id);
    if (!data.wallets || data.wallets.length === 0) {
      await walletService.createWallet({
        user_id: req.user!.id,
        name: 'Dompet Utama',
        balance: 2450000,
        is_default: true,
      });
      data = await walletService.getWallets(req.user!.id);
    }
    res.json({
      success: true,
      data: data.wallets,
      totalBalance: data.totalBalance,
      message: 'Wallets retrieved successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET single wallet ----
export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    const wallet = await walletService.getWalletById(Number(req.params.id));
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    res.json({ success: true, data: wallet });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE wallet ----
export const createWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, balance, currency, is_default } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Wallet name is required' });
    }

    const created = await walletService.createWallet({
      user_id: req.user!.id,
      name,
      balance: balance ? Number(balance) : 0,
      currency,
      is_default,
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'Wallet created successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE wallet ----
export const updateWallet = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await walletService.updateWallet(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    res.json({
      success: true,
      data: updated,
      message: 'Wallet updated successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE wallet ----
export const deleteWallet = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await walletService.deleteWallet(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    res.json({ success: true, message: 'Wallet deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- ADJUST balance (Add / Subtract directly) ----
export const adjustBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, note } = req.body;
    if (!type || amount === undefined) {
      return res.status(400).json({ success: false, message: 'type (add/subtract) and amount are required' });
    }

    const updated = await walletService.adjustWalletBalance(req.user!.id, Number(req.params.id), {
      type: type === 'subtract' ? 'subtract' : 'add',
      amount: Number(amount),
      note,
    });

    res.json({
      success: true,
      data: updated,
      message: `Balance successfully ${type === 'add' ? 'increased' : 'reduced'} by Rp ${Number(amount).toLocaleString('id-ID')}`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- SETUP INITIAL BALANCE ----
export const setupInitialBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, wallet_name } = req.body;
    if (amount === undefined) {
      return res.status(400).json({ success: false, message: 'amount is required' });
    }

    const wallet = await walletService.setupInitialBalance(
      req.user!.id,
      Number(amount),
      wallet_name || 'Dompet Utama'
    );

    res.json({
      success: true,
      data: wallet,
      message: `Initial balance of Rp ${Number(amount).toLocaleString('id-ID')} has been set successfully`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
