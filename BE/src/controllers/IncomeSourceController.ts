import { Response } from 'express';
import { incomeSourceService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class IncomeSourceController {
  constructor(private readonly incomeSources = incomeSourceService) {}

  // ---- GET all income sources for user ----
  getIncomeSources = asyncHandler(async (req: AuthRequest, res: Response) => {
    const list = await this.incomeSources.getIncomeSources(req.user!.id);
    return AppBaseResponse.success(res, list);
  });

  // ---- CREATE income source ----
  addIncomeSource = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { source_name } = req.body;
    if (!source_name) {
      throw AppError.badRequest('source_name is required', 'VALIDATION_ERROR');
    }

    const created = await this.incomeSources.createIncomeSource({
      user_id: req.user!.id,
      source_name: source_name.trim(),
    });
    return AppBaseResponse.created(res, created, 'Income source added successfully');
  });

  // ---- DELETE income source ----
  removeIncomeSource = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.incomeSources.deleteIncomeSource(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Income source not found', 'INCOME_SOURCE_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Income source deleted successfully');
  });
}

export const incomeSourceController = new IncomeSourceController();
