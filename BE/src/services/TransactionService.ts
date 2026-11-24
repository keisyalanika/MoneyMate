import {
  budgetRepository,
  categoryRepository,
  notificationRepository,
  transactionRepository,
  walletRepository,
} from '../repositories';
import { AppError } from '../errors/AppError';
import { TransactionType } from '../types';

const monthOf = (date: string) => {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return { month: parsed.getUTCMonth() + 1, year: parsed.getUTCFullYear() };
};

const isFutureDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return false;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return parsed.getTime() > today.getTime();
};

export class TransactionService {
  constructor(
    private readonly transactions = transactionRepository,
    private readonly wallets = walletRepository,
    private readonly budgets = budgetRepository,
    private readonly notifications = notificationRepository,
    private readonly categories = categoryRepository
  ) {}

  async resolveCategoryId(categoryName?: string, type: string = 'expense'): Promise<number | undefined> {
    const name = categoryName?.trim();
    if (!name) return undefined;

    const list = await this.categories.findAll(type as TransactionType);
    const normalized = name.toLowerCase();
    const match =
      list.find((item) => item.name.toLowerCase() === normalized) ??
      list.find((item) => item.name.toLowerCase().includes(normalized) || normalized.includes(item.name.toLowerCase()));
    return match?.id;
  }

  /**
   * Kategori khusus untuk penyesuaian saldo manual:
   * `Tambah Saldo` (income) dan `Kurangi Saldo` (expense).
   * Dibuat otomatis bila belum tersedia.
   */
  async resolveSystemCategoryId(type: TransactionType): Promise<number | undefined> {
    const name = type === 'income' ? 'Tambah Saldo' : 'Kurangi Saldo';
    const list = await this.categories.findAll(type);
    const existing = list.find(
      (item) => item.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (existing) return existing.id;

    const created = await this.categories.create({
      name,
      type,
      icon: type === 'income' ? 'plus-circle' : 'minus-circle',
    });
    return created.id;
  }

  /**
   * Mencatat transaksi penyesuaian (saldo awal / perubahan saldo manual)
   * TANPA menyentuh saldo dompet, karena saldo sudah diubah oleh pemanggil.
   */
  async recordSystemTransaction(data: {
    user_id: number;
    type: TransactionType;
    amount: number;
    note?: string;
    date?: string;
  }) {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) return null;

    const categoryId = await this.resolveSystemCategoryId(data.type);
    if (!categoryId) return null;

    const id = await this.transactions.create({
      user_id: data.user_id,
      type: data.type,
      amount,
      category_id: categoryId,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      note: data.note ?? null,
    });

    return this.transactions.findById(id);
  }

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
    name?: string;
    income_source_id?: number;
    date: string;
    note?: string;
    receipt_image_url?: string;
  }) {
    if (isFutureDate(data.date)) {
      throw AppError.badRequest(
        'Tanggal transaksi tidak boleh melebihi hari ini.',
        'FUTURE_DATE_NOT_ALLOWED'
      );
    }

    const id = await this.transactions.create({
      user_id: data.user_id,
      type: data.type as TransactionType,
      amount: data.amount,
      category_id: data.category_id,
      name: data.name ?? null,
      income_source_id: data.income_source_id ?? null,
      date: data.date,
      note: data.note ?? null,
      receipt_image_url: data.receipt_image_url ?? null,
    });

    await this.syncWalletBalance(data.user_id, data.type, Number(data.amount), true, data.wallet_id);
    await this.notifyBudgetThreshold(data);

    return this.transactions.findById(id);
  }

  async updateTransaction(
    id: number,
    data: {
      type?: string;
      amount?: number;
      category_id?: number;
      name?: string;
      date?: string;
      note?: string;
    }
  ) {
    const existing = await this.transactions.findById(id);
    if (!existing) return null;

    const updated = await this.transactions.update(id, {
      type: data.type as TransactionType | undefined,
      amount: data.amount,
      category_id: data.category_id,
      name: data.name,
      date: data.date,
      note: data.note,
    });
    if (!updated) return null;

    const oldDelta =
      existing.type?.toLowerCase() === 'income' ? Number(existing.amount) : -Number(existing.amount);
    const newDelta =
      updated.type?.toLowerCase() === 'income' ? Number(updated.amount) : -Number(updated.amount);
    const delta = newDelta - oldDelta;

    if (delta !== 0) {
      await this.applyWalletDelta(existing.user_id, delta);
    }

    return updated;
  }

  async deleteTransaction(id: number) {
    const transaction = await this.transactions.findById(id);
    if (transaction) {
      const oldDelta =
        transaction.type?.toLowerCase() === 'income'
          ? Number(transaction.amount)
          : -Number(transaction.amount);
      await this.applyWalletDelta(transaction.user_id, -oldDelta);
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
    createIfMissing = true,
    walletId?: number
  ) {
    const isIncome = type.toLowerCase() === 'income';
    const delta = isIncome ? amount : -amount;
    await this.applyWalletDelta(userId, delta, { createIfMissing, walletId });
  }

  /** Menerapkan perubahan saldo (positif/negatif) ke satu dompet user. */
  private async applyWalletDelta(
    userId: number,
    delta: number,
    options: { createIfMissing?: boolean; walletId?: number } = {}
  ) {
    const { createIfMissing = true, walletId } = options;

    try {
      const wallets = await this.wallets.findByUser(userId);
      let wallet = walletId != null ? wallets.find((item) => item.id === walletId) : undefined;
      wallet ??= wallets[0];

      if (wallet) {
        const newBalance = Math.max(0, wallet.balance + delta);
        await this.wallets.setBalance(wallet.id, newBalance);
      } else if (createIfMissing && delta > 0) {
        await this.wallets.create({
          user_id: userId,
          name: 'Dompet Utama',
          balance: delta,
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
