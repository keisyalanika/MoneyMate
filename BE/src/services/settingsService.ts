import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET settings for user ----
export const getSettings = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM user_settings WHERE user_id = ?',
    [user_id]
  );
  if (rows.length === 0) {
    // Auto-create default settings
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [user_id]
    );
    const [newRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [user_id]
    );
    return newRows[0];
  }
  return rows[0];
};

// ---- UPDATE settings ----
export const updateSettings = async (user_id: number, data: {
  currency?: string;
  language?: string;
  theme?: string;
  notification_enabled?: boolean;
}) => {
  // Ensure settings row exists
  await getSettings(user_id);

  const fields: string[] = [];
  const values: any[] = [];
  if (data.currency) { fields.push('currency = ?'); values.push(data.currency); }
  if (data.language) { fields.push('language = ?'); values.push(data.language); }
  if (data.theme) { fields.push('theme = ?'); values.push(data.theme); }
  if (data.notification_enabled !== undefined) {
    fields.push('notification_enabled = ?');
    values.push(data.notification_enabled ? 1 : 0);
  }
  if (fields.length === 0) return getSettings(user_id);
  values.push(user_id);
  await pool.query(`UPDATE user_settings SET ${fields.join(', ')} WHERE user_id = ?`, values);
  return getSettings(user_id);
};
