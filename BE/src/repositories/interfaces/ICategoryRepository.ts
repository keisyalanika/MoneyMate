import { Category, TransactionType } from '../../types';

export interface CreateCategoryData {
  name: string;
  type: TransactionType;
  icon?: string | null;
}

export interface UpdateCategoryData {
  name?: string;
  type?: TransactionType;
  icon?: string | null;
}

export interface ICategoryRepository {
  findAll(type?: TransactionType): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category | null>;
  remove(id: number): Promise<boolean>;
}
