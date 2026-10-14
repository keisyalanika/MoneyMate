import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET budgets for a user ----
export const getBudgets = async (user_id: number, month?: number, year?: number) => {
  let query = `
    SELECT b.*, c.name AS category_name, c.icon AS category_icon,
      COALESCE((
        SELECT SUM(t.amount) FROM transactions t
        WHERE t.user_id = b.user_id
          AND t.category_id = b.category_id
          AND t.type = 'expense'
          AND MONTH(t.date) = b.month
          AND YEAR(t.date) = b.year
      ), 0) AS spent_amount
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ?
  `;
  const params: any[] = [user_id];

  if (month) { query += ' AND b.month = ?'; params.push(month); }
  if (year) { query += ' AND b.year = ?'; params.push(year); }

  query += ' ORDER BY b.created_at DESC';
  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  // Compute percentage
  return (rows as any[]).map(b => ({
    ...b,
    spent_amount: Number(b.spent_amount),
    percentage: b.amount > 0 ? Math.round((Number(b.spent_amount) / Number(b.amount)) * 100) : 0,
  }));
};

// ---- GET all budgets (admin overview) ----
export const getAllBudgets = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT b.*, c.name AS category_name, c.icon AS category_icon, u.name AS user_name,
      COALESCE((
        SELECT SUM(t.amount) FROM transactions t
        WHERE t.user_id = b.user_id
          AND t.category_id = b.category_id
          AND t.type = 'expense'
          AND MONTH(t.date) = b.month
          AND YEAR(t.date) = b.year
      ), 0) AS spent_amount
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `);
  return (rows as any[]).map(b => ({
    ...b,
    spent_amount: Number(b.spent_amount),
    percentage: b.amount > 0 ? Math.round((Number(b.spent_amount) / Number(b.amount)) * 100) : 0,
  }));
};

// ---- CREATE budget ----
export const createBudget = async (data: {
  user_id: number;
  category_id: number;
  amount: number;
  month: number;
  year: number;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO budgets (user_id, category_id, amount, month, year)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
    [data.user_id, data.category_id, data.amount, data.month, data.year]
  );
  return { id: result.insertId, ...data };
};

// ---- UPDATE budget ----
export const updateBudget = async (id: number, data: { amount?: number; is_active?: boolean }) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.amount !== undefined) { fields.push('amount = ?'); values.push(data.amount); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active ? 1 : 0); }
  if (fields.length === 0) return null;
  values.push(id);
  await pool.query(`UPDATE budgets SET ${fields.join(', ')} WHERE id = ?`, values);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM budgets WHERE id = ?', [id]);
  return rows[0] || null;
};

// ---- DELETE budget ----
export const deleteBudget = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM budgets WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- COUNT active budgets for user ----
export const countActiveBudgets = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM budgets WHERE user_id = ? AND is_active = 1',
    [user_id]
  );
  return rows[0].total;
};
