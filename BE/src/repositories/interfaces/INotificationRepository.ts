import { Notification } from '../../types';

export interface CreateNotificationData {
  user_id: number;
  title: string;
  message?: string | null;
}

export interface INotificationRepository {
  findByUser(userId: number): Promise<Notification[]>;
  create(data: CreateNotificationData): Promise<Notification>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
  remove(id: number): Promise<boolean>;
  countUnread(userId: number): Promise<number>;
}
