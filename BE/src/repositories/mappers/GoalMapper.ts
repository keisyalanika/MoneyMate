import { DbBool, Goal, GoalFund } from '../../types';
import { nullable, toDateOnly, toFlag, toNumber } from './MapperHelpers';

export interface GoalRow {
  id: number;
  userId: number;
  title: string;
  targetAmount: unknown;
  currentAmount: unknown;
  icon: string | null;
  deadline: Date | null;
  isCompleted: boolean | null;
  createdAt: Date;
}

export interface GoalFundRow {
  id: number;
  goalId: number;
  userId: number;
  amount: unknown;
  note: string | null;
  createdAt: Date;
}

export const toGoal = (row: GoalRow): Goal => ({
  id: row.id,
  user_id: row.userId,
  title: row.title,
  target_amount: toNumber(row.targetAmount),
  current_amount: toNumber(row.currentAmount),
  icon: nullable(row.icon),
  deadline: toDateOnly(row.deadline),
  is_completed: toFlag(row.isCompleted) as DbBool,
  created_at: row.createdAt,
});

export const toGoalFund = (row: GoalFundRow): GoalFund => ({
  id: row.id,
  goal_id: row.goalId,
  user_id: row.userId,
  amount: toNumber(row.amount),
  note: nullable(row.note),
  created_at: row.createdAt,
});

/** Baris mentah (snake_case) dari `SELECT ... FOR UPDATE`. */
export interface GoalRawRow {
  id: number;
  user_id: number;
  title: string;
  target_amount: unknown;
  current_amount: unknown;
  icon: string | null;
  deadline: Date | null;
  is_completed: number | boolean | null;
  created_at: Date;
}

export const toGoalFromRaw = (row: GoalRawRow): Goal => ({
  id: row.id,
  user_id: row.user_id,
  title: row.title,
  target_amount: toNumber(row.target_amount),
  current_amount: toNumber(row.current_amount),
  icon: nullable(row.icon),
  deadline: toDateOnly(row.deadline),
  is_completed: toFlag(Boolean(row.is_completed)) as DbBool,
  created_at: row.created_at,
});
