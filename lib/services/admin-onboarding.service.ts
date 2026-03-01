import { ApiService } from './api.service';

export interface AdminOnboardingRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface CreateAdminOnboardingRequestPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  retype_password?: string;
  plain_password: string;
}

export class AdminOnboardingService {
  static async create(payload: CreateAdminOnboardingRequestPayload) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.post<AdminOnboardingRequest>(
      `${API_BASE}/admin/onboarding-requests/`,
      payload
    );
  }

  static async list(): Promise<AdminOnboardingRequest[]> {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.get<AdminOnboardingRequest[]>(
      `${API_BASE}/admin/onboarding-requests/`
    );
  }

  static async approve(requestId: string) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.post(
      `${API_BASE}/admin/onboarding-requests/${requestId}/approve`
    );
  }

  static async reject(requestId: string) {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return ApiService.post(
      `${API_BASE}/admin/onboarding-requests/${requestId}/reject`
    );
  }
}
