import { categoryRepository, walletRepository } from '../repositories';
import { TransactionService, transactionService } from './TransactionService';

export class WalletService {
  constructor(
    private readonly wallets = walletRepository,
    private readonly transactions: TransactionService = transactionService,
    private readonly categories = categoryRepository
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

  async createWallet(data: {
    user_id: number;
    name: string;
    balance?: number;
    currency?: string;
    is_default?: boolean;
  }) {
    const balance = Number(data.balance ?? 0);
    const wallet = await this.wallets.create({ ...data, balance });

    if (balance > 0) {
      await this.transactions.recordSystemTransaction({
        user_id: data.user_id,
        type: 'income',
        amount: balance,
        note: 'Saldo awal dompet',
      });
    }

    return wallet;
  }

  async updateWallet(id: number, data: { name?: string; balance?: number; currency?: string }) {
    const existing = await this.wallets.findById(id);
    if (!existing) return null;

    const updated = await this.wallets.update(id, data);
    if (!updated) return null;

    if (data.balance !== undefined) {
      const delta = Number(data.balance) - existing.balance;
      if (Math.abs(delta) > 0.01) {
        await this.transactions.recordSystemTransaction({
          user_id: existing.user_id,
          type: delta > 0 ? 'income' : 'expense',
          amount: Math.abs(delta),
          note: 'Penyesuaian saldo dompet',
        });
      }
    }

    return updated;
  }

  deleteWallet(id: number) {
    return this.wallets.remove(id);
  }

  async adjustWalletBalance(
    userId: number,
    walletId: number,
    adjustment: { type: 'add' | 'subtract'; amount: number; note?: string; category_id?: number }
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
          balance: 0,
          is_default: true,
        });
      }
    }

    walletId = wallet.id;
    const amount = Number(adjustment.amount) || 0;
    const isAdd = adjustment.type === 'add';

    try {
      const categoryType = isAdd ? 'income' : 'expense';
      let categoryId: number | undefined;

      if (adjustment.category_id) {
        const selected = await this.categories.findById(adjustment.category_id);
        if (selected && selected.type.toLowerCase() === categoryType) {
          categoryId = selected.id;
        }
      }

      categoryId ??= await this.transactions.resolveSystemCategoryId(categoryType);

      await this.transactions.createTransaction({
        user_id: userId,
        wallet_id: walletId,
        type: categoryType,
        amount,
        category_id: categoryId ?? 1,
        date: new Date().toISOString().slice(0, 10),
        note:
          adjustment.note ||
          (isAdd
            ? 'Penyesuaian Tambah Saldo Manual'
            : 'Penyesuaian Pengurangan Saldo Manual'),
      });
    } catch (error) {
      console.warn('[Wallet] Could not log adjustment transaction:', (error as Error).message);
      const newBalance = isAdd
        ? wallet.balance + amount
        : Math.max(0, wallet.balance - amount);
      await this.wallets.setBalance(walletId, newBalance);
    }

    return this.wallets.findById(walletId);
  }

  async setupInitialBalance(userId: number, initialBalance: number, walletName = 'Dompet Utama') {
    const balance = Number(initialBalance) || 0;
    const wallets = await this.wallets.findByUser(userId);

    if (wallets.length > 0) {
      const defaultWallet = wallets.find((wallet) => wallet.is_default === 1) ?? wallets[0];
      const delta = balance - defaultWallet.balance;
      await this.wallets.setBalance(defaultWallet.id, balance);

      if (Math.abs(delta) > 0.01) {
        await this.transactions.recordSystemTransaction({
          user_id: userId,
          type: delta > 0 ? 'income' : 'expense',
          amount: Math.abs(delta),
          note: 'Saldo awal / penyesuaian dompet',
        });
      }

      return this.wallets.findById(defaultWallet.id);
    }

    const wallet = await this.wallets.create({
      user_id: userId,
      name: walletName,
      balance,
      is_default: true,
    });

    if (balance > 0) {
      await this.transactions.recordSystemTransaction({
        user_id: userId,
        type: 'income',
        amount: balance,
        note: 'Saldo awal dompet',
      });
    }

    return wallet;
  }
}

export const walletService = new WalletService();
