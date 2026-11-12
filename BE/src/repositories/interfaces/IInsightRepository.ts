import { AiInsight } from '../../types';

export interface CreateInsightData {
  user_id: number;
  insight_type: string;
  content: string;
}

export interface IInsightRepository {
  findByUser(userId: number): Promise<AiInsight[]>;
  findAll(): Promise<AiInsight[]>;
  create(data: CreateInsightData): Promise<AiInsight>;
  remove(id: number): Promise<boolean>;
}
