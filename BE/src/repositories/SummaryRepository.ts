import { BaseRepository } from './base/BaseRepository';
import { AdminDashboard, AdminSummary, ISummaryRepository, UserSummary } from './interfaces/ISummaryRepository';
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

  async adminDashboard(): Promise<AdminDashboard> {
    const now = new Date();
    const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const studentWhere = { role: 'student' as const };

    const [total, active, inactive, newLast30Days] = await Promise.all([
      this.db.user.count({ where: studentWhere }),
      this.db.user.count({ where: { ...studentWhere, isActive: true } }),
      this.db.user.count({ where: { ...studentWhere, isActive: false } }),
      this.db.user.count({ where: { ...studentWhere, createdAt: { gte: since30 } } }),
    ]);

    const [latestRows, usageRows, recentUsers] = await Promise.all([
      this.db.user.findMany({
        where: studentWhere,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.db.transaction.groupBy({
        by: ['categoryId'],
        where: { type: 'expense', date: { gte: since30 } },
        _count: { _all: true },
      }),
      this.db.user.findMany({
        where: { ...studentWhere, createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
        select: { createdAt: true },
      }),
    ]);

    const categoryIds = usageRows.map((row) => row.categoryId);
    const categories = categoryIds.length
      ? await this.db.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true },
        })
      : [];
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

    const totalUsage = usageRows.reduce((sum, row) => sum + row._count._all, 0);
    const distribution = usageRows
      .map((row) => ({
        name: categoryNames.get(row.categoryId) ?? 'Lainnya',
        count: row._count._all,
        percentage: totalUsage > 0 ? Math.round((row._count._all / totalUsage) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const growth: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i -= 1) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      growth.push({
        month: monthNames[start.getMonth()],
        count: recentUsers.filter((user) => user.createdAt >= start && user.createdAt <= end).length,
      });
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const latest = latestRows.map((user) => ({
      id: user.id,
      code: `USR-${String(user.id).padStart(3, '0')}`,
      name: user.name,
      email: user.email,
      phone: user.phone || '-',
      joinedAt: formatter.format(user.createdAt),
      status: user.isActive ? ('Aktif' as const) : ('Nonaktif' as const),
    }));

    return {
      stats: { total, active, inactive, newLast30Days },
      distribution,
      growth,
      latest,
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
