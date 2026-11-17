import { Response } from 'express';
import { auditService, notificationService, summaryService, userService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class AdminController {
  constructor(
    private readonly users = userService,
    private readonly audits = auditService,
    private readonly summary = summaryService,
    private readonly notifications = notificationService
  ) {}

  // ---- GET admin dashboard ----
  getDashboard = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const dashboard = await this.summary.getAdminDashboard();
    return AppBaseResponse.success(res, dashboard);
  });

  // ---- GET all users (admin) ----
  getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const users = (await this.users.getAllUsers()).filter((user) => user.role === 'student');
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

  // ---- GET notification campaigns ----
  getCampaigns = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const list = await this.notifications.listCampaigns();
    return AppBaseResponse.success(res, list);
  });

  // ---- SEND notification campaign ----
  sendCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, message, type, audience } = req.body;
    if (!title) {
      throw AppError.badRequest('title is required', 'VALIDATION_ERROR');
    }

    const created = await this.notifications.broadcast({
      admin_id: req.user!.id,
      title,
      message,
      type,
      audience,
    });

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'SEND_NOTIFICATION',
      target_table: 'notification_campaigns',
      target_id: created.id,
      description: `Mengirim notifikasi "${title}" ke ${created.audience} (${created.recipient_count} pengguna)`,
    });

    return AppBaseResponse.created(res, created, 'Notifikasi berhasil dikirim');
  });

  // ---- DELETE notification campaign ----
  deleteCampaign = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.notifications.deleteCampaign(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Notifikasi tidak ditemukan', 'CAMPAIGN_NOT_FOUND');
    }

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'DELETE_NOTIFICATION',
      target_table: 'notification_campaigns',
      target_id: Number(req.params.id),
      description: `Menghapus riwayat notifikasi #${req.params.id}`,
    });

    return AppBaseResponse.deleted(res, 'Notifikasi berhasil dihapus');
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
