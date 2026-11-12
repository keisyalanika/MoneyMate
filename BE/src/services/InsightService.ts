import { insightRepository } from '../repositories';

export class InsightService {
  constructor(private readonly insights = insightRepository) {}

  getInsights(userId: number) {
    return this.insights.findByUser(userId);
  }

  getAllInsights() {
    return this.insights.findAll();
  }

  createInsight(data: { user_id: number; insight_type: string; content: string }) {
    return this.insights.create(data);
  }

  deleteInsight(id: number) {
    return this.insights.remove(id);
  }
}

export const insightService = new InsightService();
