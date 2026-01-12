import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/lib/types/auth';

const API_BASE_URL = '/api';

export class AuthService {
  /**
   * Login user with email
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed: Unable to connect to server');
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed: Unable to connect to server');
    }
  }
}
