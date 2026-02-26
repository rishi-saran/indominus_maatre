import { ApiService } from '@/lib/services/api.service';

export interface AdminPriest {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  rating: number;
  specialty: string;
  experience: string;
  created_at?: string;
  total_bookings?: number;
}

export interface AdminPriestListResponse {
  priests: AdminPriest[];
  total: number;
}


export class AdminPriestsService {
  static async list(params?: { limit?: number; offset?: number; search?: string; status?: string; location?: string }): Promise<AdminPriestListResponse> {
    return ApiService.get<AdminPriestListResponse>(
      'http://localhost:8000/api/v1/admin/priests/',
      { params }
    );
  }


  static async getById(id: string): Promise<AdminPriest> {
    return ApiService.get<AdminPriest>(`http://localhost:8000/api/v1/admin/priests/${id}`);
  }


  static async create(data: Partial<AdminPriest>): Promise<AdminPriest> {
    return ApiService.post<AdminPriest>('http://localhost:8000/api/v1/admin/priests/', data);
  }


  static async update(id: string, data: Partial<AdminPriest>): Promise<AdminPriest> {
    return ApiService.post<AdminPriest>(`http://localhost:8000/api/v1/admin/priests/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return ApiService.delete<void>(`http://localhost:8000/api/v1/admin/priests/${id}`);
  }
}
