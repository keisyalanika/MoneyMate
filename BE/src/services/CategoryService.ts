import { categoryRepository } from '../repositories';
import { TransactionType } from '../types';

export class CategoryService {
  constructor(private readonly categories = categoryRepository) {}

  getCategories(type?: string) {
    return this.categories.findAll(type as TransactionType | undefined);
  }

  getCategoryById(id: number) {
    return this.categories.findById(id);
  }

  createCategory(data: { name: string; type: string; icon?: string }) {
    return this.categories.create({
      name: data.name,
      type: data.type as TransactionType,
      icon: data.icon,
    });
  }

  updateCategory(id: number, data: { name?: string; type?: string; icon?: string }) {
    return this.categories.update(id, {
      name: data.name,
      type: data.type as TransactionType | undefined,
      icon: data.icon,
    });
  }

  deleteCategory(id: number) {
    return this.categories.remove(id);
  }
}

export const categoryService = new CategoryService();
