import { Response } from 'express';
import { reportService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class ReportController {
  constructor(private readonly reports = reportService) {}

  // ---- GET reports ----
  getReports = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { report_type } = req.query;
    const user_id = req.user!.role === 'admin' ? undefined : req.user!.id;
    const list = await this.reports.getReports({ user_id, report_type: report_type as string });
    return AppBaseResponse.success(res, list);
  });

  // ---- CREATE report ----
  createReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { user_id, report_type, title, period_start, period_end, file_url } = req.body;
    if (!report_type) {
      throw AppError.badRequest('report_type is required', 'VALIDATION_ERROR');
    }

    const report = await this.reports.createReport({
      user_id: user_id || req.user!.id,
      generated_by: req.user!.id,
      report_type,
      title,
      period_start,
      period_end,
      file_url,
    });
    return AppBaseResponse.created(res, report, 'Report created successfully');
  });

  // ---- DELETE report ----
  deleteReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.reports.deleteReport(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Report not found', 'REPORT_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Report deleted successfully');
  });
}

export const reportController = new ReportController();
