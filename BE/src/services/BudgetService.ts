import { budgetRepository, notificationRepository } from '../repositories';

export class BudgetService {
  constructor(
    private readonly budgets = budgetRepository,
    private readonly notifications = notificationRepository
  ) {}

  getBudgets(userId: number, month?: number, year?: number) {
    return this.budgets.findByUser(userId, month, year);
  }

  getAllBudgets() {
    return this.budgets.findAll();
  }

  createBudget(data: {
    user_id: number;
    category_id: number;
    amount: number;
    month: number;
    year: number;
  }) {
    return this.budgets.upsert(data);
  }

  updateBudget(id: number, data: { amount?: number; is_active?: boolean }) {
    return this.budgets.update(id, data);
  }

  deleteBudget(id: number) {
    return this.budgets.remove(id);
  }

  countActiveBudgets(userId: number) {
    return this.budgets.countActive(userId);
  }

  /** Kirim peringatan/apresiasi admin ke pemilik budget. */
  async sendBudgetAlert(budgetId: number, alertType?: string, customMessage?: string) {
    const budget = await this.budgets.findById(budgetId);
    if (!budget) return null;

    const isWarning = alertType === 'warning';
    const title = isWarning
      ? '⚠️ Peringatan Anggaran dari Admin'
      : '👏 Apresiasi Keuangan dari Admin';
    const message =
      customMessage ||
      (isWarning
        ? `Pengeluaran Anda untuk kategori ${budget.category_name || 'ini'} sudah mendekati atau melebihi limit anggaran. Mohon evaluasi pengeluaran Anda.`
        : `Pengeluaran Anda untuk kategori ${budget.category_name || 'ini'} terkontrol dengan sangat baik! Terus pertahankan kedisiplinan keuangan Anda.`);

    await this.notifications.create({
      user_id: budget.user_id,
      title,
      message,
    });

    return {
      user_id: budget.user_id,
      user_name: budget.user_name || 'mahasiswa',
      title,
      message,
    };
  }
}

export const budgetService = new BudgetService();
