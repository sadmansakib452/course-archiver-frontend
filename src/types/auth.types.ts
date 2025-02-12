export type UserRole = 'FACULTY' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 900 seconds (15 minutes)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message?: string;
  error?: string;
  statusCode?: number;
} 