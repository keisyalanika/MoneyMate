import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET goals for user ----
export const getGoals = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
    [user_id]
  );
  return rows;
};

// ---- GET goal by ID ----
export const getGoalById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM goals WHERE id = ?', [id]);
  return rows[0] || null;
};

// ---- CREATE goal ----
export const createGoal = async (data: {
  user_id: number;
  title: string;
  target_amount: number;
  icon?: string;
  deadline?: string;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO goals (user_id, title, target_amount, icon, deadline) VALUES (?, ?, ?, ?, ?)',
    [data.user_id, data.title, data.target_amount, data.icon || null, data.deadline || null]
  );
  return getGoalById(result.insertId);
};

// ---- UPDATE goal ----
export const updateGoal = async (id: number, data: {
  title?: string;
  target_amount?: number;
  icon?: string;
  deadline?: string;
  is_completed?: boolean;
}) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.title) { fields.push('title = ?'); values.push(data.title); }
  if (data.target_amount !== undefined) { fields.push('target_amount = ?'); values.push(data.target_amount); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.deadline !== undefined) { fields.push('deadline = ?'); values.push(data.deadline); }
  if (data.is_completed !== undefined) { fields.push('is_completed = ?'); values.push(data.is_completed ? 1 : 0); }
  if (fields.length === 0) return null;
  values.push(id);
  await pool.query(`UPDATE goals SET ${fields.join(', ')} WHERE id = ?`, values);
  return getGoalById(id);
};

// ---- DELETE goal ----
export const deleteGoal = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM goals WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- ADD fund to goal ----
export const addFund = async (data: { goal_id: number; user_id: number; amount: number; note?: string }) => {
  // Insert fund record
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO goal_funds (goal_id, user_id, amount, note) VALUES (?, ?, ?, ?)',
    [data.goal_id, data.user_id, data.amount, data.note || null]
  );

  // Update goal's current_amount
  await pool.query(
    'UPDATE goals SET current_amount = current_amount + ? WHERE id = ?',
    [data.amount, data.goal_id]
  );

  // Check if goal is now completed
  const goal = await getGoalById(data.goal_id);
  if (goal && Number(goal.current_amount) >= Number(goal.target_amount)) {
    await pool.query('UPDATE goals SET is_completed = 1 WHERE id = ?', [data.goal_id]);
  }

  return { id: result.insertId, ...data };
};

// ---- GET fund history for a goal ----
export const getGoalFunds = async (goal_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM goal_funds WHERE goal_id = ? ORDER BY created_at DESC',
    [goal_id]
  );
  return rows;
};

// ---- COUNT active goals ----
export const countActiveGoals = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM goals WHERE user_id = ? AND is_completed = 0',
    [user_id]
  );
  return rows[0].total;
};
