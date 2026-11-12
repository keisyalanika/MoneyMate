import { Prisma } from '../generated/prisma/client';
import { Goal, GoalFund } from '../types';
import { BaseRepository } from './base/BaseRepository';
import {
  CreateGoalData,
  CreateGoalFundData,
  IGoalRepository,
  LockedWallet,
  UpdateGoalData,
} from './interfaces/IGoalRepository';
import { toNumber } from './mappers/MapperHelpers';
import { GoalRawRow, toGoal, toGoalFromRaw, toGoalFund } from './mappers/GoalMapper';

const toDate = (value: string | null | undefined) =>
  value ? new Date(`${value}T00:00:00.000Z`) : null;

export class GoalRepository extends BaseRepository implements IGoalRepository {
  async findByUser(userId: number): Promise<Goal[]> {
    const rows = await this.db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toGoal);
  }

  async findById(id: number, userId?: number): Promise<Goal | null> {
    const row = await this.db.goal.findFirst({
      where: { id, ...(userId !== undefined ? { userId } : {}) },
    });
    return row ? toGoal(row) : null;
  }

  async create(data: CreateGoalData): Promise<number> {
    const row = await this.db.goal.create({
      data: {
        userId: data.user_id,
        title: data.title,
        targetAmount: data.target_amount,
        icon: data.icon ?? null,
        deadline: toDate(data.deadline),
      },
    });
    return row.id;
  }

  async update(id: number, userId: number, data: UpdateGoalData): Promise<Goal | null> {
    const payload: Prisma.GoalUpdateManyMutationInput = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.target_amount !== undefined) payload.targetAmount = data.target_amount;
    if (data.icon !== undefined) payload.icon = data.icon;
    if (data.deadline !== undefined) payload.deadline = toDate(data.deadline);
    if (data.is_completed !== undefined) payload.isCompleted = data.is_completed;
    if (Object.keys(payload).length === 0) return null;

    const result = await this.db.goal.updateMany({ where: { id, userId }, data: payload });
    if (result.count === 0) return null;
    return this.findById(id, userId);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const result = await this.db.goal.deleteMany({ where: { id, userId } });
    return result.count > 0;
  }

  async incrementCurrentAmount(id: number, userId: number, amount: number): Promise<void> {
    await this.db.goal.updateMany({
      where: { id, userId },
      data: { currentAmount: { increment: amount } },
    });
  }

  async setCompleted(id: number, userId: number, isCompleted: boolean): Promise<void> {
    await this.db.goal.updateMany({ where: { id, userId }, data: { isCompleted } });
  }

  async createFund(data: CreateGoalFundData): Promise<GoalFund> {
    const row = await this.db.goalFund.create({
      data: {
        goalId: data.goal_id,
        userId: data.user_id,
        amount: data.amount,
        note: data.note ?? null,
      },
    });
    return toGoalFund(row);
  }

  async findFunds(goalId: number, userId: number): Promise<GoalFund[]> {
    const rows = await this.db.goalFund.findMany({
      where: { goalId, userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toGoalFund);
  }

  countActive(userId: number): Promise<number> {
    return this.db.goal.count({ where: { userId, isCompleted: false } });
  }

  async lockById(id: number, userId: number): Promise<Goal | null> {
    const rows = await this.db.$queryRaw<GoalRawRow[]>(
      Prisma.sql`SELECT * FROM goals WHERE id = ${id} AND user_id = ${userId} FOR UPDATE`
    );
    return rows[0] ? toGoalFromRaw(rows[0]) : null;
  }

  async lockWallets(userId: number, walletId?: number): Promise<LockedWallet[]> {
    const rows =
      walletId !== undefined && walletId !== null
        ? await this.db.$queryRaw<Array<{ id: number; name: string; balance: unknown }>>(
            Prisma.sql`SELECT id, name, balance FROM wallets WHERE id = ${walletId} AND user_id = ${userId} FOR UPDATE`
          )
        : await this.db.$queryRaw<Array<{ id: number; name: string; balance: unknown }>>(
            Prisma.sql`SELECT id, name, balance FROM wallets WHERE user_id = ${userId} ORDER BY is_default DESC, created_at ASC FOR UPDATE`
          );

    return rows.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      balance: toNumber(wallet.balance),
    }));
  }

  async deductWalletBalance(walletId: number, userId: number, amount: number): Promise<void> {
    await this.db.wallet.updateMany({
      where: { id: walletId, userId },
      data: { balance: { decrement: amount } },
    });
  }

  async creditWalletBalance(walletId: number, userId: number, amount: number): Promise<void> {
    await this.db.wallet.updateMany({
      where: { id: walletId, userId },
      data: { balance: { increment: amount } },
    });
  }

  async createWallet(userId: number, name: string, balance: number, currency: string): Promise<LockedWallet> {    const wallet = await this.db.wallet.create({
      data: { userId, name, balance, currency, isDefault: true },
    });
    return { id: wallet.id, name: wallet.name, balance: toNumber(wallet.balance) };
  }
}
