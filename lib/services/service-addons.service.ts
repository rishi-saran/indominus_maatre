// lib/services/service-addons.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface ServiceAddon {
  id: string;
  service_id: string;
  name: string;
  price: number;
}

/* =======================
   Service Addons API
======================= */

export class ServiceAddonsService {
  /**
   * List all service addons
   */
  static async list(params?: { service_id?: string }): Promise<ServiceAddon[]> {
    return ApiService.get<ServiceAddon[]>(
      API_ENDPOINTS.serviceAddons.list,
      { params }
    );
  }

  /**
   * Get service addon by ID
   */
  static async getById(addonId: string): Promise<ServiceAddon> {
    return ApiService.get<ServiceAddon>(
      API_ENDPOINTS.serviceAddons.getById(addonId)
    );
  }
}