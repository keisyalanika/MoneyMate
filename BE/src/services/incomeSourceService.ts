import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET income sources for user ----
export const getIncomeSources = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM income_sources WHERE user_id = ? ORDER BY source_name ASC',
    [user_id]
  );
  return rows;
};

// ---- CREATE income source ----
export const createIncomeSource = async (data: { user_id: number; source_name: string }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO income_sources (user_id, source_name) VALUES (?, ?)',
    [data.user_id, data.source_name]
  );
  return { id: result.insertId, ...data };
};

// ---- DELETE income source ----
export const deleteIncomeSource = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM income_sources WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
