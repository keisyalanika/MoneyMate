// ============================================
// Shared TypeScript types for MoneyMate DB
// ============================================

export type TransactionType = 'income' | 'expense';
export type UserRole = 'student' | 'admin';
export type ReportType = 'monthly' | 'weekly' | 'custom' | 'annual';
export type CurrencyType = 'IDR' | 'USD';
export type ThemeType = 'light' | 'dark';
export type LangType = 'id' | 'en';

// ---------- Users ----------
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;        // excluded on responses
  avatar_url?: string;
  birth_date?: string;
  bio?: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ---------- Wallets ----------
export interface Wallet {
  id: number;
  user_id: number;
  name: string;
  balance: number;
  currency: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

// ---------- OTP Codes ----------
export interface OtpCode {
  id: number;
  email: string;
  otp_code: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

// ---------- Categories ----------
export interface Category {
  id: number;
  user_id?: number;
  name: string;
  type: TransactionType;
  icon: string;
  color?: string;
  is_pinned?: boolean;
  created_at: Date;
}

// ---------- Income Sources ----------
export interface IncomeSource {
  id: number;
  user_id: number;
  source_name: string;
  created_at: Date;
}

// ---------- Transactions ----------
export interface Transaction {
  id: number;
  user_id: number;
  wallet_id?: number;
  type: TransactionType;
  amount: number;
  category_id: number;
  income_source_id?: number;
  date: string;
  note?: string;
  receipt_image_url?: string;
  created_at: Date;
  // joined fields
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  user_name?: string;
  wallet_name?: string;
}

// ---------- Budgets ----------
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  month: number;
  year: number;
  is_active: boolean;
  created_at: Date;
  // joined/computed fields
  category_name?: string;
  category_icon?: string;
  spent_amount?: number;
  percentage?: number;
}

// ---------- Goals ----------
export interface Goal {
  id: number;
  user_id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  icon?: string;
  deadline?: string;
  is_completed: boolean;
  created_at: Date;
}

// ---------- Goal Funds ----------
export interface GoalFund {
  id: number;
  goal_id: number;
  user_id: number;
  amount: number;
  note?: string;
  created_at: Date;
}

// ---------- AI Insights ----------
export interface AiInsight {
  id: number;
  user_id: number;
  insight_type: string;
  content: string;
  created_at: Date;
}

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

// ---------- Notifications ----------
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: Date;
}

// ---------- Reports ----------
export interface Report {
  id: number;
  user_id?: number;
  generated_by: number;
  report_type: ReportType;
  title?: string;
  period_start?: string;
  period_end?: string;
  file_url?: string;
  created_at: Date;
}

// ---------- User Settings ----------
export interface UserSettings {
  id: number;
  user_id: number;
  currency: CurrencyType;
  language: LangType;
  theme: ThemeType;
  notification_enabled: boolean;
  default_budget_limit?: number;
  ews_enabled?: boolean;
  updated_at: Date;
}

// ---------- Audit Logs ----------
export interface AuditLog {
  id: number;
  admin_id: number;
  action: string;
  target_table?: string;
  target_id?: number;
  description?: string;
  created_at: Date;
}

// ---------- Financial Summary (computed) ----------
export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  activeBudgetsCount: number;
  activeGoalsCount: number;
  totalUsers: number;
}

