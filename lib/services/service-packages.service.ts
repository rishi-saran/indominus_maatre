// lib/services/service-packages.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface ServicePackage {
  id: string;
  service_id: string;
  name: string;
  price: number;
  description: string | null;
}

/* =======================
   Service Packages API
======================= */

export class ServicePackagesService {
  /**
   * List all service packages
   */
  static async list(params?: { service_id?: string }): Promise<ServicePackage[]> {
    return ApiService.get<ServicePackage[]>(
      API_ENDPOINTS.servicePackages.list,
      { params }
    );
  }

  /**
   * Get service package by ID
   */
  static async getById(packageId: string): Promise<ServicePackage> {
    return ApiService.get<ServicePackage>(
      API_ENDPOINTS.servicePackages.getById(packageId)
    );
  }
}