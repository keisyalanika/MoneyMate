import axios from 'axios';
import { FinancialSummary, Transaction, Category, Budget } from '../models/types';

const API_BASE = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

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

export const fetchTransactions = async (type?: string, search?: string): Promise<Transaction[]> => {
  try {
    const res = await client.get('/transactions', { params: { type, search } });
    return res.data.data;
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
  const res = await client.post('/transactions', data);
  return res.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await client.delete(`/transactions/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await client.get('/categories');
    return res.data.data;
  } catch {
    return [
      { id: 'cat-inc-1', name: 'Gaji Bulanan', type: 'INCOME', icon: 'wallet', color: '#10B981' },
      { id: 'cat-exp-1', name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'utensils', color: '#EF4444' },
      { id: 'cat-exp-2', name: 'Transportasi', type: 'EXPENSE', icon: 'bus', color: '#F59E0B' }
    ];
  }
};

export const fetchBudgets = async (): Promise<Budget[]> => {
  try {
    const res = await client.get('/budgets');
    return res.data.data;
  } catch {
    return [
      { id: 'bg-001', categoryId: 'cat-exp-1', categoryName: 'Makanan & Minuman', limitAmount: 3000000, spentAmount: 125000, percentage: 4.17 },
      { id: 'bg-002', categoryId: 'cat-exp-2', categoryName: 'Transportasi', limitAmount: 1500000, spentAmount: 350000, percentage: 23.33 }
    ];
  }
};
