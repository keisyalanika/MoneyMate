import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET all categories (System default + User-specific) ----
export const getCategories = async (type?: string, userId?: number) => {
  let query = 'SELECT * FROM categories WHERE 1=1';
  const params: any[] = [];

  if (userId) {
    query += ' AND (user_id IS NULL OR user_id = ?)';
    params.push(userId);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type.toLowerCase());
  }

  query += ' ORDER BY is_pinned DESC, name ASC';
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};

// ---- GET category by ID ----
export const getCategoryById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

// ---- CREATE category ----
export const createCategory = async (data: {
  name: string;
  type: string;
  icon?: string;
  color?: string;
  is_pinned?: boolean;
  user_id?: number | null;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO categories (name, type, icon, color, is_pinned, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [
      data.name,
      data.type.toLowerCase(),
      data.icon || 'tag',
      data.color || '#3B82F6',
      data.is_pinned ? 1 : 0,
      data.user_id || null,
    ]
  );
  return getCategoryById(result.insertId);
};

// ---- UPDATE category ----
export const updateCategory = async (
  id: number,
  data: {
    name?: string;
    type?: string;
    icon?: string;
    color?: string;
    is_pinned?: boolean;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type.toLowerCase()); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }
  if (data.is_pinned !== undefined) { fields.push('is_pinned = ?'); values.push(data.is_pinned ? 1 : 0); }
  if (fields.length === 0) return null;
  values.push(id);

  await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  return getCategoryById(id);
};

// ---- TOGGLE PIN status ----
export const togglePin = async (id: number, is_pinned: boolean) => {
  await pool.query('UPDATE categories SET is_pinned = ? WHERE id = ?', [is_pinned ? 1 : 0, id]);
  return getCategoryById(id);
};

// ---- DELETE category ----
export const deleteCategory = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
