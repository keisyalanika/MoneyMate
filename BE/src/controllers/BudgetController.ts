import { Response } from 'express';
import { budgetService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class BudgetController {
  constructor(private readonly budgets = budgetService) {}

  // ---- GET budgets ----
  getBudgets = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { month, year } = req.query;

    if (req.user!.role === 'admin') {
      const list = await this.budgets.getAllBudgets();
      return AppBaseResponse.success(res, list);
    }

    const list = await this.budgets.getBudgets(
      req.user!.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );

    return AppBaseResponse.success(res, list, 'Budgets retrieved successfully');
  });

  // ---- CREATE budget ----
  addBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category_id, amount, month, year } = req.body;
    if (!category_id || !amount || !month || !year) {
      throw AppError.badRequest(
        'category_id, amount, month, and year are required',
        'VALIDATION_ERROR'
      );
    }

    const created = await this.budgets.createBudget({
      user_id: req.user!.id,
      category_id,
      amount,
      month,
      year,
    });

    return AppBaseResponse.created(res, created, 'Budget created successfully');
  });

  // ---- UPDATE budget ----
  updateBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.budgets.updateBudget(Number(req.params.id), req.body);
    if (!updated) {
      throw AppError.notFound('Budget not found', 'BUDGET_NOT_FOUND');
    }
    return AppBaseResponse.updated(res, updated, 'Budget updated successfully');
  });

  // ---- DELETE budget ----
  deleteBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.budgets.deleteBudget(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Budget not found', 'BUDGET_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Budget deleted successfully');
  });

  // ---- SEND BUDGET ALERT (Admin Intervention -> User Notification) ----
  sendBudgetAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
    const budgetId = Number(req.params.id);
    const { alert_type, custom_message } = req.body;

    const alert = await this.budgets.sendBudgetAlert(budgetId, alert_type, custom_message);
    if (!alert) {
      throw AppError.notFound('Budget not found', 'BUDGET_NOT_FOUND');
    }

    return AppBaseResponse.success(
      res,
      {
        user_id: alert.user_id,
        title: alert.title,
        message: alert.message,
      },
      `Pemberitahuan berhasil dikirimkan ke ${alert.user_name}`
    );
  });
}

export const budgetController = new BudgetController();
