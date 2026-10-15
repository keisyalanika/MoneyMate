import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ---- GET all transactions (with filters) ----
export const getAllTransactions = async (filters: {
  user_id?: number;
  type?: string;
  category_id?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}) => {
  let query = `
<<<<<<< Updated upstream
    SELECT t.*, c.name AS category_name, c.icon AS category_icon, u.name AS user_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN users u ON t.user_id = u.id
=======
    SELECT t.*, c.name AS category_name, c.icon AS category_icon, c.color AS category_color,
           u.name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar,
           w.name AS wallet_name,
           ins.source_name AS income_source_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN wallets w ON t.wallet_id = w.id
    LEFT JOIN income_sources ins ON t.income_source_id = ins.id
>>>>>>> Stashed changes
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.user_id) {
    query += ' AND t.user_id = ?';
    params.push(filters.user_id);
  }
  if (filters.type) {
    query += ' AND t.type = ?';
    params.push(filters.type.toLowerCase());
  }
  if (filters.category_id) {
    query += ' AND t.category_id = ?';
    params.push(filters.category_id);
  }
  if (filters.search) {
    query += ' AND (t.note LIKE ? OR c.name LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.start_date) {
    query += ' AND t.date >= ?';
    params.push(filters.start_date);
  }
  if (filters.end_date) {
    query += ' AND t.date <= ?';
    params.push(filters.end_date);
  }

  query += ' ORDER BY t.date DESC, t.created_at DESC';

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};

// ---- GET single transaction ----
export const getTransactionById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.*, c.name AS category_name, c.icon AS category_icon, c.color AS category_color,
            w.name AS wallet_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN wallets w ON t.wallet_id = w.id
     WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
};

// ---- CREATE transaction ----
export const createTransaction = async (data: {
  user_id: number;
  wallet_id?: number;
  type: string;
  amount: number;
  category_id: number;
  income_source_id?: number;
  date: string;
  note?: string;
  receipt_image_url?: string;
}) => {
  const normType = data.type.toLowerCase() === 'income' ? 'income' : 'expense';
  const amount = Number(data.amount);

  // If wallet_id is provided, or find default wallet for user
  let targetWalletId = data.wallet_id;
  if (!targetWalletId) {
    const [wallets] = await pool.query<RowDataPacket[]>(
      'SELECT id, balance FROM wallets WHERE user_id = ? ORDER BY is_default DESC LIMIT 1',
      [data.user_id]
    );
    if (wallets && wallets.length > 0) {
      targetWalletId = wallets[0].id;
    }
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO transactions (user_id, wallet_id, type, amount, category_id, income_source_id, date, note, receipt_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      targetWalletId || null,
      normType,
      amount,
      data.category_id,
      data.income_source_id || null,
      data.date,
      data.note || null,
      data.receipt_image_url || null,
    ]
  );

  // Automatically update the wallet balance if connected
  if (targetWalletId) {
    const [wRows] = await pool.query<RowDataPacket[]>('SELECT balance FROM wallets WHERE id = ?', [targetWalletId]);
    if (wRows && wRows[0]) {
      const curBal = Number(wRows[0].balance) || 0;
      const newBal = normType === 'income' ? curBal + amount : Math.max(0, curBal - amount);
      await pool.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBal, targetWalletId]);
    }
  }

  return getTransactionById(result.insertId);
};

// ---- UPDATE transaction ----
export const updateTransaction = async (
  id: number,
  data: {
    wallet_id?: number;
    type?: string;
    amount?: number;
    category_id?: number;
    date?: string;
    note?: string;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.wallet_id !== undefined) { fields.push('wallet_id = ?'); values.push(data.wallet_id); }
  if (data.type) { fields.push('type = ?'); values.push(data.type.toLowerCase()); }
  if (data.amount !== undefined) { fields.push('amount = ?'); values.push(data.amount); }
  if (data.category_id) { fields.push('category_id = ?'); values.push(data.category_id); }
  if (data.date) { fields.push('date = ?'); values.push(data.date); }
  if (data.note !== undefined) { fields.push('note = ?'); values.push(data.note); }
  if (fields.length === 0) return null;
  values.push(id);
  await pool.query(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`, values);
  return getTransactionById(id);
};

// ---- DELETE transaction ----
export const deleteTransaction = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- GET monthly summary for a user ----
export const getMonthlySummary = async (user_id: number, month: number, year: number) => {
  const [income] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'income' AND MONTH(date) = ? AND YEAR(date) = ?`,
    [user_id, month, year]
  );
  const [expense] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'expense' AND MONTH(date) = ? AND YEAR(date) = ?`,
    [user_id, month, year]
  );
  return {
    totalIncome: Number(income[0].total),
    totalExpense: Number(expense[0].total),
    totalBalance: Number(income[0].total) - Number(expense[0].total),
  };
};
