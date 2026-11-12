export interface UserSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  activeBudgetsCount: number;
  activeGoalsCount: number;
  recentTransactionsCount: number;
}

export interface AdminSummary {
  totalUsers: number;
  activeUsers: number;
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalTransactions: number;
  activeBudgets: number;
  totalGoals: number;
}

export interface ISummaryRepository {
  userSummary(userId: number): Promise<UserSummary>;
  adminSummary(): Promise<AdminSummary>;
}
