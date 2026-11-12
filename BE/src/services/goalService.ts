import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

const goalError = (code: string, message: string) => {
  const err: any = new Error(message);
  err.code = code;
  return err;
};

const lockWallets = async (
  conn: PoolConnection,
  user_id: number,
  wallet_id?: number
) => {
  if (wallet_id !== undefined && wallet_id !== null) {
    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT id, name, balance FROM wallets WHERE id = ? AND user_id = ? FOR UPDATE',
      [wallet_id, user_id]
    );
    if (!rows || rows.length === 0) {
      throw goalError('WALLET_NOT_FOUND', 'Dompet yang dipilih tidak ditemukan.');
    }
    return rows;
  }

  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT id, name, balance FROM wallets WHERE user_id = ? ORDER BY is_default DESC, created_at ASC FOR UPDATE',
    [user_id]
  );
  if (!rows || rows.length === 0) {
    throw goalError('WALLET_NOT_FOUND', 'Dompet aplikasi tidak ditemukan. Silakan buat dompet terlebih dahulu.');
  }
  return rows;
};

const applyFundToGoal = async (
  conn: PoolConnection,
  data: {
    goal_id: number;
    user_id: number;
    amount: number;
    note?: string;
    wallet_id?: number;
  }
) => {
  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw goalError('INVALID_AMOUNT', 'Nominal setoran harus lebih dari 0.');
  }

  const [goalRows] = await conn.query<RowDataPacket[]>(
    'SELECT * FROM goals WHERE id = ? AND user_id = ? FOR UPDATE',
    [data.goal_id, data.user_id]
  );
  if (!goalRows || goalRows.length === 0) {
    throw goalError('GOAL_NOT_FOUND', 'Goal tidak ditemukan.');
  }

  const goal = goalRows[0];
  const wallets = await lockWallets(conn, data.user_id, data.wallet_id);
  const totalBalance = wallets.reduce(
    (sum, wallet) => sum + (Number(wallet.balance) || 0),
    0
  );

  if (totalBalance < amount) {
    const source =
      data.wallet_id !== undefined && data.wallet_id !== null
        ? `dompet ${wallets[0].name}`
        : 'dompet aplikasi';
    throw goalError(
      'INSUFFICIENT_BALANCE',
      `Saldo ${source} tidak cukup. Saldo tersedia Rp ${totalBalance.toLocaleString('id-ID')}.`
    );
  }

  const [fundResult] = await conn.query<ResultSetHeader>(
    'INSERT INTO goal_funds (goal_id, user_id, amount, note) VALUES (?, ?, ?, ?)',
    [data.goal_id, data.user_id, amount, data.note || null]
  );

  await conn.query(
    'UPDATE goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
    [amount, data.goal_id, data.user_id]
  );

  // Potong saldo aktif mulai dari dompet default, lalu dompet lain bila perlu.
  let remaining = amount;
  for (const wallet of wallets) {
    if (remaining <= 0) break;
    const balance = Number(wallet.balance) || 0;
    const deduction = Math.min(balance, remaining);
    if (deduction > 0) {
      await conn.query(
        'UPDATE wallets SET balance = balance - ? WHERE id = ? AND user_id = ?',
        [deduction, wallet.id, data.user_id]
      );
      remaining -= deduction;
    }
  }

  const [updatedRows] = await conn.query<RowDataPacket[]>(
    'SELECT * FROM goals WHERE id = ? AND user_id = ?',
    [data.goal_id, data.user_id]
  );
  const updatedGoal = updatedRows[0];

  if (
    updatedGoal &&
    Number(updatedGoal.current_amount) >= Number(updatedGoal.target_amount) &&
    !Number(updatedGoal.is_completed)
  ) {
    await conn.query(
      'UPDATE goals SET is_completed = 1 WHERE id = ? AND user_id = ?',
      [data.goal_id, data.user_id]
    );
    updatedGoal.is_completed = 1;

    try {
      await conn.query(
        'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
        [
          data.user_id,
          'Target Keuangan Tercapai!',
          `Selamat! Target menabung "${goal.title}" sebesar Rp ${Number(goal.target_amount).toLocaleString('id-ID')} telah sukses tercapai 100%!`,
        ]
      );
    } catch (_) {}
  }

  return {
    fund: {
      id: fundResult.insertId,
      goal_id: data.goal_id,
      user_id: data.user_id,
      amount,
      note: data.note || null,
    },
    goal: updatedGoal,
  };
};

