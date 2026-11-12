import { IncomeSource } from '../../types';

export interface CreateIncomeSourceData {
  user_id: number;
  source_name: string;
}

export interface IIncomeSourceRepository {
  findByUser(userId: number): Promise<IncomeSource[]>;
  create(data: CreateIncomeSourceData): Promise<IncomeSource>;
  remove(id: number): Promise<boolean>;
}
