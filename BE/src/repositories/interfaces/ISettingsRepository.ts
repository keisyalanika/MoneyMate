import { UserSettings } from '../../types';

export interface UpdateSettingsData {
  currency?: string;
  language?: string;
  theme?: string;
  notification_enabled?: boolean;
}

export interface ISettingsRepository {
  findByUser(userId: number): Promise<UserSettings | null>;
  ensure(userId: number): Promise<UserSettings>;
  update(userId: number, data: UpdateSettingsData): Promise<UserSettings>;
}
