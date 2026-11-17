import { Notification, NotificationCampaign } from '../../types';

export interface CreateNotificationData {
  user_id: number;
  title: string;
  message?: string | null;
}

export interface CreateCampaignData {
  admin_id: number;
  title: string;
  message?: string | null;
  type: string;
  audience: string;
  user_ids: number[];
}

export interface INotificationRepository {
  findByUser(userId: number): Promise<Notification[]>;
  create(data: CreateNotificationData): Promise<Notification>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
  remove(id: number): Promise<boolean>;
  countUnread(userId: number): Promise<number>;
  findAudienceUsers(audience: string): Promise<number[]>;
  createCampaign(data: CreateCampaignData): Promise<NotificationCampaign>;
  listCampaigns(): Promise<NotificationCampaign[]>;
  removeCampaign(id: number): Promise<boolean>;
}
