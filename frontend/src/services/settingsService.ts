import { api } from '@/lib/api';

export interface SettingsResponse {
  status: string;
  data: {
    server_time: string;
    server_timestamp: number;
    timezone: string;
  };
}

class SettingsService {
  /**
   * Fetch server settings including current server time
   */
  async getSettings(): Promise<SettingsResponse> {
    return api.get<SettingsResponse>('/settings');
  }

  /**
   * Get server time as Date object
   */
  async getServerTime(): Promise<Date> {
    const response = await this.getSettings();
    return new Date(response.data.server_time);
  }
}

export const settingsService = new SettingsService();

