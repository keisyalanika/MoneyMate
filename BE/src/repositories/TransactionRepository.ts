import { Prisma } from '../generated/prisma/client';
import { Transaction } from '../types';
import { BaseRepository } from './base/BaseRepository';
import {
  CreateTransactionData,
  ITransactionRepository,
  TransactionFilters,
  TransactionSummary,
  UpdateTransactionData,
} from './interfaces/ITransactionRepository';
import { toNumber } from './mappers/MapperHelpers';
import { toTransaction } from './mappers/TransactionMapper';

const startOfDay = (value: string) => new Date(`${value}T00:00:00.000Z`);

const monthRange = (month: number, year: number) => ({
  gte: new Date(Date.UTC(year, month - 1, 1)),
  lt: new Date(Date.UTC(year, month, 1)),
});

export class TransactionRepository extends BaseRepository implements ITransactionRepository {
  async findAll(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = {};

    if (filters.user_id) where.userId = filters.user_id;
    if (filters.type) where.type = filters.type;
    if (filters.category_id) where.categoryId = filters.category_id;
    if (filters.search) {
      where.OR = [
        { note: { contains: filters.search } },
        { category: { is: { name: { contains: filters.search } } } },
      ];
    }
    if (filters.start_date || filters.end_date) {
      where.date = {
        ...(filters.start_date ? { gte: startOfDay(filters.start_date) } : {}),
        ...(filters.end_date ? { lte: startOfDay(filters.end_date) } : {}),
      };
    }

    const rows = await this.db.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: filters.limit,
      skip: filters.offset,
      include: {
        category: { select: { name: true, icon: true } },
        user: { select: { name: true, email: true, avatarUrl: true } },
        incomeSource: { select: { sourceName: true } },
      },
    });

    return rows.map(toTransaction);
  }

  async findById(id: number): Promise<Transaction | null> {
    const row = await this.db.transaction.findUnique({
      where: { id },
      include: { category: { select: { name: true, icon: true } } },
    });
    return row ? toTransaction(row) : null;
  }

  async create(data: CreateTransactionData): Promise<number> {
    const row = await this.db.transaction.create({
      data: {
        userId: data.user_id,
        type: data.type,
        amount: data.amount,
        categoryId: data.category_id,
        incomeSourceId: data.income_source_id ?? null,
        date: startOfDay(data.date),
        note: data.note ?? null,
        receiptImageUrl: data.receipt_image_url ?? null,
      },
    });
    return row.id;
  }

  async update(id: number, data: UpdateTransactionData): Promise<Transaction | null> {
    const payload: Prisma.TransactionUpdateInput = {};
    if (data.type !== undefined) payload.type = data.type;
    if (data.amount !== undefined) payload.amount = data.amount;
    if (data.category_id !== undefined) payload.category = { connect: { id: data.category_id } };
    if (data.date !== undefined) payload.date = startOfDay(data.date);
    if (data.note !== undefined) payload.note = data.note;

    if (Object.keys(payload).length === 0) return null;

    try {
      await this.db.transaction.update({ where: { id }, data: payload });
      return this.findById(id);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return null;
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.transaction.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }

  async monthlySummary(userId: number, month: number, year: number): Promise<TransactionSummary> {
    const date = monthRange(month, year);
    const [income, expense] = await Promise.all([
      this.db.transaction.aggregate({
        where: { userId, type: 'income', date },
        _sum: { amount: true },
      }),
      this.db.transaction.aggregate({
        where: { userId, type: 'expense', date },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = toNumber(income._sum.amount);
    const totalExpense = toNumber(expense._sum.amount);

    return { totalIncome, totalExpense, totalBalance: totalIncome - totalExpense };
  }

  async overallSummary(): Promise<TransactionSummary & { totalTransactions: number }> {
    const [income, expense, totalTransactions] = await Promise.all([
      this.db.transaction.aggregate({ where: { type: 'income' }, _sum: { amount: true } }),
      this.db.transaction.aggregate({ where: { type: 'expense' }, _sum: { amount: true } }),
      this.db.transaction.count(),
    ]);

    const totalIncome = toNumber(income._sum.amount);
    const totalExpense = toNumber(expense._sum.amount);

    return {
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      totalTransactions,
    };
  }
}
