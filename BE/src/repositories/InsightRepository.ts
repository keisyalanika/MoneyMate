import { AiInsight } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateInsightData, IInsightRepository } from './interfaces/IInsightRepository';
import { toAiInsight } from './mappers/InsightMapper';

export class InsightRepository extends BaseRepository implements IInsightRepository {
  async findByUser(userId: number): Promise<AiInsight[]> {
    const rows = await this.db.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return rows.map(toAiInsight);
  }

  async findAll(): Promise<AiInsight[]> {
    const rows = await this.db.aiInsight.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true } } },
    });
    return rows.map(toAiInsight);
  }

  async create(data: CreateInsightData): Promise<AiInsight> {
    const row = await this.db.aiInsight.create({
      data: {
        userId: data.user_id,
        insightType: data.insight_type,
        content: data.content,
      },
    });
    return toAiInsight(row);
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.aiInsight.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }
}
