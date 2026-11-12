import { Wallet } from '../../types';

export interface CreateWalletData {
  user_id: number;
  name: string;
  balance?: number;
  currency?: string;
  is_default?: boolean;
}

export interface UpdateWalletData {
  name?: string;
  balance?: number;
  currency?: string;
}

export interface WalletListResult {
  wallets: Wallet[];
  totalBalance: number;
}

export interface IWalletRepository {
  findByUser(userId: number): Promise<Wallet[]>;
  findById(id: number): Promise<Wallet | null>;
  create(data: CreateWalletData): Promise<Wallet>;
  update(id: number, data: UpdateWalletData): Promise<Wallet | null>;
  setBalance(id: number, balance: number): Promise<void>;
  adjustBalance(id: number, delta: number): Promise<void>;
  remove(id: number): Promise<boolean>;
  sumBalance(userId: number): Promise<number>;
}
