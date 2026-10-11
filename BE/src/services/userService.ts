import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET all users (admin) ----
export const getAllUsers = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, phone, avatar_url, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

// ---- GET user by ID ----
export const getUserById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, phone, avatar_url, role, is_active, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

// ---- GET user by email (for auth) ----
export const getUserByEmail = async (email: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};

// ---- CREATE user (register) ----
export const createUser = async (data: { name: string; email: string; password: string; phone?: string }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.email, hashedPassword, data.phone || null, 'student']
  );
  return { id: result.insertId, name: data.name, email: data.email, role: 'student' };
};

// ---- UPDATE user profile ----
export const updateUser = async (id: number, data: { name?: string; phone?: string; avatar_url?: string }) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name) { fields.push('name = ?'); values.push(data.name); }
  if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
  if (data.avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(data.avatar_url); }
  if (fields.length === 0) return null;
  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return getUserById(id);
};

// ---- TOGGLE user active status (admin) ----
export const toggleUserActive = async (id: number, is_active: boolean) => {
  await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
  return getUserById(id);
};

// ---- DELETE user (admin) ----
export const deleteUser = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- COUNT users ----
export const countUsers = async () => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM users');
  return rows[0].total;
};

// ---- CHANGE password ----
export const changePassword = async (id: number, newPassword: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
};
