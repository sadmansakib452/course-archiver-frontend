import { apiService } from "./api.service";
import { sessionManager } from "./session.service";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from "@/types/auth.types";
import { API_CONFIG } from "@/config/api.config";
import { AUTH_MESSAGES } from "@/constants/auth.constants";
import Cookies from "js-cookie";
import { axiosInstance } from "@/lib/axios";
import { tokenStorage } from "@/utils/storage.utils";
import {
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse,
} from "@/types/password-reset.types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log(
        "AuthService: Attempting login with URL:",
        API_CONFIG.endpoints.auth.login,
      );

      const response = await apiService.post<AuthResponse>(
        API_CONFIG.endpoints.auth.login,
        credentials,
      );

      console.log("AuthService: Login response:", response.data);

      if (!response.data.accessToken || !response.data.user) {
        console.error(
          "AuthService: Invalid login response format",
          response.data,
        );
        throw new Error(AUTH_MESSAGES.LOGIN_FAILED);
      }

      const authData = response.data;

      // Store tokens
      Cookies.set(API_CONFIG.cookieNames.auth, authData.accessToken, {
        expires: authData.expiresIn / (24 * 60 * 60),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      if (authData.refreshToken) {
        Cookies.set(API_CONFIG.cookieNames.refresh, authData.refreshToken, {
          expires: API_CONFIG.expiry.refresh / (24 * 60 * 60),
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }

      return authData;
    } catch (error: any) {
      console.error("AuthService: Login failed:", error.response || error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      console.log("AuthService: Attempting registration...", {
        email: data.email,
      });

      const response = await apiService.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      );

      console.log("AuthService: Registration response:", response.data);

      if (!response.data) {
        console.error("AuthService: Invalid registration response format");
        throw new Error(AUTH_MESSAGES.REGISTRATION_FAILED);
      }

      return response.data;
    } catch (error: any) {
      console.error("AuthService: Registration failed:", error);
      // Pass through the exact error message
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await apiService.post(API_CONFIG.endpoints.auth.logout);
  },

  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.endpoints.auth.refresh,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || AUTH_MESSAGES.SESSION_EXPIRED,
      );
    }
  },

  getProfile: async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get<ApiResponse<User>>(
        API_CONFIG.endpoints.users.profile,
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Failed to get profile:", error);
      return null;
    }
  },

  requestPasswordReset: async (
    email: string,
  ): Promise<PasswordResetResponse> => {
    try {
      const response = await apiService.post<PasswordResetResponse>(
        API_CONFIG.endpoints.auth.passwordReset.request,
        { email },
      );
      return response.data;
    } catch (error: any) {
      console.error("Password reset request failed:", error);
      throw new Error(
        error.response?.data?.message ||
          AUTH_MESSAGES.PASSWORD_RESET.REQUEST_FAILED,
      );
    }
  },

  resetPassword: async (
    data: PasswordResetConfirm,
  ): Promise<PasswordResetResponse> => {
    try {
      const response = await apiService.post<PasswordResetResponse>(
        API_CONFIG.endpoints.auth.passwordReset.reset,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Password reset failed:", error);
      throw new Error(
        error.response?.data?.message ||
          AUTH_MESSAGES.PASSWORD_RESET.RESET_FAILED,
      );
    }
  },

  validateResetToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiService.post<{ success: boolean }>(
        API_CONFIG.endpoints.auth.passwordReset.validate,
        { token },
      );
      return response.data.success;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  },
};
