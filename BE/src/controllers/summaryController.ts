import { Response } from 'express';
import * as summaryService from '../services/summaryService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET summary (user or admin) ----
export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === 'admin') {
      const summary = await summaryService.getAdminSummary();
      return res.json({ success: true, data: summary, message: 'Admin summary retrieved successfully' });
    }
    const summary = await summaryService.getUserSummary(req.user!.id);
    res.json({ success: true, data: summary, message: 'Summary retrieved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
