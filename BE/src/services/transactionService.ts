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
    SELECT t.*, c.name AS category_name, c.icon AS category_icon, 
           u.name AS user_name, u.email AS user_email, u.avatar_url AS user_avatar,
           ins.source_name AS income_source_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN income_sources ins ON t.income_source_id = ins.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters.user_id) {
    query += ' AND t.user_id = ?';
    params.push(filters.user_id);
  }
  if (filters.type) {
    query += ' AND t.type = ?';
    params.push(filters.type);
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
    `SELECT t.*, c.name AS category_name, c.icon AS category_icon
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
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
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO transactions (user_id, type, amount, category_id, income_source_id, date, note, receipt_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id, data.type, data.amount, data.category_id, data.income_source_id || null, data.date, data.note || null, data.receipt_image_url || null]
  );

  // AUTO-UPDATE WALLET SALDO OTOMATIS
  const isIncome = data.type.toLowerCase() === 'income';
  const delta = isIncome ? Number(data.amount) : -Number(data.amount);

  try {
    const [wallets] = await pool.query<RowDataPacket[]>(
      'SELECT id, balance FROM wallets WHERE user_id = ? ORDER BY is_default DESC, created_at ASC LIMIT 1',
      [data.user_id]
    );
    if (wallets && wallets.length > 0) {
      const currentBal = Number(wallets[0].balance) || 0;
      const newBal = Math.max(0, currentBal + delta);
      await pool.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBal, wallets[0].id]);
    } else {
      const initialBal = isIncome ? Number(data.amount) : 0;
      await pool.query(
        'INSERT INTO wallets (user_id, name, balance, currency, is_default) VALUES (?, ?, ?, ?, ?)',
        [data.user_id, 'Dompet Utama', initialBal, 'IDR', 1]
      );
    }
  } catch (err: any) {
    console.warn('[AutoBalance] Gagal memperbarui saldo dompet:', err.message);
  }

  // AUTO-NOTIFIKASI ANGGARAN (JIKA PENGELUARAN MENDEKATI / MELEBIHI LIMIT)
  if (!isIncome) {
    try {
      const txDate = new Date(data.date);
      const month = txDate.getMonth() + 1;
      const year = txDate.getFullYear();

      const [budgets] = await pool.query<RowDataPacket[]>(
        `SELECT b.*, c.name as category_name FROM budgets b
         JOIN categories c ON b.category_id = c.id
         WHERE b.user_id = ? AND b.category_id = ? AND b.month = ? AND b.year = ?`,
        [data.user_id, data.category_id, month, year]
      );

      if (budgets && budgets.length > 0) {
        const budget = budgets[0];
        const [spentRow] = await pool.query<RowDataPacket[]>(
          `SELECT COALESCE(SUM(amount), 0) AS total_spent FROM transactions
           WHERE user_id = ? AND category_id = ? AND type = 'expense' AND MONTH(date) = ? AND YEAR(date) = ?`,
          [data.user_id, data.category_id, month, year]
        );
        const totalSpent = Number(spentRow[0].total_spent);
        const limitAmount = Number(budget.amount);
        const ratio = limitAmount > 0 ? (totalSpent / limitAmount) * 100 : 0;

        if (ratio >= 100) {
          await pool.query(
            'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
            [
              data.user_id,
              '⚠️ Peringatan Overbudget!',
              `Pengeluaran kategori ${budget.category_name} sudah mencapai Rp ${totalSpent.toLocaleString('id-ID')} (melebihi pagu anggaran Rp ${limitAmount.toLocaleString('id-ID')}).`
            ]
          );
        } else if (ratio >= 80) {
          await pool.query(
            'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
            [
              data.user_id,
              '⚡ Peringatan Kuota Anggaran',
              `Pengeluaran kategori ${budget.category_name} telah mencapai ${Math.round(ratio)}% dari anggaran bulanan Anda.`
            ]
          );
        }
      }
    } catch (notifErr: any) {
      console.warn('[AutoNotification] Gagal memeriksa kuota anggaran:', notifErr.message);
    }
  }

  return getTransactionById(result.insertId);
};

// ---- UPDATE transaction ----
export const updateTransaction = async (id: number, data: {
  type?: string;
  amount?: number;
  category_id?: number;
  date?: string;
  note?: string;
}) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.type) { fields.push('type = ?'); values.push(data.type); }
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
  const tx = await getTransactionById(id);
  if (tx) {
    const isIncome = tx.type?.toLowerCase() === 'income';
    // Kembalikan saldo: jika income dihapus maka kurangi saldo; jika expense dihapus maka kembalikan saldo
    const reverseDelta = isIncome ? -Number(tx.amount) : Number(tx.amount);
    try {
      const [wallets] = await pool.query<RowDataPacket[]>(
        'SELECT id, balance FROM wallets WHERE user_id = ? ORDER BY is_default DESC, created_at ASC LIMIT 1',
        [tx.user_id]
      );
      if (wallets && wallets.length > 0) {
        const currentBal = Number(wallets[0].balance) || 0;
        const newBal = Math.max(0, currentBal + reverseDelta);
        await pool.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBal, wallets[0].id]);
      }
    } catch (err: any) {
      console.warn('[AutoBalance] Gagal mengembalikan saldo dompet saat transaksi dihapus:', err.message);
    }
  }

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

// ---- GET overall summary (admin) ----
export const getOverallSummary = async () => {
  const [income] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'income'`
  );
  const [expense] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'expense'`
  );
  const [txCount] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM transactions'
  );
  return {
    totalIncome: Number(income[0].total),
    totalExpense: Number(expense[0].total),
    totalBalance: Number(income[0].total) - Number(expense[0].total),
    totalTransactions: Number(txCount[0].total),
  };
};
