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

  async broadcast(data: {
    admin_id: number;
    title: string;
    message?: string | null;
    type?: string;
    audience?: string;
  }) {
    const audience = data.audience || 'Semua pengguna';
    const userIds = await this.notifications.findAudienceUsers(audience);
    return this.notifications.createCampaign({
      admin_id: data.admin_id,
      title: data.title,
      message: data.message ?? null,
      type: data.type || 'Info',
      audience,
      user_ids: userIds,
    });
  }

  listCampaigns() {
    return this.notifications.listCampaigns();
  }

  deleteCampaign(id: number) {
    return this.notifications.removeCampaign(id);
  }
}

export const notificationService = new NotificationService();
