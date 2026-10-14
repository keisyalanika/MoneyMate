import axios from 'axios';
import { FinancialSummary, Transaction, Category, Goal, IncomeSource, AiInsightItem, ReportItem, UserSettings } from '../models/types';

const API_BASE = 'http://localhost:5000/api';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

// Interceptor to automatically attach token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= AUTH =================
export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const res = await client.post('/auth/login', { email: normalizedEmail, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  } catch (err: any) {
    const serverMsg = err.response?.data?.message;
    throw new Error(serverMsg || 'Login gagal. Periksa kembali email dan kata sandi Anda atau pastikan server backend aktif.');
  }
};

export const registerUser = async (data: { name: string; email: string; password: string; phone?: string }): Promise<any> => {
  const normalizedEmail = data.email.trim().toLowerCase();

  try {
    const res = await client.post('/auth/register', { ...data, email: normalizedEmail });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  } catch (err: any) {
    const serverMsg = err.response?.data?.message;
    throw new Error(serverMsg || 'Pendaftaran gagal. Periksa kembali data Anda.');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ================= SUMMARY =================
export const fetchSummary = async (): Promise<FinancialSummary> => {
  try {
    const res = await client.get('/summary');
    return res.data.data;
  } catch {
    return {
      totalBalance: 12500000,
      totalIncome: 18000000,
      totalExpense: 5500000,
      activeBudgetsCount: 4,
      recentTransactionsCount: 5
    };
  }
};

// ================= TRANSACTIONS =================
export const fetchTransactions = async (type?: string, search?: string): Promise<Transaction[]> => {
  try {
    const res = await client.get('/transactions', { params: { type, search } });
    const rawData = res.data.data || [];
    // Map backend data shape to frontend Transaction shape if needed
    return rawData.map((tx: any) => ({
      id: String(tx.id),
      title: tx.note || tx.title || 'Transaksi',
      amount: Number(tx.amount),
      type: (tx.type?.toUpperCase() === 'INCOME' ? 'INCOME' : 'EXPENSE') as any,
      categoryId: String(tx.category_id || tx.categoryId),
      categoryName: tx.category_name || tx.categoryName || 'Lainnya',
      categoryIcon: tx.category_icon || tx.categoryIcon || 'tag',
      date: tx.date || new Date().toISOString(),
      notes: tx.note || tx.notes,
    }));
  } catch {
    return [];
  }
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
  const payload = {
    amount: data.amount,
    type: data.type?.toLowerCase() || 'expense',
    category_id: Number(data.categoryId) || 1,
    date: data.date ? data.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note: data.title || data.notes || '',
  };
  const res = await client.post('/transactions', payload);
  return res.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await client.delete(`/transactions/${id}`);
};

// ================= CATEGORIES =================
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await client.get('/categories');
    const rawData = res.data.data || [];
    return rawData.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
      type: (cat.type?.toUpperCase() === 'INCOME' ? 'INCOME' : 'EXPENSE') as any,
      icon: cat.icon || 'tag',
      color: cat.color || '#3B82F6'
    }));
  } catch {
    return [
      { id: 'cat-inc-1', name: 'Gaji Bulanan', type: 'INCOME', icon: 'wallet', color: '#10B981' },
      { id: 'cat-exp-1', name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'utensils', color: '#EF4444' },
      { id: 'cat-exp-2', name: 'Transportasi', type: 'EXPENSE', icon: 'bus', color: '#F59E0B' }
    ];
  }
};

// ================= BUDGETS =================
export const fetchBudgets = async (): Promise<any[]> => {
  try {
    const res = await client.get('/budgets');
    const rawData = res.data.data || [];
    return rawData.map((b: any) => ({
      id: String(b.id),
      userId: b.user_id,
      userName: b.user_name || 'Pengguna',
      categoryId: String(b.category_id),
      categoryName: b.category_name || 'Kategori',
      limitAmount: Number(b.amount || b.limitAmount || 0),
      spentAmount: Number(b.spent_amount || b.spentAmount || 0),
      percentage: Number(b.percentage || 0)
    }));
  } catch (err: any) {
    console.warn('Backend budgets unavailable, returning empty list:', err.message);
    return [];
  }
};

// ================= GOALS =================
export const fetchGoals = async (): Promise<Goal[]> => {
  try {
    const res = await client.get('/goals');
    const rawData = res.data.data || [];
    return rawData.map((g: any) => ({
      id: String(g.id),
      title: g.title,
      targetAmount: Number(g.target_amount || 0),
      currentAmount: Number(g.current_amount || 0),
      deadline: g.deadline,
      isCompleted: Boolean(g.is_completed),
      icon: g.icon || 'target'
    }));
  } catch {
    return [];
  }
};

export const createGoal = async (data: { title: string; target_amount: number; icon?: string; deadline?: string }): Promise<Goal> => {
  const res = await client.post('/goals', data);
  return res.data.data;
};

export const addGoalFund = async (goalId: string | number, amount: number, note?: string): Promise<any> => {
  const res = await client.post(`/goals/${goalId}/funds`, { amount, note });
  return res.data.data;
};

// ================= INCOME SOURCES =================
export const fetchIncomeSources = async (): Promise<IncomeSource[]> => {
  try {
    const res = await client.get('/income-sources');
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const createIncomeSource = async (source_name: string): Promise<IncomeSource> => {
  const res = await client.post('/income-sources', { source_name });
  return res.data.data;
};

// ================= AI INSIGHTS =================
export const fetchAiInsights = async (): Promise<AiInsightItem[]> => {
  try {
    const res = await client.get('/insights');
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const createAiInsight = async (data: { insight_type: string; content: string; user_id?: number }): Promise<AiInsightItem> => {
  const res = await client.post('/insights', data);
  return res.data.data;
};

// ================= REPORTS =================
export const fetchReports = async (reportType?: string): Promise<ReportItem[]> => {
  try {
    const res = await client.get('/reports', { params: { report_type: reportType } });
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const createReport = async (data: Partial<ReportItem>): Promise<ReportItem> => {
  const res = await client.post('/reports', data);
  return res.data.data;
};

// ================= USER SETTINGS =================
export const fetchUserSettings = async (): Promise<UserSettings> => {
  try {
    const res = await client.get('/settings');
    return res.data.data;
  } catch {
    return {
      currency: 'IDR',
      language: 'id',
      theme: 'light',
      notification_enabled: true
    };
  }
};

export const updateUserSettings = async (data: Partial<UserSettings>): Promise<UserSettings> => {
  const res = await client.put('/settings', data);
  return res.data.data;
};

// ================= USERS MANAGEMENT (Admin) =================
export const fetchUsersList = async (): Promise<any[]> => {
  try {
    const res = await client.get('/users');
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const createNewUser = async (data: any): Promise<any> => {
  const res = await client.post('/users', data);
  return res.data.data;
};

// ================= TRANSACTIONS (Backend Integration) =================
export interface BackendTransaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: number;
  category_id?: number;
  income_source_id?: number;
  date: string;
  note?: string;
  receipt_image_url?: string;
  category_name?: string;
  category_icon?: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
  income_source_name?: string;
  created_at?: string;
}

export const fetchTransactionsList = async (limit = 20): Promise<BackendTransaction[]> => {
  try {
    const res = await client.get(`/transactions?limit=${limit}`);
    return res.data.data || [];
  } catch (err: any) {
    console.warn('Backend transactions unavailable, fallback to mock feed:', err.message);
    return [];
  }
};

