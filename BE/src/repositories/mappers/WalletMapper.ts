import { DbBool, Wallet } from '../../types';
import { toFlag, toNumber } from './MapperHelpers';

export interface WalletRow {
  id: number;
  userId: number;
  name: string;
  balance: unknown;
  currency: string;
  isDefault: boolean | null;
  createdAt: Date;
}

export const toWallet = (row: WalletRow): Wallet => ({
  id: row.id,
  user_id: row.userId,
  name: row.name,
  balance: toNumber(row.balance),
  currency: row.currency,
  is_default: toFlag(row.isDefault) as DbBool,
  created_at: row.createdAt,
});
