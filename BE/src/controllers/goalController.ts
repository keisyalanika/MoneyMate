import { Response } from 'express';
import * as goalService from '../services/goalService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET goals ----
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const list = await goalService.getGoals(req.user!.id);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET goal detail ----
export const getGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await goalService.getGoalById(Number(req.params.id));
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: goal });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE goal ----
export const addGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, target_amount, icon, deadline } = req.body;
    if (!title || !target_amount) {
      return res.status(400).json({ success: false, message: 'title and target_amount are required' });
    }
    const created = await goalService.createGoal({
      user_id: req.user!.id,
      title,
      target_amount,
      icon,
      deadline,
    });
    res.status(201).json({ success: true, data: created, message: 'Goal created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE goal ----
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await goalService.updateGoal(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: updated, message: 'Goal updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE goal ----
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await goalService.deleteGoal(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- ADD fund to goal ----
export const addFund = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, note } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'amount is required' });
    }
    const fund = await goalService.addFund({
      goal_id: Number(req.params.id),
      user_id: req.user!.id,
      amount,
      note,
    });
    res.status(201).json({ success: true, data: fund, message: 'Fund added successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET fund history ----
export const getGoalFunds = async (req: AuthRequest, res: Response) => {
  try {
    const funds = await goalService.getGoalFunds(Number(req.params.id));
    res.json({ success: true, data: funds });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
