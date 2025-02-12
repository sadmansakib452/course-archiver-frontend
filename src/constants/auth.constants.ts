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
  FACULTY_NOT_FOUND: 'Faculty member not found. Please contact department admin.'
};

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