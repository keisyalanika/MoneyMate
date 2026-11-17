import { Notification, NotificationCampaign } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateCampaignData, CreateNotificationData, INotificationRepository } from './interfaces/INotificationRepository';
import { toNotification, toNotificationCampaign } from './mappers/NotificationMapper';

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

  async findAudienceUsers(audience: string): Promise<number[]> {
    const now = new Date();
    const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where: Record<string, unknown> = { role: 'student' };

    if (audience === 'Pengguna aktif') where.isActive = true;
    if (audience === 'Pengguna baru') where.createdAt = { gte: since };

    const users = await this.db.user.findMany({
      where,
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  async createCampaign(data: CreateCampaignData): Promise<NotificationCampaign> {
    return this.db.$transaction(async (tx) => {
      const campaign = await tx.notificationCampaign.create({
        data: {
          adminId: data.admin_id,
          title: data.title,
          message: data.message ?? null,
          type: data.type,
          audience: data.audience,
          recipientCount: data.user_ids.length,
        },
      });

      if (data.user_ids.length > 0) {
        await tx.notification.createMany({
          data: data.user_ids.map((userId) => ({
            userId,
            campaignId: campaign.id,
            title: data.title,
            message: data.message ?? null,
          })),
        });
      }

      return toNotificationCampaign(campaign);
    });
  }

  async listCampaigns(): Promise<NotificationCampaign[]> {
    const rows = await this.db.notificationCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map(toNotificationCampaign);
  }

  async removeCampaign(id: number): Promise<boolean> {
    try {
      await this.db.notificationCampaign.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }
}
