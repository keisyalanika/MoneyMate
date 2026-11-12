import { Budget } from '../../types';
import { BudgetResult } from '../mappers/BudgetMapper';

export interface CreateBudgetData {
  user_id: number;
  category_id: number;
  amount: number;
  month: number;
  year: number;
}

export interface UpdateBudgetData {
  amount?: number;
  is_active?: boolean;
}

export interface IBudgetRepository {
  findByUser(userId: number, month?: number, year?: number): Promise<BudgetResult[]>;
  findAll(): Promise<BudgetResult[]>;
  findById(id: number): Promise<BudgetResult | null>;
  findForCategory(userId: number, categoryId: number, month: number, year: number): Promise<BudgetResult | null>;
  spentForCategory(userId: number, categoryId: number, month: number, year: number): Promise<number>;
  upsert(data: CreateBudgetData): Promise<Budget>;
  update(id: number, data: UpdateBudgetData): Promise<Budget | null>;
  remove(id: number): Promise<boolean>;
  countActive(userId: number): Promise<number>;
}
