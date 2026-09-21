import { Request, Response } from 'express';
import * as summaryService from '../services/summaryService';
import { successResponse, errorResponse } from '../utils/responseHandler';

export const getSummary = (req: Request, res: Response) => {
  try {
    const summary = summaryService.getFinancialSummary();
    return successResponse(res, summary, 'Summary retrieved successfully');
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
