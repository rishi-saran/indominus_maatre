import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface ServiceCategory {
  category_id: string;
  name: string;
  description?: string;
  icon?: string;
}

export class ServiceCategoriesService {
  /**
   * List all service categories
   */
  static async list(): Promise<ServiceCategory[]> {
    return ApiService.get<ServiceCategory[]>(API_ENDPOINTS.serviceCategories.list);
  }
}
