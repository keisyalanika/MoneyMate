import { BaseRepository } from './base/BaseRepository';
import { AdminSummary, ISummaryRepository, UserSummary } from './interfaces/ISummaryRepository';
import { toNumber } from './mappers/MapperHelpers';

export class SummaryRepository extends BaseRepository implements ISummaryRepository {
  async userSummary(userId: number): Promise<UserSummary> {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [income, expense, activeBudgetsCount, activeGoalsCount, recentTransactionsCount, wallets] =
      await Promise.all([
        this.db.transaction.aggregate({
          where: { userId, type: 'income' },
          _sum: { amount: true },
        }),
        this.db.transaction.aggregate({
          where: { userId, type: 'expense' },
          _sum: { amount: true },
        }),
        this.db.budget.count({ where: { userId, isActive: true } }),
        this.db.goal.count({ where: { userId, isCompleted: false } }),
        this.db.transaction.count({ where: { userId, date: { gte: since } } }),
        this.db.wallet.aggregate({ where: { userId }, _sum: { balance: true } }),
      ]);

    const totalIncome = toNumber(income._sum.amount);
    const totalExpense = toNumber(expense._sum.amount);
    const totalBalance =
      wallets._sum.balance !== null ? toNumber(wallets._sum.balance) : totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      totalBalance,
      activeBudgetsCount,
      activeGoalsCount,
      recentTransactionsCount,
    };
  }

  async adminSummary(): Promise<AdminSummary> {
    const [totalUsers, activeUsers, income, expense, totalTransactions, activeBudgets, totalGoals] =
      await Promise.all([
        this.db.user.count(),
        this.db.user.count({ where: { isActive: true } }),
        this.db.transaction.aggregate({ where: { type: 'income' }, _sum: { amount: true } }),
        this.db.transaction.aggregate({ where: { type: 'expense' }, _sum: { amount: true } }),
        this.db.transaction.count(),
        this.db.budget.count({ where: { isActive: true } }),
        this.db.goal.count(),
      ]);

    const totalIncome = toNumber(income._sum.amount);
    const totalExpense = toNumber(expense._sum.amount);

    return {
      totalUsers,
      activeUsers,
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      totalTransactions,
      activeBudgets,
      totalGoals,
    };
  }
}
