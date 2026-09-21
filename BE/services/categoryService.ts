import { categories } from '../models/mockDb';
import { Category } from '../models/types';

export const getCategories = (): Category[] => categories;

export const createCategory = (payload: Partial<Category>): Category => {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: payload.name || 'Kategori Baru',
    type: payload.type || 'EXPENSE',
    icon: payload.icon || 'folder',
    color: payload.color || '#3B82F6'
  };
  categories.push(newCat);
  return newCat;
};
