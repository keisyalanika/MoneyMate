import { DbBool, Notification, NotificationCampaign } from '../../types';
import { nullable, toFlag } from './MapperHelpers';

export interface NotificationRow {
  id: number;
  userId: number;
  campaignId: number | null;
  title: string;
  message: string | null;
  isRead: boolean | null;
  createdAt: Date;
}

export const toNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  user_id: row.userId,
  campaign_id: row.campaignId ?? undefined,
  title: row.title,
  message: nullable(row.message),
  is_read: toFlag(row.isRead) as DbBool,
  created_at: row.createdAt,
});

export interface NotificationCampaignRow {
  id: number;
  adminId: number;
  title: string;
  message: string | null;
  type: string;
  audience: string;
  recipientCount: number;
  createdAt: Date;
}

export const toNotificationCampaign = (row: NotificationCampaignRow): NotificationCampaign => ({
  id: row.id,
  admin_id: row.adminId,
  title: row.title,
  message: nullable(row.message),
  type: row.type,
  audience: row.audience,
  recipient_count: row.recipientCount,
  created_at: row.createdAt,
});
