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
export const updateUser = async (
  id: number,
  data: {
    name?: string;
    phone?: string;
    avatar_url?: string;
    birth_date?: string;
    bio?: string;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
  if (data.avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(data.avatar_url); }
  if (data.birth_date !== undefined) { fields.push('birth_date = ?'); values.push(data.birth_date); }
  if (data.bio !== undefined) { fields.push('bio = ?'); values.push(data.bio); }
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

// ---- OTP / FORGOT PASSWORD SERVICES ----
export const createOtpCode = async (email: string) => {
  // Generate random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  await pool.query(
    'INSERT INTO otp_codes (email, otp_code, expires_at, is_used) VALUES (?, ?, ?, 0)',
    [email.toLowerCase().trim(), code, expiresAt]
  );

  return code;
};

export const verifyOtpCode = async (email: string, otpCode: string): Promise<boolean> => {
  const normEmail = email.toLowerCase().trim();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM otp_codes WHERE email = ? AND otp_code = ? AND is_used = 0 ORDER BY created_at DESC',
    [normEmail, otpCode.trim()]
  );

  if (!rows || rows.length === 0) return false;
  const record = rows[0];

  // Check expiration
  if (new Date(record.expires_at).getTime() < Date.now()) {
    return false;
  }

  return true;
};

export const resetPasswordWithOtp = async (email: string, otpCode: string, newPassword: string): Promise<boolean> => {
  const isValid = await verifyOtpCode(email, otpCode);
  if (!isValid) return false;

  const user = await getUserByEmail(email);
  if (!user) return false;

  await changePassword(user.id, newPassword);

  // Mark OTP as used
  await pool.query(
    'UPDATE otp_codes SET is_used = 1 WHERE email = ? AND otp_code = ?',
    [email.toLowerCase().trim(), otpCode.trim()]
  );

  return true;
};

