import { Notification } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateNotificationData, INotificationRepository } from './interfaces/INotificationRepository';
import { toNotification } from './mappers/NotificationMapper';

export class NotificationRepository extends BaseRepository implements INotificationRepository {
  async findByUser(userId: number): Promise<Notification[]> {
    const rows = await this.db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return rows.map(toNotification);
  }

  async create(data: CreateNotificationData): Promise<Notification> {
    const row = await this.db.notification.create({
      data: {
        userId: data.user_id,
        title: data.title,
        message: data.message ?? null,
      },
    });
    return toNotification(row);
  }

  async markAsRead(id: number): Promise<void> {
    await this.db.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.db.notification.updateMany({ where: { userId }, data: { isRead: true } });
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.notification.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }

  countUnread(userId: number): Promise<number> {
    return this.db.notification.count({ where: { userId, isRead: false } });
  }
}
