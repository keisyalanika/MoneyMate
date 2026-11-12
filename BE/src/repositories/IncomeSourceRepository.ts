import { IncomeSource } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateIncomeSourceData, IIncomeSourceRepository } from './interfaces/IIncomeSourceRepository';
import { toIncomeSource } from './mappers/IncomeSourceMapper';

export class IncomeSourceRepository extends BaseRepository implements IIncomeSourceRepository {
  async findByUser(userId: number): Promise<IncomeSource[]> {
    const rows = await this.db.incomeSource.findMany({
      where: { userId },
      orderBy: { sourceName: 'asc' },
    });
    return rows.map(toIncomeSource);
  }

  async create(data: CreateIncomeSourceData): Promise<IncomeSource> {
    const row = await this.db.incomeSource.create({
      data: { userId: data.user_id, sourceName: data.source_name },
    });
    return toIncomeSource(row);
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.incomeSource.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }
}
