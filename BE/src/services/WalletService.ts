import { walletRepository } from '../repositories';
import { TransactionService, transactionService } from './TransactionService';

export class WalletService {
  constructor(
    private readonly wallets = walletRepository,
    private readonly transactions: TransactionService = transactionService
  ) {}

  async getWallets(userId: number) {
    const wallets = await this.wallets.findByUser(userId);
    return {
      wallets,
      totalBalance: wallets.reduce((sum, wallet) => sum + wallet.balance, 0),
    };
  }

  getWalletById(id: number) {
    return this.wallets.findById(id);
  }

  createWallet(data: {
    user_id: number;
    name: string;
    balance?: number;
    currency?: string;
    is_default?: boolean;
  }) {
    return this.wallets.create(data);
  }

  updateWallet(id: number, data: { name?: string; balance?: number; currency?: string }) {
    return this.wallets.update(id, data);
  }

  deleteWallet(id: number) {
    return this.wallets.remove(id);
  }

  async adjustWalletBalance(
    userId: number,
    walletId: number,
    adjustment: { type: 'add' | 'subtract'; amount: number; note?: string }
  ) {
    let wallet = await this.wallets.findById(walletId);
    if (!wallet) {
      const userWallets = await this.wallets.findByUser(userId);
      if (userWallets.length > 0) {
        wallet = userWallets[0];
      } else {
        wallet = await this.wallets.create({
          user_id: userId,
          name: 'Dompet Utama',
          balance: 2450000,
          is_default: true,
        });
      }
    }

    walletId = wallet.id;
    const currentBalance = wallet.balance;
    const amount = Number(adjustment.amount) || 0;
    const isAdd = adjustment.type === 'add';
    const newBalance = isAdd
      ? currentBalance + amount
      : Math.max(0, currentBalance - amount);

    await this.wallets.setBalance(walletId, newBalance);

    try {
      await this.transactions.createTransaction({
        user_id: userId,
        wallet_id: walletId,
        type: isAdd ? 'income' : 'expense',
        amount,
        category_id: isAdd ? 6 : 14,
        date: new Date().toISOString().slice(0, 10),
        note:
          adjustment.note ||
          (isAdd
            ? 'Penyesuaian Tambah Saldo Manual'
            : 'Penyesuaian Pengurangan Saldo Manual'),
      });
    } catch (error) {
      console.warn('[Wallet] Could not log adjustment transaction:', (error as Error).message);
    }

    return this.wallets.findById(walletId);
  }

  async setupInitialBalance(userId: number, initialBalance: number, walletName = 'Dompet Utama') {
    const wallets = await this.wallets.findByUser(userId);
    if (wallets.length > 0) {
      const defaultWallet = wallets.find((wallet) => wallet.is_default === 1) ?? wallets[0];
      await this.wallets.setBalance(defaultWallet.id, initialBalance);
      return this.wallets.findById(defaultWallet.id);
    }

    return this.wallets.create({
      user_id: userId,
      name: walletName,
      balance: initialBalance,
      is_default: true,
    });
  }
}

export const walletService = new WalletService();
