import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- LOG an admin action ----
export const logAction = async (data: {
  admin_id: number;
  action: string;
  target_table?: string;
  target_id?: number;
  description?: string;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO audit_logs (admin_id, action, target_table, target_id, description) VALUES (?, ?, ?, ?, ?)',
    [data.admin_id, data.action, data.target_table || null, data.target_id || null, data.description || null]
  );
  return { id: result.insertId, ...data };
};

// ---- GET audit logs (admin) ----
export const getAuditLogs = async (filters?: { admin_id?: number; action?: string; limit?: number }) => {
  let query = `
    SELECT a.*, u.name AS admin_name
    FROM audit_logs a
    LEFT JOIN users u ON a.admin_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (filters?.admin_id) { query += ' AND a.admin_id = ?'; params.push(filters.admin_id); }
  if (filters?.action) { query += ' AND a.action LIKE ?'; params.push(`%${filters.action}%`); }
  query += ' ORDER BY a.created_at DESC';
  if (filters?.limit) { query += ' LIMIT ?'; params.push(filters.limit); }
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};
