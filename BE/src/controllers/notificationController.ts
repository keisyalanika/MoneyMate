import { Response } from 'express';
import * as notifService from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET notifications ----
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const list = await notifService.getNotifications(req.user!.id);
    const unread = await notifService.countUnread(req.user!.id);
    res.json({ success: true, data: { notifications: list, unreadCount: unread } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE notification (Admin or System) ----
export const addNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { user_id, title, message } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }

    const targetUserId = req.user?.role === 'admin' && user_id ? user_id : req.user!.id;
    const created = await notifService.createNotification({
      user_id: targetUserId,
      title,
      message,
    });

    res.status(201).json({ success: true, data: created, message: 'Notification created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- BROADCAST notification (Admin) ----
export const broadcastNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, role } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }

    const result = await notifService.broadcastNotification({
      title,
      message,
      role,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: `Notification broadcasted to ${result.broadcastCount} users successfully`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- MARK as read ----
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await notifService.markAsRead(Number(req.params.id));
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- MARK all as read ----
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await notifService.markAllAsRead(req.user!.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE notification ----
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await notifService.deleteNotification(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
