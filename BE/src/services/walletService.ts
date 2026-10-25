import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as txService from './transactionService';

// ---- GET all wallets for a user ----
export const getWallets = async (userId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM wallets WHERE user_id = ? ORDER BY is_default DESC, created_at ASC',
    [userId]
  );
  const totalBalance = (rows as any[]).reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
  return {
    wallets: rows,
    totalBalance,
  };
};

// ---- GET wallet by ID ----
export const getWalletById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM wallets WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

// ---- CREATE wallet ----
export const createWallet = async (data: {
  user_id: number;
  name: string;
  balance?: number;
  currency?: string;
  is_default?: boolean;
}) => {
  const balance = Number(data.balance) || 0;
  const currency = data.currency || 'IDR';
  const isDefault = data.is_default ? 1 : 0;

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO wallets (user_id, name, balance, currency, is_default) VALUES (?, ?, ?, ?, ?)',
    [data.user_id, data.name, balance, currency, isDefault]
  );

  return getWalletById(result.insertId);
};

// ---- UPDATE wallet ----
export const updateWallet = async (id: number, data: { name?: string; balance?: number; currency?: string }) => {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.balance !== undefined) { fields.push('balance = ?'); values.push(Number(data.balance)); }
  if (data.currency !== undefined) { fields.push('currency = ?'); values.push(data.currency); }
  if (fields.length === 0) return null;
  values.push(id);

  await pool.query(`UPDATE wallets SET ${fields.join(', ')} WHERE id = ?`, values);
  return getWalletById(id);
};

// ---- DELETE wallet ----
export const deleteWallet = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM wallets WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- ADJUST wallet balance (Add / Subtract directly) ----
export const adjustWalletBalance = async (
  userId: number,
  walletId: number,
  adjustment: {
    type: 'add' | 'subtract';
    amount: number;
    note?: string;
  }
) => {
  let wallet = await getWalletById(walletId);
  if (!wallet) {
    const userWallets = await getWallets(userId);
    if (userWallets.wallets.length > 0) {
      wallet = userWallets.wallets[0];
      walletId = wallet.id;
    } else {
      wallet = await createWallet({
        user_id: userId,
        name: 'Dompet Utama',
        balance: 2450000,
        is_default: true,
      });
      walletId = wallet.id;
    }
  }

  const currentBal = Number(wallet.balance) || 0;
  const adjAmount = Number(adjustment.amount) || 0;
  const isAdd = adjustment.type === 'add';
  const newBalance = isAdd ? currentBal + adjAmount : Math.max(0, currentBal - adjAmount);

  await updateWallet(walletId, { balance: newBalance });

  // Record an automated transaction for auditing & charts
  try {
    await txService.createTransaction({
      user_id: userId,
      wallet_id: walletId,
      type: isAdd ? 'income' : 'expense',
      amount: adjAmount,
      category_id: isAdd ? 6 : 14, // Lainnya Pemasukan / Lainnya Pengeluaran
      date: new Date().toISOString().slice(0, 10),
      note: adjustment.note || (isAdd ? 'Penyesuaian Tambah Saldo Manual' : 'Penyesuaian Pengurangan Saldo Manual'),
    });
  } catch (err: any) {
    console.warn('[Wallet] Could not log adjustment transaction:', err.message);
  }

  return getWalletById(walletId);
};

// ---- SETUP INITIAL BALANCE ----
export const setupInitialBalance = async (
  userId: number,
  initialBalance: number,
  walletName = 'Dompet Utama'
) => {
  const { wallets } = await getWallets(userId);
  if (wallets.length > 0) {
    // Update existing default wallet
    const defaultWallet = (wallets as any[]).find(w => w.is_default) || wallets[0];
    await updateWallet(defaultWallet.id, { balance: initialBalance });
    return getWalletById(defaultWallet.id);
  } else {
    // Create new initial wallet
    return createWallet({
      user_id: userId,
      name: walletName,
      balance: initialBalance,
      is_default: true,
    });
  }
};
