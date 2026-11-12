import { Transaction, TransactionType } from '../../types';
import { nullable, toDateOnly, toNumber } from './MapperHelpers';

export interface TransactionRow {
  id: number;
  userId: number;
  type: TransactionType;
  amount: unknown;
  categoryId: number;
  incomeSourceId: number | null;
  date: Date;
  note: string | null;
  receiptImageUrl: string | null;
  createdAt: Date;
  category?: { name: string; icon: string | null } | null;
  user?: { name: string; email: string; avatarUrl: string | null } | null;
  incomeSource?: { sourceName: string } | null;
}

export const toTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  user_id: row.userId,
  type: row.type,
  amount: toNumber(row.amount),
  category_id: row.categoryId,
  income_source_id: nullable(row.incomeSourceId),
  date: toDateOnly(row.date) as string,
  note: nullable(row.note),
  receipt_image_url: nullable(row.receiptImageUrl),
  created_at: row.createdAt,
  category_name: nullable(row.category?.name),
  category_icon: nullable(row.category?.icon),
  user_name: nullable(row.user?.name),
  user_email: nullable(row.user?.email),
  user_avatar: nullable(row.user?.avatarUrl),
  income_source_name: nullable(row.incomeSource?.sourceName),
});
