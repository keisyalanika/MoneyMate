import { AiInsight } from '../../types';
import { nullable } from './MapperHelpers';

export interface AiInsightRow {
  id: number;
  userId: number;
  insightType: string;
  content: string;
  createdAt: Date;
  user?: { name: string } | null;
}

export const toAiInsight = (row: AiInsightRow): AiInsight => ({
  id: row.id,
  user_id: row.userId,
  insight_type: row.insightType,
  content: row.content,
  created_at: row.createdAt,
  user_name: nullable(row.user?.name),
});
