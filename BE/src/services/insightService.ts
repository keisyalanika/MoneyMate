import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET AI insights for user ----
export const getInsights = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM ai_insights WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [user_id]
  );
  return rows;
};

// ---- GET all insights (admin) ----
export const getAllInsights = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT ai.*, u.name AS user_name
    FROM ai_insights ai
    LEFT JOIN users u ON ai.user_id = u.id
    ORDER BY ai.created_at DESC LIMIT 50
  `);
  return rows;
};

// ---- CREATE insight ----
export const createInsight = async (data: { user_id: number; insight_type: string; content: string }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO ai_insights (user_id, insight_type, content) VALUES (?, ?, ?)',
    [data.user_id, data.insight_type, data.content]
  );
  return { id: result.insertId, ...data };
};

// ---- DELETE insight ----
export const deleteInsight = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM ai_insights WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
