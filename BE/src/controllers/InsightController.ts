import { Response } from 'express';
import { insightService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class InsightController {
  constructor(private readonly insights = insightService) {}

  // ---- GET insights (Student gets personal, Admin gets all/campaigns) ----
  getInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role === 'admin') {
      const allInsights = await this.insights.getAllInsights();
      return AppBaseResponse.success(res, allInsights);
    }

    const insights = await this.insights.getInsights(req.user!.id);
    return AppBaseResponse.success(res, insights);
  });

  // ---- CREATE / GENERATE insight ----
  createInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { user_id, insight_type, content } = req.body;
    const targetUserId = req.user!.role === 'admin' && user_id ? user_id : req.user!.id;

    if (!insight_type || !content) {
      throw AppError.badRequest('insight_type and content are required', 'VALIDATION_ERROR');
    }

    const created = await this.insights.createInsight({
      user_id: targetUserId,
      insight_type,
      content,
    });
    return AppBaseResponse.created(res, created, 'Insight created successfully');
  });

  // ---- DELETE insight ----
  deleteInsight = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.insights.deleteInsight(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Insight not found', 'INSIGHT_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Insight deleted successfully');
  });
}

export const insightController = new InsightController();
