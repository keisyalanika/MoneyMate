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

// Local fallback accounts matching Mobile AuthProvider
const getLocalUsers = (): Record<string, { id: number; name: string; password: string; role: string }> => {
  const defaults: Record<string, { id: number; name: string; password: string; role: string }> = {
    'admin@moneymate.com': {
      id: 1,
      name: 'Admin MoneyMate',
      password: 'admin123',
      role: 'admin',
    },
    'keisyaexahaniyah@gmail.com': {
      id: 2,
      name: 'Keisya Exa Haniyah',
      password: 'Admin123',
      role: 'student',
    },
  };
  try {
    const saved = localStorage.getItem('moneymate_registered_users');
    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
    }
  } catch (_) {}
  return defaults;
};

const saveLocalUser = (email: string, user: { id: number; name: string; password: string; role: string }) => {
  try {
    const current = getLocalUsers();
    current[email.toLowerCase()] = user;
    localStorage.setItem('moneymate_registered_users', JSON.stringify(current));
  } catch (_) {}
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Coba login ke Backend API
  try {
    const res = await client.post('/auth/login', { email: normalizedEmail, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  } catch (err: any) {
    console.warn('Backend login unavailable or failed, checking offline fallback:', err.message);

    // 2. Fallback offline jika backend mati atau error koneksi (sinkron dengan Mobile App)
    const localUsers = getLocalUsers();
    const user = localUsers[normalizedEmail];
    if (user) {
      if (user.password === password) {
        const fallbackData: LoginResponse = {
          id: user.id,
          name: user.name,
          email: normalizedEmail,
          role: user.role,
          token: `token_fallback_${Date.now()}`,
        };
        localStorage.setItem('token', fallbackData.token);
        localStorage.setItem('user', JSON.stringify(fallbackData));
        return fallbackData;
      } else {
        throw new Error('Kata sandi yang Anda masukkan salah.');
      }
    }

    // Jika akun tidak terdaftar di backend maupun fallback
    const serverMsg = err.response?.data?.message;
    throw new Error(serverMsg || 'Akun belum terdaftar atau backend tidak aktif. Silakan gunakan kredensial demo atau daftar terlebih dahulu.');
  }
};

export const registerUser = async (data: { name: string; email: string; password: string; phone?: string }): Promise<any> => {
  const normalizedEmail = data.email.trim().toLowerCase();

  // 1. Coba daftar ke Backend API
  try {
    const res = await client.post('/auth/register', { ...data, email: normalizedEmail });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    saveLocalUser(normalizedEmail, {
      id: res.data.id || Date.now(),
      name: data.name,
      password: data.password,
      role: 'student',
    });
    return res.data;
  } catch (err: any) {
    console.warn('Backend register unavailable, saving locally as fallback:', err.message);

    // 2. Fallback offline register
    const localUsers = getLocalUsers();
    if (localUsers[normalizedEmail]) {
      throw new Error('Email sudah terdaftar. Silakan langsung masuk.');
    }

    const newUser = {
      id: Date.now(),
      name: data.name,
      password: data.password,
      role: 'student',
    };
    saveLocalUser(normalizedEmail, newUser);

    const fallbackRes = {
      ...newUser,
      email: normalizedEmail,
      token: `token_fallback_${Date.now()}`,
    };
    localStorage.setItem('token', fallbackRes.token);
    localStorage.setItem('user', JSON.stringify(fallbackRes));
    return fallbackRes;
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
