import { BaseRepository, goalRepository } from '../repositories';
import { GoalRepository } from '../repositories/GoalRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { AppError } from '../errors/AppError';

interface FundInput {
  goal_id: number;
  user_id: number;
  amount: number;
  note?: string;
  wallet_id?: number;
}

export class GoalService {
  constructor(private readonly goals = goalRepository) {}

  getGoals(userId: number) {
    return this.goals.findByUser(userId);
  }

  getGoalById(id: number, userId?: number) {
    return this.goals.findById(id, userId);
  }

  async createGoal(data: {
    user_id: number;
    title: string;
    target_amount: number;
    initial_deposit?: number;
    wallet_id?: number;
    icon?: string;
    deadline?: string;
  }) {
    const targetAmount = Number(data.target_amount);
    const initialDeposit = Number(data.initial_deposit || 0);

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      throw AppError.badRequest('Target nominal harus lebih dari 0.', 'INVALID_TARGET');
    }
    if (!Number.isFinite(initialDeposit) || initialDeposit < 0) {
      throw AppError.badRequest('Setoran awal tidak valid.', 'INVALID_AMOUNT');
    }

    const goalId = await BaseRepository.runInTransaction(async (tx) => {
      const goals = new GoalRepository(tx);
      const id = await goals.create({
        user_id: data.user_id,
        title: data.title,
        target_amount: targetAmount,
        icon: data.icon,
        deadline: data.deadline,
      });

      if (initialDeposit > 0) {
        await this.applyFund(goals, new NotificationRepository(tx), {
          goal_id: id,
          user_id: data.user_id,
          amount: initialDeposit,
          note: 'Setoran awal goal',
          wallet_id: data.wallet_id,
        });
      }

      return id;
    });

    return this.goals.findById(goalId, data.user_id);
  }

  updateGoal(
    id: number,
    userId: number,
    data: {
      title?: string;
      target_amount?: number;
      icon?: string;
      deadline?: string;
      is_completed?: boolean;
    }
  ) {
    return this.goals.update(id, userId, data);
  }

  async deleteGoal(id: number, userId: number): Promise<boolean> {
    return BaseRepository.runInTransaction(async (tx) => {
      const goals = new GoalRepository(tx);

      const goal = await goals.lockById(id, userId);
      if (!goal) return false;

      const refund = goal.current_amount;
      const removed = await goals.remove(id, userId);

      if (refund > 0) {
        const wallets = await goals.lockWallets(userId);
        if (wallets.length > 0) {
          await goals.creditWalletBalance(wallets[0].id, userId, refund);
        } else {
          await goals.createWallet(userId, 'Dompet Utama', refund, 'IDR');
        }
      }

      return removed;
    });
  }

  addFund(data: FundInput) {
    return BaseRepository.runInTransaction(async (tx) =>
      this.applyFund(new GoalRepository(tx), new NotificationRepository(tx), data)
    );
  }

  async getGoalFunds(goalId: number, userId: number) {
    const goal = await this.goals.findById(goalId, userId);
    if (!goal) return [];
    return this.goals.findFunds(goalId, userId);
  }

  countActiveGoals(userId: number) {
    return this.goals.countActive(userId);
  }

  private async applyFund(
    goals: GoalRepository,
    notifications: NotificationRepository,
    data: FundInput
  ) {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw AppError.badRequest('Nominal setoran harus lebih dari 0.', 'INVALID_AMOUNT');
    }

    const goal = await goals.lockById(data.goal_id, data.user_id);
    if (!goal) {
      throw AppError.notFound('Goal tidak ditemukan.', 'GOAL_NOT_FOUND');
    }

    const wallets = await goals.lockWallets(data.user_id, data.wallet_id);
    if (wallets.length === 0) {
      throw AppError.badRequest(
        'Dompet aplikasi tidak ditemukan. Silakan buat dompet terlebih dahulu.',
        'WALLET_NOT_FOUND'
      );
    }

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    if (totalBalance < amount) {
      const source =
        data.wallet_id !== undefined && data.wallet_id !== null
          ? `dompet ${wallets[0].name}`
          : 'dompet aplikasi';
      throw AppError.badRequest(
        `Saldo ${source} tidak cukup. Saldo tersedia Rp ${totalBalance.toLocaleString('id-ID')}.`,
        'INSUFFICIENT_BALANCE'
      );
    }

    const fund = await goals.createFund({
      goal_id: data.goal_id,
      user_id: data.user_id,
      amount,
      note: data.note,
    });

    await goals.incrementCurrentAmount(data.goal_id, data.user_id, amount);

    // Potong saldo dompet default dulu, lanjut dompet lain bila kurang.
    let remaining = amount;
    for (const wallet of wallets) {
      if (remaining <= 0) break;
      const deduction = Math.min(wallet.balance, remaining);
      if (deduction > 0) {
        await goals.deductWalletBalance(wallet.id, data.user_id, deduction);
        remaining -= deduction;
      }
    }

    const updated = await goals.findById(data.goal_id, data.user_id);

    if (
      updated &&
      updated.current_amount >= updated.target_amount &&
      !updated.is_completed
    ) {
      await goals.setCompleted(data.goal_id, data.user_id, true);
      updated.is_completed = 1;

      try {
        await notifications.create({
          user_id: data.user_id,
          title: 'Target Keuangan Tercapai!',
          message: `Selamat! Target menabung "${goal.title}" sebesar Rp ${goal.target_amount.toLocaleString('id-ID')} telah sukses tercapai 100%!`,
        });
      } catch {
        // notifikasi opsional: jangan gagalkan setoran
      }
    }

    return { fund, goal: updated };
  }
}

export const goalService = new GoalService();
