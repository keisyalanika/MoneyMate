import { Category, Transaction, Budget } from './types';

export const categories: Category[] = [
  { id: 'cat-inc-1', name: 'Gaji Bulanan', type: 'INCOME', icon: 'wallet', color: '#10B981' },
  { id: 'cat-inc-2', name: 'Freelance & Side Project', type: 'INCOME', icon: 'laptop', color: '#3B82F6' },
  { id: 'cat-inc-3', name: 'Investasi & Dividen', type: 'INCOME', icon: 'trending-up', color: '#8B5CF6' },
  { id: 'cat-exp-1', name: 'Makanan & Minuman', type: 'EXPENSE', icon: 'utensils', color: '#EF4444' },
  { id: 'cat-exp-2', name: 'Transportasi', type: 'EXPENSE', icon: 'bus', color: '#F59E0B' },
  { id: 'cat-exp-3', name: 'Belanja & Kebutuhan', type: 'EXPENSE', icon: 'shopping-cart', color: '#EC4899' },
  { id: 'cat-exp-4', name: 'Tagihan & Utilitas', type: 'EXPENSE', icon: 'file-text', color: '#6366F1' }
];

export let transactions: Transaction[] = [
  {
    id: 'tx-001',
    title: 'Gaji Bulanan Software Engineer',
    amount: 15000000,
    type: 'INCOME',
    categoryId: 'cat-inc-1',
    categoryName: 'Gaji Bulanan',
    categoryIcon: 'wallet',
    date: '2026-09-01T08:00:00.000Z',
    notes: 'Gaji bulan September 2026'
  },
  {
    id: 'tx-002',
    title: 'Makan Siang Resto SE',
    amount: 125000,
    type: 'EXPENSE',
    categoryId: 'cat-exp-1',
    categoryName: 'Makanan & Minuman',
    categoryIcon: 'utensils',
    date: '2026-09-10T12:30:00.000Z',
    notes: 'Makan siang bersama klien'
  },
  {
    id: 'tx-003',
    title: 'Project Web Admin MoneyMate',
    amount: 4500000,
    type: 'INCOME',
    categoryId: 'cat-inc-2',
    categoryName: 'Freelance & Side Project',
    categoryIcon: 'laptop',
    date: '2026-09-15T15:00:00.000Z',
    notes: 'Pembayaran termin pertama'
  },
  {
    id: 'tx-004',
    title: 'Bensin & Tol Mingguan',
    amount: 350000,
    type: 'EXPENSE',
    categoryId: 'cat-exp-2',
    categoryName: 'Transportasi',
    categoryIcon: 'bus',
    date: '2026-09-18T17:20:00.000Z',
    notes: 'Isi Pertamax dan e-Money'
  },
  {
    id: 'tx-005',
    title: 'Tagihan Listrik & WiFi Home',
    amount: 850000,
    type: 'EXPENSE',
    categoryId: 'cat-exp-4',
    categoryName: 'Tagihan & Utilitas',
    categoryIcon: 'file-text',
    date: '2026-09-20T09:00:00.000Z',
    notes: 'Tagihan IndiHome & PLN'
  }
];

export let budgets: Budget[] = [
  {
    id: 'bg-001',
    categoryId: 'cat-exp-1',
    categoryName: 'Makanan & Minuman',
    limitAmount: 3000000,
    spentAmount: 125000,
    percentage: 4.17
  },
  {
    id: 'bg-002',
    categoryId: 'cat-exp-2',
    categoryName: 'Transportasi',
    limitAmount: 1500000,
    spentAmount: 350000,
    percentage: 23.33
  },
  {
    id: 'bg-003',
    categoryId: 'cat-exp-3',
    categoryName: 'Belanja & Kebutuhan',
    limitAmount: 2500000,
    spentAmount: 0,
    percentage: 0
  },
  {
    id: 'bg-004',
    categoryId: 'cat-exp-4',
    categoryName: 'Tagihan & Utilitas',
    limitAmount: 1000000,
    spentAmount: 850000,
    percentage: 85.0
  }
];
