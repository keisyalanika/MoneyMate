import { Response } from 'express';
import { settingsService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class SettingsController {
  constructor(private readonly settings = settingsService) {}

  // ---- GET settings ----
  getSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const settings = await this.settings.getSettings(req.user!.id);
    return AppBaseResponse.success(res, settings);
  });

  // ---- UPDATE settings ----
  updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.settings.updateSettings(req.user!.id, req.body);
    return AppBaseResponse.updated(res, updated, 'Settings updated successfully');
  });
}

export const settingsController = new SettingsController();
