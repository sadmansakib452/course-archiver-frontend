import { apiService } from "./api.service";
import {
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse,
  PasswordResetErrorResponse,
} from "@/types/password-reset.types";
import { API_CONFIG } from "@/config/api.config";
import { AUTH_MESSAGES } from "@/constants/auth.constants";
import { EMAIL_VALIDATION } from "@/constants/validation.constants";
import { validateResetRequest } from "@/utils/validation.utils";
import { handleResetPasswordError } from "@/utils/error.utils";

export const passwordResetService = {
  requestReset: async (email: string): Promise<PasswordResetResponse> => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!EMAIL_VALIDATION.PATTERN.test(sanitizedEmail)) {
      throw new Error(EMAIL_VALIDATION.ERROR_MESSAGES.INVALID);
    }

    try {
      console.log("Requesting password reset for:", sanitizedEmail);

      const response = await apiService.post<PasswordResetResponse>(
        API_CONFIG.endpoints.auth.passwordReset.request,
        { email: sanitizedEmail },
      );

      console.log("Password reset response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("Password reset request failed:", error);
      throw new Error(handleResetPasswordError(error));
    }
  },

  resetPassword: async ({
    token,
    newPassword,
  }: PasswordResetConfirm): Promise<PasswordResetResponse> => {
    try {
      console.log("Step 7: Service making API call", {
        tokenLength: token.length,
        passwordLength: newPassword.length,
      });

      const response = await apiService.post<PasswordResetResponse>(
        API_CONFIG.endpoints.auth.passwordReset.reset,
        { token, newPassword },
      );

      console.log("Step 8: API response received", {
        success: response.data.success,
        statusCode: response.data.statusCode,
        hasDetails: !!response.data.details,
      });

      return response.data;
    } catch (error: any) {
      console.log("Step 9: API call failed", {
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response?.data) {
        const errorData = error.response.data as PasswordResetErrorResponse;
        throw {
          statusCode: errorData.statusCode,
          message: errorData.message,
          details: errorData.details,
        };
      }
      throw new Error(AUTH_MESSAGES.PASSWORD_RESET.RESET_FAILED);
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      console.log("Validating token with API:", token);
      const response = await apiService.post<{ success: boolean }>(
        API_CONFIG.endpoints.auth.passwordReset.validate,
        { token },
      );
      console.log("Validation response:", response.data);
      return response.data.success;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },
};
