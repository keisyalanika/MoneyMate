import { Prisma } from '../generated/prisma/client';
import { Category, TransactionType } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateCategoryData, ICategoryRepository, UpdateCategoryData } from './interfaces/ICategoryRepository';
import { toCategory } from './mappers/CategoryMapper';

export class CategoryRepository extends BaseRepository implements ICategoryRepository {
  async findAll(type?: TransactionType): Promise<Category[]> {
    const rows = await this.db.category.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' },
    });
    return rows.map(toCategory);
  }

  async findById(id: number): Promise<Category | null> {
    const row = await this.db.category.findUnique({ where: { id } });
    return row ? toCategory(row) : null;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const row = await this.db.category.create({
      data: { name: data.name, type: data.type, icon: data.icon ?? null },
    });
    return toCategory(row);
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category | null> {
    const payload: Prisma.CategoryUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.type !== undefined) payload.type = data.type;
    if (data.icon !== undefined) payload.icon = data.icon;
    if (Object.keys(payload).length === 0) return null;

    try {
      const row = await this.db.category.update({ where: { id }, data: payload });
      return toCategory(row);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return null;
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.category.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }
}
