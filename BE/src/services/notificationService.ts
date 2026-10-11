import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET notifications for user ----
export const getNotifications = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [user_id]
  );
  return rows;
};

// ---- CREATE notification ----
export const createNotification = async (data: { user_id: number; title: string; message?: string }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [data.user_id, data.title, data.message || null]
  );
  return { id: result.insertId, ...data, is_read: false };
};

// ---- MARK as read ----
export const markAsRead = async (id: number) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
};

// ---- MARK all as read ----
export const markAllAsRead = async (user_id: number) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user_id]);
};

// ---- DELETE notification ----
export const deleteNotification = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM notifications WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- COUNT unread ----
export const countUnread = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0',
    [user_id]
  );
  return rows[0].total;
};
