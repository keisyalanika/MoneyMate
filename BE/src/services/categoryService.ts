import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET all categories ----
export const getCategories = async (type?: string) => {
  let query = 'SELECT * FROM categories';
  const params: any[] = [];
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  query += ' ORDER BY name ASC';
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};

// ---- GET category by ID ----
export const getCategoryById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

// ---- CREATE category ----
export const createCategory = async (data: { name: string; type: string; icon?: string }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)',
    [data.name, data.type, data.icon || null]
  );
  return getCategoryById(result.insertId);
};

// ---- UPDATE category ----
export const updateCategory = async (id: number, data: { name?: string; type?: string; icon?: string }) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name) { fields.push('name = ?'); values.push(data.name); }
  if (data.type) { fields.push('type = ?'); values.push(data.type); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (fields.length === 0) return null;
  values.push(id);
  await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  return getCategoryById(id);
};

// ---- DELETE category ----
export const deleteCategory = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
