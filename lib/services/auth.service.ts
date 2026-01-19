import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/lib/types/auth';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

export class AuthService {
  /**
   * Login user with email
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>(API_ENDPOINTS.auth.login, {
      email,
      password,
    } as LoginRequest);
  }

  /**
   * Register new user
   */
  static async signup(data: RegisterRequest): Promise<RegisterResponse> {
    return ApiService.post<RegisterResponse>(API_ENDPOINTS.auth.signup, data);
  }

  /**
   * Refresh authentication token
   */
  static async refresh(): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>(API_ENDPOINTS.auth.refresh);
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{ success: boolean }> {
    return ApiService.post<{ success: boolean }>(API_ENDPOINTS.auth.logout);
  }
}
