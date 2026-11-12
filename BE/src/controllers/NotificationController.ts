import { Response } from 'express';
import { notificationService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class NotificationController {
  constructor(private readonly notifications = notificationService) {}

  // ---- GET notifications ----
  getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id || 1;
    const list = await this.notifications.getNotifications(userId);
    const unread = await this.notifications.countUnread(userId);

    return AppBaseResponse.success(res, { notifications: list, unreadCount: unread });
  });

  // ---- CREATE notification (admin / system) ----
  addNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { user_id, title, message } = req.body;
    const targetUserId = user_id || req.user?.id || 1;

    if (!title) {
      throw AppError.badRequest('title is required', 'VALIDATION_ERROR');
    }

    const created = await this.notifications.createNotification({
      user_id: targetUserId,
      title,
      message,
    });
    return AppBaseResponse.created(res, created, 'Notifikasi berhasil dibuat');
  });

  // ---- MARK as read ----
  markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.notifications.markAsRead(Number(req.params.id));
    return AppBaseResponse.success(res, null, 'Notification marked as read');
  });

  // ---- MARK all as read ----
  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id || 1;
    await this.notifications.markAllAsRead(userId);
    return AppBaseResponse.success(res, null, 'All notifications marked as read');
  });

  // ---- DELETE notification ----
  deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.notifications.deleteNotification(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Notification not found', 'NOTIFICATION_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Notification deleted successfully');
  });
}

export const notificationController = new NotificationController();
