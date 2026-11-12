import { Response } from 'express';
import { auditService, userService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class AdminController {
  constructor(
    private readonly users = userService,
    private readonly audits = auditService
  ) {}

  // ---- GET all users (admin) ----
  getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const users = await this.users.getAllUsers();
    return AppBaseResponse.success(res, users);
  });

  // ---- GET user by ID (admin) ----
  getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.users.getUserById(Number(req.params.id));
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }
    return AppBaseResponse.success(res, user);
  });

  // ---- TOGGLE user active (admin) ----
  toggleUserActive = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { is_active } = req.body;
    const updated = await this.users.toggleUserActive(Number(req.params.id), is_active);

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: is_active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      target_table: 'users',
      target_id: Number(req.params.id),
      description: `Admin ${is_active ? 'activated' : 'deactivated'} user #${req.params.id}`,
    });

    return AppBaseResponse.updated(
      res,
      updated,
      `User ${is_active ? 'activated' : 'deactivated'} successfully`
    );
  });

  // ---- DELETE user (admin) ----
  deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.users.deleteUser(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'DELETE_USER',
      target_table: 'users',
      target_id: Number(req.params.id),
      description: `Admin deleted user #${req.params.id}`,
    });

    return AppBaseResponse.deleted(res, 'User deleted successfully');
  });

  // ---- GET audit logs (admin) ----
  getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { action, limit } = req.query;
    const logs = await this.audits.getAuditLogs({
      action: action as string,
      limit: limit ? Number(limit) : 100,
    });
    return AppBaseResponse.success(res, logs);
  });
}

export const adminController = new AdminController();
