import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface ServiceProvider {
  provider_id: string;
  name: string;
  description?: string;
  rating?: number;
  experience_years?: number;
  specialization?: string[];
}

export class ServiceProvidersService {
  /**
   * List all service providers
   */
  static async list(params?: { service_id?: string }): Promise<ServiceProvider[]> {
    return ApiService.get<ServiceProvider[]>(API_ENDPOINTS.serviceProviders.list, { params: params });
  }

  /**
   * Get service provider by ID
   */
  static async getById(providerId: string): Promise<ServiceProvider> {
    return ApiService.get<ServiceProvider>(API_ENDPOINTS.serviceProviders.getById(providerId));
  }
}
