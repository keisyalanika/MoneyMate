import { Prisma } from '../generated/prisma/client';
import { Wallet } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateWalletData, IWalletRepository, UpdateWalletData } from './interfaces/IWalletRepository';
import { toNumber } from './mappers/MapperHelpers';
import { toWallet } from './mappers/WalletMapper';

export class WalletRepository extends BaseRepository implements IWalletRepository {
  async findByUser(userId: number): Promise<Wallet[]> {
    const rows = await this.db.wallet.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    return rows.map(toWallet);
  }

  async findById(id: number): Promise<Wallet | null> {
    const row = await this.db.wallet.findUnique({ where: { id } });
    return row ? toWallet(row) : null;
  }

  async create(data: CreateWalletData): Promise<Wallet> {
    const row = await this.db.wallet.create({
      data: {
        userId: data.user_id,
        name: data.name,
        balance: data.balance ?? 0,
        currency: data.currency ?? 'IDR',
        isDefault: data.is_default ?? false,
      },
    });
    return toWallet(row);
  }

  async update(id: number, data: UpdateWalletData): Promise<Wallet | null> {
    const payload: Prisma.WalletUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.balance !== undefined) payload.balance = data.balance;
    if (data.currency !== undefined) payload.currency = data.currency;
    if (Object.keys(payload).length === 0) return null;

    try {
      const row = await this.db.wallet.update({ where: { id }, data: payload });
      return toWallet(row);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return null;
      throw error;
    }
  }

  async setBalance(id: number, balance: number): Promise<void> {
    await this.db.wallet.update({ where: { id }, data: { balance } });
  }

  async adjustBalance(id: number, delta: number): Promise<void> {
    await this.db.wallet.update({
      where: { id },
      data: { balance: { increment: delta } },
    });
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.wallet.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }

  async sumBalance(userId: number): Promise<number> {
    const result = await this.db.wallet.aggregate({
      where: { userId },
      _sum: { balance: true },
    });
    return toNumber(result._sum.balance);
  }
}
