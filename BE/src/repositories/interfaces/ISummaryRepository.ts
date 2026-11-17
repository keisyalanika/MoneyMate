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

export interface AdminDashboardStats {
  total: number;
  active: number;
  inactive: number;
  newLast30Days: number;
}

export interface AdminCategoryUsage {
  name: string;
  count: number;
  percentage: number;
}

export interface AdminUserGrowth {
  month: string;
  count: number;
}

export interface AdminLatestUser {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface AdminDashboard {
  stats: AdminDashboardStats;
  distribution: AdminCategoryUsage[];
  growth: AdminUserGrowth[];
  latest: AdminLatestUser[];
}

export interface ISummaryRepository {
  userSummary(userId: number): Promise<UserSummary>;
  adminSummary(): Promise<AdminSummary>;
  adminDashboard(): Promise<AdminDashboard>;
}
