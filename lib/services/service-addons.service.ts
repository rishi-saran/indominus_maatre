import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface ServiceAddon {
  addon_id: string;
  name: string;
  description?: string;
  price: number;
  service_id?: string;
}

export class ServiceAddonsService {
  /**
   * List all service addons
   */
  static async list(params?: { service_id?: string }): Promise<ServiceAddon[]> {
    return ApiService.get<ServiceAddon[]>(API_ENDPOINTS.serviceAddons.list, { params: params });
  }

  /**
   * Get service addon by ID
   */
  static async getById(addonId: string): Promise<ServiceAddon> {
    return ApiService.get<ServiceAddon>(API_ENDPOINTS.serviceAddons.getById(addonId));
  }
}
