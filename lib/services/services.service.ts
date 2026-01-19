import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface Service {
  service_id: string;
  name: string;
  description?: string;
  category_id?: string;
  price_range?: {
    min: number;
    max: number;
  };
  image_url?: string;
  features?: string[];
}

export class ServicesService {
  /**
   * List all services
   */
  static async list(params?: { category_id?: string }): Promise<Service[]> {
    return ApiService.get<Service[]>(API_ENDPOINTS.services.list, { params: params });
  }

  /**
   * Get service by ID
   */
  static async getById(serviceId: string): Promise<Service> {
    return ApiService.get<Service>(API_ENDPOINTS.services.getById(serviceId));
  }
}
