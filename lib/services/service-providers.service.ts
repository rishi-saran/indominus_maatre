// lib/services/service-providers.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string | null;
  verified: boolean;
  created_at: string;
}

/* =======================
   Service Providers API
======================= */

export class ServiceProvidersService {
  /**
   * List all service providers
   */
  static async list(): Promise<ServiceProvider[]> {
    return ApiService.get<ServiceProvider[]>(
      API_ENDPOINTS.serviceProviders.list
    );
  }

  /**
   * Get service provider by ID
   */
  static async getById(providerId: string): Promise<ServiceProvider> {
    return ApiService.get<ServiceProvider>(
      API_ENDPOINTS.serviceProviders.getById(providerId)
    );
  }
}