"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { passwordResetService } from "@/services/password-reset.service";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "react-hot-toast";
import { AUTH_MESSAGES } from "@/constants/auth.constants";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    details?: Record<string, string>;
  } | null>(null);
  const router = useRouter();

  const requestReset = async (email: string) => {
    setLoading(true);
    try {
      const response = await passwordResetService.requestReset(email);
      return response;
    } catch (error) {
      console.error("Password reset hook error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      console.log("Step 3: Password reset hook called", {
        tokenLength: token.length,
        passwordLength: newPassword.length,
      });

      setLoading(true);
      setError(null);

      console.log("Step 4: Calling password reset service");
      const response = await passwordResetService.resetPassword({
        token,
        newPassword,
      });

      console.log("Step 5: Service response received", {
        success: response.success,
        statusCode: response.statusCode,
        hasDetails: !!response.details,
      });

      if (response.success) {
        console.log("Step 6a: Reset successful, redirecting to login");
        toast.success(
          response.message || AUTH_MESSAGES.PASSWORD_RESET.RESET_SUCCESS,
        );
        router.push(ROUTES.AUTH.SIGNIN);
      } else {
        console.log("Step 6b: Reset failed with validation errors", response);
        const errorMessage = response.details?.password || response.message;
        setError({
          message: errorMessage,
          details: response.details as Record<string, string>,
        });
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.log("Step 6c: Reset failed with error", err);
      const errorMessage =
        err.details?.password ||
        err.message ||
        AUTH_MESSAGES.PASSWORD_RESET.RESET_FAILED;
      setError({
        message: errorMessage,
        details: err.details as Record<string, string>,
      });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    requestReset,
    resetPassword,
  };
};