// ---- GET goals for user ----
export const getGoals = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
    [user_id]
  );
  return rows;
};

// ---- GET goal by ID (scoped to its owner) ----
export const getGoalById = async (id: number, user_id?: number) => {
  if (user_id !== undefined) {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM goals WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return rows[0] || null;
  }
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM goals WHERE id = ?', [id]);
  return rows[0] || null;
};

// ---- CREATE goal (optional initial deposit) ----
export const createGoal = async (data: {
  user_id: number;
  title: string;
  target_amount: number;
  initial_deposit?: number;
  wallet_id?: number;
  icon?: string;
  deadline?: string;
}) => {
  const targetAmount = Number(data.target_amount);
  const initialDeposit = Number(data.initial_deposit || 0);

  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    throw goalError('INVALID_TARGET', 'Target nominal harus lebih dari 0.');
  }
  if (!Number.isFinite(initialDeposit) || initialDeposit < 0) {
    throw goalError('INVALID_AMOUNT', 'Setoran awal tidak valid.');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query<ResultSetHeader>(
      'INSERT INTO goals (user_id, title, target_amount, icon, deadline) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.title, targetAmount, data.icon || null, data.deadline || null]
    );

    if (initialDeposit > 0) {
      await applyFundToGoal(conn, {
        goal_id: result.insertId,
        user_id: data.user_id,
        amount: initialDeposit,
        note: 'Setoran awal goal',
        wallet_id: data.wallet_id,
      });
    }

    await conn.commit();
    return getGoalById(result.insertId, data.user_id);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ---- UPDATE goal ----
export const updateGoal = async (id: number, user_id: number, data: {
  title?: string;
  target_amount?: number;
  icon?: string;
  deadline?: string;
  is_completed?: boolean;
}) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.title) { fields.push('title = ?'); values.push(data.title); }
  if (data.target_amount !== undefined) { fields.push('target_amount = ?'); values.push(data.target_amount); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.deadline !== undefined) { fields.push('deadline = ?'); values.push(data.deadline); }
  if (data.is_completed !== undefined) { fields.push('is_completed = ?'); values.push(data.is_completed ? 1 : 0); }
  if (fields.length === 0) return null;
  values.push(id, user_id);
  await pool.query(`UPDATE goals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
  return getGoalById(id, user_id);
};

// ---- DELETE goal ----
export const deleteGoal = async (id: number, user_id: number) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [goalRows] = await conn.query<RowDataPacket[]>(
      'SELECT current_amount FROM goals WHERE id = ? AND user_id = ? FOR UPDATE',
      [id, user_id]
    );
    if (!goalRows || goalRows.length === 0) {
      await conn.rollback();
      return false;
    }

    const refund = Number(goalRows[0].current_amount) || 0;

    const [result] = await conn.query<ResultSetHeader>(
      'DELETE FROM goals WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    // Dana yang sudah disisihkan dikembalikan ke saldo aktif dompet.
    if (refund > 0) {
      const [wallets] = await conn.query<RowDataPacket[]>(
        'SELECT id FROM wallets WHERE user_id = ? ORDER BY is_default DESC, created_at ASC LIMIT 1 FOR UPDATE',
        [user_id]
      );
      if (wallets && wallets.length > 0) {
        await conn.query(
          'UPDATE wallets SET balance = balance + ? WHERE id = ? AND user_id = ?',
          [refund, wallets[0].id, user_id]
        );
      } else {
        await conn.query(
          'INSERT INTO wallets (user_id, name, balance, currency, is_default) VALUES (?, ?, ?, ?, ?)',
          [user_id, 'Dompet Utama', refund, 'IDR', 1]
        );
      }
    }

    await conn.commit();
    return result.affectedRows > 0;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ---- ADD fund to goal ----
export const addFund = async (data: {
  goal_id: number;
  user_id: number;
  amount: number;
  note?: string;
  wallet_id?: number;
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await applyFundToGoal(conn, data);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ---- GET fund history for a goal ----
export const getGoalFunds = async (goal_id: number, user_id: number) => {
  const goal = await getGoalById(goal_id, user_id);
  if (!goal) return [];
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM goal_funds WHERE goal_id = ? AND user_id = ? ORDER BY created_at DESC',
    [goal_id, user_id]
  );
  return rows;
};

// ---- COUNT active goals ----
export const countActiveGoals = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM goals WHERE user_id = ? AND is_completed = 0',
    [user_id]
  );
  return rows[0].total;
};
