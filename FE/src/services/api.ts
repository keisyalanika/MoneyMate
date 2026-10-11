import axios from 'axios';
import { FinancialSummary, Transaction, Category, Budget } from '../models/types';

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
  const res = await client.post('/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
  }
  return res.data;
};

export const registerUser = async (data: { name: string; email: string; password: string; phone?: string }): Promise<any> => {
  const res = await client.post('/auth/register', data);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
  }
  return res.data;
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
    return [
      {
        id: 'tx-001',
        title: 'Gaji Bulanan Software Engineer',
        amount: 15000000,
        type: 'INCOME',
        categoryId: 'cat-inc-1',
        categoryName: 'Gaji Bulanan',
        categoryIcon: 'wallet',
        date: new Date().toISOString(),
        notes: 'Transfer Gaji Pokok'
      },
      {
        id: 'tx-002',
        title: 'Makan Siang Resto SE',
        amount: 125000,
        type: 'EXPENSE',
        categoryId: 'cat-exp-1',
        categoryName: 'Makanan & Minuman',
        categoryIcon: 'utensils',
        date: new Date().toISOString(),
        notes: 'Makan siang bersama tim'
      }
    ];
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
export const fetchBudgets = async (): Promise<Budget[]> => {
  try {
    const res = await client.get('/budgets');
    const rawData = res.data.data || [];
    return rawData.map((b: any) => ({
      id: String(b.id),
      categoryId: String(b.category_id),
      categoryName: b.category_name || 'Kategori',
      limitAmount: Number(b.amount || b.limitAmount || 0),
      spentAmount: Number(b.spent_amount || b.spentAmount || 0),
      percentage: Number(b.percentage || 0)
    }));
  } catch {
    return [
      { id: 'bg-001', categoryId: 'cat-exp-1', categoryName: 'Makanan & Minuman', limitAmount: 3000000, spentAmount: 125000, percentage: 4.17 },
      { id: 'bg-002', categoryId: 'cat-exp-2', categoryName: 'Transportasi', limitAmount: 1500000, spentAmount: 350000, percentage: 23.33 }
    ];
  }
};
