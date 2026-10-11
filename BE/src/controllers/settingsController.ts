import { Response } from 'express';
import * as settingsService from '../services/settingsService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET settings ----
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await settingsService.getSettings(req.user!.id);
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE settings ----
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await settingsService.updateSettings(req.user!.id, req.body);
    res.json({ success: true, data: updated, message: 'Settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
