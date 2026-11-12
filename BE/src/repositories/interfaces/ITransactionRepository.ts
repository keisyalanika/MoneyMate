import { Transaction, TransactionType } from '../../types';

export interface TransactionFilters {
  user_id?: number;
  type?: TransactionType;
  category_id?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionData {
  user_id: number;
  type: TransactionType;
  amount: number;
  category_id: number;
  income_source_id?: number | null;
  date: string;
  note?: string | null;
  receipt_image_url?: string | null;
}

export interface UpdateTransactionData {
  type?: TransactionType;
  amount?: number;
  category_id?: number;
  date?: string;
  note?: string | null;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

export interface ITransactionRepository {
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findById(id: number): Promise<Transaction | null>;
  create(data: CreateTransactionData): Promise<number>;
  update(id: number, data: UpdateTransactionData): Promise<Transaction | null>;
  remove(id: number): Promise<boolean>;
  monthlySummary(userId: number, month: number, year: number): Promise<TransactionSummary>;
  overallSummary(): Promise<TransactionSummary & { totalTransactions: number }>;
}
