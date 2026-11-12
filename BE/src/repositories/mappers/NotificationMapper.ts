import { DbBool, Notification } from '../../types';
import { nullable, toFlag } from './MapperHelpers';

export interface NotificationRow {
  id: number;
  userId: number;
  title: string;
  message: string | null;
  isRead: boolean | null;
  createdAt: Date;
}

export const toNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  user_id: row.userId,
  title: row.title,
  message: nullable(row.message),
  is_read: toFlag(row.isRead) as DbBool,
  created_at: row.createdAt,
});
