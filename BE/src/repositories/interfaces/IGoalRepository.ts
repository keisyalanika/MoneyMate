import { Goal, GoalFund } from '../../types';

export interface CreateGoalData {
  user_id: number;
  title: string;
  target_amount: number;
  icon?: string | null;
  deadline?: string | null;
}

export interface UpdateGoalData {
  title?: string;
  target_amount?: number;
  icon?: string | null;
  deadline?: string | null;
  is_completed?: boolean;
}

export interface CreateGoalFundData {
  goal_id: number;
  user_id: number;
  amount: number;
  note?: string | null;
}

export interface LockedWallet {
  id: number;
  name: string;
  balance: number;
}

export interface IGoalRepository {
  findByUser(userId: number): Promise<Goal[]>;
  findById(id: number, userId?: number): Promise<Goal | null>;
  create(data: CreateGoalData): Promise<number>;
  update(id: number, userId: number, data: UpdateGoalData): Promise<Goal | null>;
  remove(id: number, userId: number): Promise<boolean>;
  incrementCurrentAmount(id: number, userId: number, amount: number): Promise<void>;
  setCompleted(id: number, userId: number, isCompleted: boolean): Promise<void>;
  createFund(data: CreateGoalFundData): Promise<GoalFund>;
  findFunds(goalId: number, userId: number): Promise<GoalFund[]>;
  countActive(userId: number): Promise<number>;
  lockById(id: number, userId: number): Promise<Goal | null>;
  lockWallets(userId: number, walletId?: number): Promise<LockedWallet[]>;
  deductWalletBalance(walletId: number, userId: number, amount: number): Promise<void>;
  creditWalletBalance(walletId: number, userId: number, amount: number): Promise<void>;
  createWallet(userId: number, name: string, balance: number, currency: string): Promise<LockedWallet>;
}
