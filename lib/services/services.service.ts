// lib/services/services.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface Service {
  id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  is_virtual: boolean;
  category_id: string;
  provider_id: string;
}

/* =======================
   Services API
======================= */

export class ServicesService {
  /**
   * List all services
   */
  static async list(params?: { category_id?: string }): Promise<Service[]> {
    return ApiService.get<Service[]>(
      API_ENDPOINTS.services.list,
      { params }
    );
  }

  /**
   * Get service by ID
   */
  static async getById(serviceId: string): Promise<Service> {
    return ApiService.get<Service>(
      API_ENDPOINTS.services.getById(serviceId)
    );
  }
}