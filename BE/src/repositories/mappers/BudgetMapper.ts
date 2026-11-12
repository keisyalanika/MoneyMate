import { Budget, DbBool } from '../../types';
import { nullable, toFlag, toNumber } from './MapperHelpers';

export interface BudgetRow {
  id: number;
  userId: number;
  categoryId: number;
  amount: unknown;
  month: number;
  year: number;
  isActive: boolean | null;
  createdAt: Date;
  category?: { name: string; icon: string | null } | null;
  user?: { name: string } | null;
}

/** Menyamakan bentuk baris mentah hasil agregasi SQL (snake_case). */
export interface BudgetRawRow {
  id: number;
  user_id: number;
  category_id: number;
  amount: unknown;
  month: number;
  year: number;
  is_active: number | boolean | null;
  created_at: Date;
  category_name: string | null;
  category_icon: string | null;
  user_name?: string | null;
  spent_amount: unknown;
}

export interface BudgetResult extends Budget {
  category_name?: string;
  category_icon?: string;
  user_name?: string;
  spent_amount: number;
  percentage: number;
}

export const toBudget = (row: BudgetRow): Budget => ({
  id: row.id,
  user_id: row.userId,
  category_id: row.categoryId,
  amount: toNumber(row.amount),
  month: row.month,
  year: row.year,
  is_active: toFlag(row.isActive) as DbBool,
  created_at: row.createdAt,
  category_name: nullable(row.category?.name),
  category_icon: nullable(row.category?.icon),
  user_name: nullable(row.user?.name),
});

export const toBudgetResult = (row: BudgetRawRow): BudgetResult => {
  const amount = toNumber(row.amount);
  const spentAmount = toNumber(row.spent_amount);

  return {
    id: row.id,
    user_id: row.user_id,
    category_id: row.category_id,
    amount,
    month: row.month,
    year: row.year,
    is_active: toFlag(Boolean(row.is_active)) as DbBool,
    created_at: row.created_at,
    category_name: nullable(row.category_name),
    category_icon: nullable(row.category_icon),
    user_name: nullable(row.user_name),
    spent_amount: spentAmount,
    percentage: amount > 0 ? Math.round((spentAmount / amount) * 100) : 0,
  };
};
