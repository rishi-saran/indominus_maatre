import { ApiService } from '@/lib/services/api.service';

const BASE = () => `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/users`;

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  role: string;
  created_at?: string;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
}

export interface CreateAdminUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  plain_password: string;
}

export class AdminUsersService {
  static async list(params?: { limit?: number; offset?: number }): Promise<AdminUserListResponse> {
    return ApiService.get<AdminUserListResponse>(`${BASE()}/`, { params });
  }

  static async create(data: CreateAdminUserPayload): Promise<AdminUser> {
    return ApiService.post<AdminUser>(`${BASE()}/`, data);
  }

  static async update(id: string, data: Partial<Omit<AdminUser, 'id' | 'role' | 'created_at'>>): Promise<AdminUser> {
    return ApiService.put<AdminUser>(`${BASE()}/${id}`, data);
  }

  static async delete(id: string): Promise<{ message: string }> {
    return ApiService.delete<{ message: string }>(`${BASE()}/${id}`);
  }
}
