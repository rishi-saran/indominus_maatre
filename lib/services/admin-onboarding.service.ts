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
  password: string;
  retype_password: string;
}

export class AdminOnboardingService {
  static async create(payload: CreateAdminOnboardingRequestPayload) {
    return ApiService.post<AdminOnboardingRequest>(
      'http://localhost:8000/api/v1/admin/onboarding-requests/',
      payload
    );
  }

  static async list(): Promise<AdminOnboardingRequest[]> {
    return ApiService.get<AdminOnboardingRequest[]>(
      'http://localhost:8000/api/v1/admin/onboarding-requests/'
    );
  }

  static async approve(requestId: string) {
    return ApiService.post(
      `http://localhost:8000/api/v1/admin/onboarding-requests/${requestId}/approve`
    );
  }

  static async reject(requestId: string) {
    return ApiService.post(
      `http://localhost:8000/api/v1/admin/onboarding-requests/${requestId}/reject`
    );
  }
}
