import { Response } from 'express';
import * as goalService from '../services/goalService';
import { AuthRequest } from '../middleware/authMiddleware';

const handleGoalError = (res: Response, err: any) => {
  const code = err?.code;
  if (code === 'GOAL_NOT_FOUND') {
    return res.status(404).json({ success: false, message: err.message });
  }
  if (['INVALID_AMOUNT', 'INVALID_TARGET', 'INSUFFICIENT_BALANCE', 'WALLET_NOT_FOUND'].includes(code)) {
    return res.status(400).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: err?.message || 'Server error' });
};

// ---- GET goals ----
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const list = await goalService.getGoals(req.user!.id);
    res.json({ success: true, data: list });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- GET goal detail ----
export const getGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await goalService.getGoalById(Number(req.params.id), req.user!.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- CREATE goal ----
export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, target_amount, initial_deposit, wallet_id, icon, deadline } = req.body;
    if (!title || !target_amount) {
      return res.status(400).json({ success: false, message: 'title and target_amount are required' });
    }
    const created = await goalService.createGoal({
      user_id: req.user!.id,
      title,
      target_amount: Number(target_amount),
      initial_deposit: initial_deposit !== undefined ? Number(initial_deposit) : 0,
      wallet_id: wallet_id !== undefined && wallet_id !== null ? Number(wallet_id) : undefined,
      icon,
      deadline,
    });
    res.status(201).json({ success: true, data: created, message: 'Goal created successfully' });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- UPDATE goal ----
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await goalService.updateGoal(Number(req.params.id), req.user!.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: updated, message: 'Goal updated successfully' });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- DELETE goal ----
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await goalService.deleteGoal(Number(req.params.id), req.user!.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- ADD fund to goal ----
export const addFund = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, note, wallet_id } = req.body;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal setoran harus lebih dari 0.' });
    }
    const result = await goalService.addFund({
      goal_id: Number(req.params.id),
      user_id: req.user!.id,
      amount: parsedAmount,
      note,
      wallet_id: wallet_id !== undefined && wallet_id !== null ? Number(wallet_id) : undefined,
    });
    res.status(201).json({ success: true, data: result, message: 'Fund added successfully' });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};

// ---- GET fund history ----
export const getGoalFunds = async (req: AuthRequest, res: Response) => {
  try {
    const funds = await goalService.getGoalFunds(Number(req.params.id), req.user!.id);
    res.json({ success: true, data: funds });
  } catch (err: any) {
    handleGoalError(res, err);
  }
};
