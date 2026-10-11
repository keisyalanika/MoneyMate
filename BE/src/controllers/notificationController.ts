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
