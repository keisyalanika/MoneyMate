export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  date: string;
  notes?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  activeBudgetsCount: number;
  recentTransactionsCount: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  isCompleted?: boolean;
  icon?: string;
}

export interface IncomeSource {
  id: number;
  source_name: string;
}

export interface AiInsightItem {
  id: number;
  insight_type: string;
  content: string;
  created_at?: string;
}

export interface ReportItem {
  id: number;
  title: string;
  report_type: 'monthly' | 'weekly' | 'custom' | 'annual';
  period_start?: string;
  period_end?: string;
  file_url?: string;
}

export interface UserSettings {
  currency: 'IDR' | 'USD';
  language: 'id' | 'en';
  theme: 'light' | 'dark';
  notification_enabled: boolean;
}

