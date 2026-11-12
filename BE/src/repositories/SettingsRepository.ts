import { CurrencyType, Language, Theme } from '../generated/prisma/enums';
import { UserSettings } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { ISettingsRepository, UpdateSettingsData } from './interfaces/ISettingsRepository';
import { toUserSettings } from './mappers/SettingsMapper';

export class SettingsRepository extends BaseRepository implements ISettingsRepository {
  async findByUser(userId: number): Promise<UserSettings | null> {
    const row = await this.db.userSetting.findUnique({ where: { userId } });
    return row ? toUserSettings(row) : null;
  }

  async ensure(userId: number): Promise<UserSettings> {
    const row = await this.db.userSetting.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    return toUserSettings(row);
  }

  async update(userId: number, data: UpdateSettingsData): Promise<UserSettings> {
    const payload: {
      currency?: CurrencyType;
      language?: Language;
      theme?: Theme;
      notificationEnabled?: boolean;
    } = {};

    if (data.currency) payload.currency = data.currency as CurrencyType;
    if (data.language) payload.language = data.language as Language;
    if (data.theme) payload.theme = data.theme as Theme;
    if (data.notification_enabled !== undefined) payload.notificationEnabled = data.notification_enabled;

    const row = await this.db.userSetting.upsert({
      where: { userId },
      update: payload,
      create: { userId, ...payload },
    });
    return toUserSettings(row);
  }
}
