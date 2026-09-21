import { transactions, categories, budgets } from '../models/mockDb';
import { Transaction } from '../models/types';

export const getAllTransactions = (type?: string, search?: string): Transaction[] => {
  let list = [...transactions];
  if (type) {
    list = list.filter(t => t.type === type);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(t => t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q)));
  }
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const createTransaction = (payload: Partial<Transaction>): Transaction => {
  const category = categories.find(c => c.id === payload.categoryId);
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    title: payload.title || 'Transaksi Baru',
    amount: Number(payload.amount) || 0,
    type: payload.type || (category ? category.type : 'EXPENSE'),
    categoryId: payload.categoryId || 'cat-exp-1',
    categoryName: category ? category.name : 'Umum',
    categoryIcon: category ? category.icon : 'wallet',
    date: payload.date || new Date().toISOString(),
    notes: payload.notes || ''
  };

  transactions.unshift(newTx);

  // Update budget spent amount if expense
  if (newTx.type === 'EXPENSE') {
    const budget = budgets.find(b => b.categoryId === newTx.categoryId);
    if (budget) {
      budget.spentAmount += newTx.amount;
      budget.percentage = Number(((budget.spentAmount / budget.limitAmount) * 100).toFixed(2));
    }
  }

  return newTx;
};

export const deleteTransaction = (id: string): boolean => {
  const idx = transactions.findIndex(t => t.id === id);
  if (idx !== -1) {
    const [deleted] = transactions.splice(idx, 1);
    if (deleted.type === 'EXPENSE') {
      const budget = budgets.find(b => b.categoryId === deleted.categoryId);
      if (budget) {
        budget.spentAmount = Math.max(0, budget.spentAmount - deleted.amount);
        budget.percentage = Number(((budget.spentAmount / budget.limitAmount) * 100).toFixed(2));
      }
    }
    return true;
  }
  return false;
};
