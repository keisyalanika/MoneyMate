import {
  budgetRepository,
  notificationRepository,
  transactionRepository,
  walletRepository,
} from '../repositories';
import { TransactionType } from '../types';

const monthOf = (date: string) => {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return { month: parsed.getUTCMonth() + 1, year: parsed.getUTCFullYear() };
};

export class TransactionService {
  constructor(
    private readonly transactions = transactionRepository,
    private readonly wallets = walletRepository,
    private readonly budgets = budgetRepository,
    private readonly notifications = notificationRepository
  ) {}

  getAllTransactions(filters: {
    user_id?: number;
    type?: string;
    category_id?: number;
    search?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.transactions.findAll({
      ...filters,
      type: filters.type as TransactionType | undefined,
    });
  }

  getTransactionById(id: number) {
    return this.transactions.findById(id);
  }

  async createTransaction(data: {
    user_id: number;
    wallet_id?: number;
    type: string;
    amount: number;
    category_id: number;
    income_source_id?: number;
    date: string;
    note?: string;
    receipt_image_url?: string;
  }) {
    const id = await this.transactions.create({
      user_id: data.user_id,
      type: data.type as TransactionType,
      amount: data.amount,
      category_id: data.category_id,
      income_source_id: data.income_source_id ?? null,
      date: data.date,
      note: data.note ?? null,
      receipt_image_url: data.receipt_image_url ?? null,
    });

    await this.syncWalletBalance(data.user_id, data.type, Number(data.amount));
    await this.notifyBudgetThreshold(data);

    return this.transactions.findById(id);
  }

  async updateTransaction(
    id: number,
    data: {
      type?: string;
      amount?: number;
      category_id?: number;
      date?: string;
      note?: string;
    }
  ) {
    return this.transactions.update(id, {
      type: data.type as TransactionType | undefined,
      amount: data.amount,
      category_id: data.category_id,
      date: data.date,
      note: data.note,
    });
  }

  async deleteTransaction(id: number) {
    const transaction = await this.transactions.findById(id);
    if (transaction) {
      const isIncome = transaction.type?.toLowerCase() === 'income';
      const reverseDelta = isIncome ? -Number(transaction.amount) : Number(transaction.amount);
      await this.syncWalletBalance(
        transaction.user_id,
        isIncome ? 'expense' : 'income',
        Math.abs(reverseDelta),
        false
      );
    }

    return this.transactions.remove(id);
  }

  getMonthlySummary(userId: number, month: number, year: number) {
    return this.transactions.monthlySummary(userId, month, year);
  }

  getOverallSummary() {
    return this.transactions.overallSummary();
  }

  /** Menyesuaikan saldo dompet default setelah transaksi dibuat/dihapus. */
  private async syncWalletBalance(
    userId: number,
    type: string,
    amount: number,
    createIfMissing = true
  ) {
    const isIncome = type.toLowerCase() === 'income';
    const delta = isIncome ? amount : -amount;

    try {
      const wallets = await this.wallets.findByUser(userId);
      if (wallets.length > 0) {
        const currentBalance = wallets[0].balance;
        const newBalance = Math.max(0, currentBalance + delta);
        await this.wallets.setBalance(wallets[0].id, newBalance);
      } else if (createIfMissing) {
        await this.wallets.create({
          user_id: userId,
          name: 'Dompet Utama',
          balance: isIncome ? amount : 0,
          currency: 'IDR',
          is_default: true,
        });
      }
    } catch (error) {
      console.warn(
        '[AutoBalance] Gagal memperbarui saldo dompet:',
        (error as Error).message
      );
    }
  }

  /** Kirim notifikasi bila pengeluaran melewati 80% / 100% pagu anggaran. */
  private async notifyBudgetThreshold(data: {
    user_id: number;
    type: string;
    category_id: number;
    date: string;
  }) {
    if (data.type.toLowerCase() === 'income') return;

    try {
      const { month, year } = monthOf(data.date);
      const budget = await this.budgets.findForCategory(
        data.user_id,
        data.category_id,
        month,
        year
      );
      if (!budget) return;

      const totalSpent = await this.budgets.spentForCategory(
        data.user_id,
        data.category_id,
        month,
        year
      );
      const limitAmount = Number(budget.amount);
      const ratio = limitAmount > 0 ? (totalSpent / limitAmount) * 100 : 0;

      if (ratio >= 100) {
        await this.notifications.create({
          user_id: data.user_id,
          title: '⚠️ Peringatan Overbudget!',
          message: `Pengeluaran kategori ${budget.category_name} sudah mencapai Rp ${totalSpent.toLocaleString('id-ID')} (melebihi pagu anggaran Rp ${limitAmount.toLocaleString('id-ID')}).`,
        });
      } else if (ratio >= 80) {
        await this.notifications.create({
          user_id: data.user_id,
          title: '⚡ Peringatan Kuota Anggaran',
          message: `Pengeluaran kategori ${budget.category_name} telah mencapai ${Math.round(ratio)}% dari anggaran bulanan Anda.`,
        });
      }
    } catch (error) {
      console.warn(
        '[AutoNotification] Gagal memeriksa kuota anggaran:',
        (error as Error).message
      );
    }
  }
}

export const transactionService = new TransactionService();
