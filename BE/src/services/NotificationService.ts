import { notificationRepository } from '../repositories';

export class NotificationService {
  constructor(private readonly notifications = notificationRepository) {}

  getNotifications(userId: number) {
    return this.notifications.findByUser(userId);
  }

  createNotification(data: { user_id: number; title: string; message?: string }) {
    return this.notifications.create(data);
  }

  markAsRead(id: number) {
    return this.notifications.markAsRead(id);
  }

  markAllAsRead(userId: number) {
    return this.notifications.markAllAsRead(userId);
  }

  deleteNotification(id: number) {
    return this.notifications.remove(id);
  }

  countUnread(userId: number) {
    return this.notifications.countUnread(userId);
  }
}

export const notificationService = new NotificationService();
