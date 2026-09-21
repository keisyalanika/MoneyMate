import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService';
import { successResponse, errorResponse } from '../utils/responseHandler';

export const getBudgets = (req: Request, res: Response) => {
  try {
    const list = budgetService.getBudgets();
    return successResponse(res, list, 'Budgets retrieved successfully');
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
