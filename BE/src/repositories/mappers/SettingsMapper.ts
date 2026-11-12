import { CurrencyType, DbBool, LangType, ThemeType, UserSettings } from '../../types';
import { toFlag } from './MapperHelpers';

export interface UserSettingRow {
  id: number;
  userId: number;
  currency: CurrencyType;
  language: LangType;
  theme: ThemeType;
  notificationEnabled: boolean | null;
  updatedAt: Date;
}

export const toUserSettings = (row: UserSettingRow): UserSettings => ({
  id: row.id,
  user_id: row.userId,
  currency: row.currency,
  language: row.language,
  theme: row.theme,
  notification_enabled: toFlag(row.notificationEnabled) as DbBool,
  updated_at: row.updatedAt,
});
