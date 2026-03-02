import { ApiService } from '@/lib/services/api.service';

export interface AdminPriest {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  is_active?: boolean;
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
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.get<AdminPriestListResponse>(
      `${API_BASE}/admin/priests/`,
      { params }
    );
  }


  static async getById(id: string): Promise<AdminPriest> {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.get<AdminPriest>(`${API_BASE}/admin/priests/${id}`);
  }


  static async create(data: Partial<AdminPriest>): Promise<AdminPriest> {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.post<AdminPriest>(`${API_BASE}/admin/priests/`, data);
  }


  static async update(id: string, data: Partial<AdminPriest>): Promise<AdminPriest> {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.put<AdminPriest>(`${API_BASE}/admin/priests/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.delete<void>(`${API_BASE}/admin/priests/${id}`);
  }
}
