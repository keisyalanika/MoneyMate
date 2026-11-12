import { settingsRepository } from '../repositories';

export class SettingsService {
  constructor(private readonly settings = settingsRepository) {}

  /** GET settings, otomatis membuat baris default bila belum ada. */
  getSettings(userId: number) {
    return this.settings.ensure(userId);
  }

  updateSettings(
    userId: number,
    data: {
      currency?: string;
      language?: string;
      theme?: string;
      notification_enabled?: boolean;
    }
  ) {
    return this.settings.update(userId, data);
  }
}

export const settingsService = new SettingsService();
