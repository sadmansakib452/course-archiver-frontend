export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  details?: {
    password?: string;
    [key: string]: string | undefined;
  };
}

export interface PasswordResetErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  details?: {
    password?: string;
    [key: string]: string | undefined;
  };
}

export interface PasswordResetState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
}
