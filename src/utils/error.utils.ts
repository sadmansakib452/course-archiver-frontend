import { AUTH_MESSAGES } from "@/constants/auth.constants";

export const handleAuthError = (error: unknown): string => {
  // Error handling implementation
};

export const handleResetPasswordError = (error: any): string => {
  if (!navigator.onLine) {
    return AUTH_MESSAGES.PASSWORD_RESET.NETWORK_ERROR;
  }

  if (error.response) {
    // Handle specific API errors
    switch (error.response.status) {
      case 400:
        return error.response.data.message || AUTH_MESSAGES.PASSWORD_RESET.INVALID_REQUEST;
      case 401:
        return AUTH_MESSAGES.PASSWORD_RESET.EXPIRED_TOKEN;
      case 500:
        return AUTH_MESSAGES.PASSWORD_RESET.SERVER_ERROR;
      default:
        return error.response.data.message || AUTH_MESSAGES.PASSWORD_RESET.REQUEST_FAILED;
    }
  }

  return AUTH_MESSAGES.PASSWORD_RESET.REQUEST_FAILED;
}; 