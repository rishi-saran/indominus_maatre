import { ApiService } from '@/lib/services/api.service';

const BASE = () => `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/settings`;

export interface Setting {
  key: string;
  value: string;
  updated_at?: string;
}

export class AdminSettingsService {
  static async getAll(): Promise<Setting[]> {
    return ApiService.get<Setting[]>(`${BASE()}/`);
  }

  static async getCommission(): Promise<Setting[]> {
    return ApiService.get<Setting[]>(`${BASE()}/commission`);
  }

  static async getByKey(key: string): Promise<Setting> {
    return ApiService.get<Setting>(`${BASE()}/${key}`);
  }

  static async updateByKey(key: string, value: string): Promise<Setting> {
    return ApiService.put<Setting>(`${BASE()}/${key}`, { value });
  }

  /** Upsert multiple settings in one call */
  static async bulkUpdate(settings: Record<string, string>): Promise<Setting[]> {
    return ApiService.post<Setting[]>(`${BASE()}/bulk`, { settings });
  }

  static async deleteByKey(key: string): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`${BASE()}/${key}`);
  }
}
