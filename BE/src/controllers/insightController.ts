import { Response } from 'express';
import * as insightService from '../services/insightService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET insights (Student gets personal, Admin gets all/campaigns) ----
export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === 'admin') {
      const allInsights = await insightService.getAllInsights();
      return res.json({ success: true, data: allInsights });
    }
    const insights = await insightService.getInsights(req.user!.id);
    res.json({ success: true, data: insights });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE / GENERATE insight ----
export const createInsight = async (req: AuthRequest, res: Response) => {
  try {
    const { user_id, insight_type, content } = req.body;
    const targetUserId = req.user!.role === 'admin' && user_id ? user_id : req.user!.id;
    if (!insight_type || !content) {
      return res.status(400).json({ success: false, message: 'insight_type and content are required' });
    }
    const created = await insightService.createInsight({
      user_id: targetUserId,
      insight_type,
      content,
    });
    res.status(201).json({ success: true, data: created, message: 'Insight created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE insight ----
export const deleteInsight = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await insightService.deleteInsight(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Insight not found' });
    }
    res.json({ success: true, message: 'Insight deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
