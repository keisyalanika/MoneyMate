import { Response } from 'express';
import { goalService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class GoalController {
  constructor(private readonly goals = goalService) {}

  // ---- GET goals ----
  getGoals = asyncHandler(async (req: AuthRequest, res: Response) => {
    const list = await this.goals.getGoals(req.user!.id);
    return AppBaseResponse.success(res, list);
  });

  // ---- GET goal detail ----
  getGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const goal = await this.goals.getGoalById(Number(req.params.id), req.user!.id);
    if (!goal) {
      throw AppError.notFound('Goal not found', 'GOAL_NOT_FOUND');
    }
    return AppBaseResponse.success(res, goal);
  });

  // ---- CREATE goal ----
  addGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, target_amount, initial_deposit, wallet_id, icon, deadline } = req.body;
    if (!title || !target_amount) {
      throw AppError.badRequest('title and target_amount are required', 'VALIDATION_ERROR');
    }

    const created = await this.goals.createGoal({
      user_id: req.user!.id,
      title,
      target_amount: Number(target_amount),
      initial_deposit: initial_deposit !== undefined ? Number(initial_deposit) : 0,
      wallet_id: wallet_id !== undefined && wallet_id !== null ? Number(wallet_id) : undefined,
      icon,
      deadline,
    });

    return AppBaseResponse.created(res, created, 'Goal created successfully');
  });

  // ---- UPDATE goal ----
  updateGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.goals.updateGoal(
      Number(req.params.id),
      req.user!.id,
      req.body
    );
    if (!updated) {
      throw AppError.notFound('Goal not found', 'GOAL_NOT_FOUND');
    }
    return AppBaseResponse.updated(res, updated, 'Goal updated successfully');
  });

  // ---- DELETE goal ----
  deleteGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.goals.deleteGoal(Number(req.params.id), req.user!.id);
    if (!deleted) {
      throw AppError.notFound('Goal not found', 'GOAL_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Goal deleted successfully');
  });

  // ---- ADD fund to goal ----
  addFund = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { amount, note, wallet_id } = req.body;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw AppError.badRequest('Nominal setoran harus lebih dari 0.', 'INVALID_AMOUNT');
    }

    const result = await this.goals.addFund({
      goal_id: Number(req.params.id),
      user_id: req.user!.id,
      amount: parsedAmount,
      note,
      wallet_id: wallet_id !== undefined && wallet_id !== null ? Number(wallet_id) : undefined,
    });

    return AppBaseResponse.created(res, result, 'Fund added successfully');
  });

  // ---- GET fund history ----
  getGoalFunds = asyncHandler(async (req: AuthRequest, res: Response) => {
    const funds = await this.goals.getGoalFunds(Number(req.params.id), req.user!.id);
    return AppBaseResponse.success(res, funds);
  });
}

export const goalController = new GoalController();
