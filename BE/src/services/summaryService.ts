import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// ---- GET financial summary for a user ----
export const getUserSummary = async (user_id: number) => {
  const [income] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'income'`,
    [user_id]
  );
  const [expense] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'expense'`,
    [user_id]
  );
  const [budgets] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM budgets WHERE user_id = ? AND is_active = 1',
    [user_id]
  );
  const [goals] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM goals WHERE user_id = ? AND is_completed = 0',
    [user_id]
  );
  const [recentTx] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM transactions WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)',
    [user_id]
  );

  return {
    totalIncome: Number(income[0].total),
    totalExpense: Number(expense[0].total),
    totalBalance: Number(income[0].total) - Number(expense[0].total),
    activeBudgetsCount: Number(budgets[0].total),
    activeGoalsCount: Number(goals[0].total),
    recentTransactionsCount: Number(recentTx[0].total),
  };
};

// ---- GET admin dashboard summary ----
export const getAdminSummary = async () => {
  const [users] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM users');
  const [activeUsers] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM users WHERE is_active = 1');
  const [income] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'income'`
  );
  const [expense] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'expense'`
  );
  const [txCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM transactions');
  const [budgetCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM budgets WHERE is_active = 1');
  const [goalCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM goals');

  return {
    totalUsers: Number(users[0].total),
    activeUsers: Number(activeUsers[0].total),
    totalIncome: Number(income[0].total),
    totalExpense: Number(expense[0].total),
    totalBalance: Number(income[0].total) - Number(expense[0].total),
    totalTransactions: Number(txCount[0].total),
    activeBudgets: Number(budgetCount[0].total),
    totalGoals: Number(goalCount[0].total),
  };
};
