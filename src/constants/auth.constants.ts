export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  LOGIN_FAILED: 'Unable to log in. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  REGISTRATION_SUCCESS: 'Registration successful! Please login to continue.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'You have been successfully logged out.',
  INVALID_TOKEN: 'Invalid or expired token',
  SERVER_ERROR: 'Server error. Please try again later.',
  FACULTY_NOT_FOUND: 'Faculty member not found. Please contact department admin.',
  PASSWORD_RESET: {
    REQUEST_SUCCESS: "Password reset instructions sent to your email.",
    REQUEST_FAILED: "Failed to send reset instructions. Please try again.",
    RESET_SUCCESS: "Password has been successfully reset.",
    RESET_FAILED: "Failed to reset password. Please try again.",
    INVALID_TOKEN: "Invalid or expired reset token.",
    EMAIL_REQUIRED: "Please enter your email address.",
    PASSWORD_MISMATCH: "Passwords do not match.",
    PASSWORD_REQUIREMENTS: "Password must be at least 8 characters with 1 uppercase, 1 number",
    TOKEN_EXPIRED: "Reset token has expired. Please request a new one.",
    NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
    EXPIRED_TOKEN: "This reset link has expired. Please request a new one.",
    INVALID_REQUEST: "Invalid request. Please try again.",
  },
} as const;

export const ROUTES = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  DASHBOARD: {
    HOME: '/dashboard',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings'
  }
}; 