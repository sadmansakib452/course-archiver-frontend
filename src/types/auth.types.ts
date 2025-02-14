export type UserRole = 'FACULTY' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 900 seconds (15 minutes)
}

// Backend API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
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
  department?: string;
  designation?: string;
}

export interface RegisterResponse {
  message?: string;
  error?: string;
  statusCode?: number;
} 