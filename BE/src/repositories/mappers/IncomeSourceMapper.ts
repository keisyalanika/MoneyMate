import { IncomeSource } from '../../types';

export interface IncomeSourceRow {
  id: number;
  userId: number;
  sourceName: string;
  createdAt: Date;
}

export const toIncomeSource = (row: IncomeSourceRow): IncomeSource => ({
  id: row.id,
  user_id: row.userId,
  source_name: row.sourceName,
  created_at: row.createdAt,
});
