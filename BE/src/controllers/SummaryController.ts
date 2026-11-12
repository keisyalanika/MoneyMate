import { Response } from 'express';
import { summaryService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class SummaryController {
  constructor(private readonly summary = summaryService) {}

  // ---- GET summary (user or admin) ----
  getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role === 'admin') {
      const summary = await this.summary.getAdminSummary();
      return AppBaseResponse.success(res, summary, 'Admin summary retrieved successfully');
    }

    const summary = await this.summary.getUserSummary(req.user!.id);
    return AppBaseResponse.success(res, summary, 'Summary retrieved successfully');
  });
}

export const summaryController = new SummaryController();
