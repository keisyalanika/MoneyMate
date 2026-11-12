import { Prisma } from '../generated/prisma/client';
import { Budget } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { BudgetResult, BudgetRawRow, toBudget, toBudgetResult } from './mappers/BudgetMapper';
import { toNumber } from './mappers/MapperHelpers';
import {
  CreateBudgetData,
  IBudgetRepository,
  UpdateBudgetData,
} from './interfaces/IBudgetRepository';

const monthRange = (month: number, year: number) => ({
  gte: new Date(Date.UTC(year, month - 1, 1)),
  lt: new Date(Date.UTC(year, month, 1)),
});

/**
 * Query daftar budget memakai agregasi sql mentah karena butuh korelasi
 * (subquery SUM per kategori + periode). Semua SQL tetap terkurung di layer ini.
 */
const budgetSelect = Prisma.sql`
  SELECT b.*, c.name AS category_name, c.icon AS category_icon,
    COALESCE((
      SELECT SUM(t.amount) FROM transactions t
      WHERE t.user_id = b.user_id
        AND t.category_id = b.category_id
        AND t.type = 'expense'
        AND MONTH(t.date) = b.month
        AND YEAR(t.date) = b.year
    ), 0) AS spent_amount
  FROM budgets b
  LEFT JOIN categories c ON b.category_id = c.id
`;

export class BudgetRepository extends BaseRepository implements IBudgetRepository {
  async findByUser(userId: number, month?: number, year?: number): Promise<BudgetResult[]> {
    const conditions = [Prisma.sql`b.user_id = ${userId}`];
    if (month) conditions.push(Prisma.sql`b.month = ${month}`);
    if (year) conditions.push(Prisma.sql`b.year = ${year}`);

    const rows = await this.db.$queryRaw<BudgetRawRow[]>(Prisma.sql`
      ${budgetSelect}
      WHERE ${Prisma.join(conditions, ' AND ')}
      ORDER BY b.created_at DESC
    `);

    return rows.map(toBudgetResult);
  }

  async findAll(): Promise<BudgetResult[]> {
    const rows = await this.db.$queryRaw<BudgetRawRow[]>(Prisma.sql`
      SELECT b.*, c.name AS category_name, c.icon AS category_icon, u.name AS user_name,
        COALESCE((
          SELECT SUM(t.amount) FROM transactions t
          WHERE t.user_id = b.user_id
            AND t.category_id = b.category_id
            AND t.type = 'expense'
            AND MONTH(t.date) = b.month
            AND YEAR(t.date) = b.year
        ), 0) AS spent_amount
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);

    return rows.map(toBudgetResult);
  }

  async findById(id: number): Promise<BudgetResult | null> {
    const rows = await this.db.$queryRaw<BudgetRawRow[]>(Prisma.sql`
      SELECT b.*, c.name AS category_name, c.icon AS category_icon, u.name AS user_name,
        COALESCE((
          SELECT SUM(t.amount) FROM transactions t
          WHERE t.user_id = b.user_id
            AND t.category_id = b.category_id
            AND t.type = 'expense'
            AND MONTH(t.date) = b.month
            AND YEAR(t.date) = b.year
        ), 0) AS spent_amount
      FROM budgets b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = ${id}
    `);

    return rows[0] ? toBudgetResult(rows[0]) : null;
  }

  async findForCategory(
    userId: number,
    categoryId: number,
    month: number,
    year: number
  ): Promise<BudgetResult | null> {
    const rows = await this.db.$queryRaw<BudgetRawRow[]>(Prisma.sql`
      ${budgetSelect}
      WHERE b.user_id = ${userId} AND b.category_id = ${categoryId}
        AND b.month = ${month} AND b.year = ${year}
      LIMIT 1
    `);

    return rows[0] ? toBudgetResult(rows[0]) : null;
  }

  async spentForCategory(
    userId: number,
    categoryId: number,
    month: number,
    year: number
  ): Promise<number> {
    const aggregate = await this.db.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: 'expense',
        date: monthRange(month, year),
      },
      _sum: { amount: true },
    });

    return toNumber(aggregate._sum.amount);
  }

  async upsert(data: CreateBudgetData): Promise<Budget> {
    const row = await this.db.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: data.user_id,
          categoryId: data.category_id,
          month: data.month,
          year: data.year,
        },
      },
      update: { amount: data.amount },
      create: {
        userId: data.user_id,
        categoryId: data.category_id,
        amount: data.amount,
        month: data.month,
        year: data.year,
      },
    });

    return toBudget(row);
  }

  async update(id: number, data: UpdateBudgetData): Promise<Budget | null> {
    const payload: Prisma.BudgetUpdateInput = {};
    if (data.amount !== undefined) payload.amount = data.amount;
    if (data.is_active !== undefined) payload.isActive = data.is_active;
    if (Object.keys(payload).length === 0) return null;

    try {
      const row = await this.db.budget.update({ where: { id }, data: payload });
      return toBudget(row);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return null;
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.budget.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }

  countActive(userId: number): Promise<number> {
    return this.db.budget.count({ where: { userId, isActive: true } });
  }
}
