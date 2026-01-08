// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  email: string;
  is_new_user: boolean;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
}

export interface AuthError {
  error: string;
}
