import { Response } from 'express';
import * as incomeSourceService from '../services/incomeSourceService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET all income sources for user ----
export const getIncomeSources = async (req: AuthRequest, res: Response) => {
  try {
    const list = await incomeSourceService.getIncomeSources(req.user!.id);
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE income source ----
export const addIncomeSource = async (req: AuthRequest, res: Response) => {
  try {
    const { source_name } = req.body;
    if (!source_name) {
      return res.status(400).json({ success: false, message: 'source_name is required' });
    }
    const created = await incomeSourceService.createIncomeSource({
      user_id: req.user!.id,
      source_name: source_name.trim(),
    });
    res.status(201).json({ success: true, data: created, message: 'Income source added successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE income source ----
export const removeIncomeSource = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await incomeSourceService.deleteIncomeSource(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Income source not found' });
    }
    res.json({ success: true, message: 'Income source deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
