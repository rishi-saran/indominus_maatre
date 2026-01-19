import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface ServicePackage {
  package_id: string;
  name: string;
  description?: string;
  price: number;
  service_id?: string;
  features?: string[];
}

export class ServicePackagesService {
  /**
   * List all service packages
   */
  static async list(params?: { service_id?: string }): Promise<ServicePackage[]> {
    return ApiService.get<ServicePackage[]>(API_ENDPOINTS.servicePackages.list, { params: params });
  }

  /**
   * Get service package by ID
   */
  static async getById(packageId: string): Promise<ServicePackage> {
    return ApiService.get<ServicePackage>(API_ENDPOINTS.servicePackages.getById(packageId));
  }
}
