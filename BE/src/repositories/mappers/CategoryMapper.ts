import { Category, TransactionType } from '../../types';
import { nullable } from './MapperHelpers';

export interface CategoryRow {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  createdAt: Date;
}

export const toCategory = (row: CategoryRow, usage = 0): Category => ({
  id: row.id,
  name: row.name,
  type: row.type,
  icon: nullable(row.icon) as string,
  usage,
  created_at: row.createdAt,
});
