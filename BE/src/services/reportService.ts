import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET reports ----
export const getReports = async (filters?: { user_id?: number; report_type?: string }) => {
  let query = `
    SELECT r.*, u.name AS user_name, admin.name AS generated_by_name
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN users admin ON r.generated_by = admin.id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (filters?.user_id) { query += ' AND r.user_id = ?'; params.push(filters.user_id); }
  if (filters?.report_type) { query += ' AND r.report_type = ?'; params.push(filters.report_type); }
  query += ' ORDER BY r.created_at DESC';
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};

// ---- CREATE report ----
export const createReport = async (data: {
  user_id?: number;
  generated_by: number;
  report_type: string;
  title?: string;
  period_start?: string;
  period_end?: string;
  file_url?: string;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO reports (user_id, generated_by, report_type, title, period_start, period_end, file_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id || null, data.generated_by, data.report_type, data.title || null, data.period_start || null, data.period_end || null, data.file_url || null]
  );
  return { id: result.insertId, ...data };
};

// ---- DELETE report ----
export const deleteReport = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM reports WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
