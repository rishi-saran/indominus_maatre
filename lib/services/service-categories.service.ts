// lib/services/service-categories.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
}

/* =======================
   Service Categories API
======================= */

export class ServiceCategoriesService {
  /**
   * List all service categories
   */
  static async list(): Promise<ServiceCategory[]> {
    return ApiService.get<ServiceCategory[]>(
      API_ENDPOINTS.serviceCategories.list
    );
  }
}