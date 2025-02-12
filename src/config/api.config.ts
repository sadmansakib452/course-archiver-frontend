export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      refresh: '/auth/refresh',
      logout: '/auth/logout'
    },
    user: {
      profile: '/users/profile'
    }
  },
  cookieNames: {
    auth: 'auth_token',
    refresh: 'refresh_token'
  },
  expiry: {
    auth: 7200, // 2 hours in seconds
    refresh: 604800 // 7 days in seconds
  },
  timeouts: {
    default: 10000, // 10 seconds
    upload: 30000   // 30 seconds
  }
};

export const AUTH_CONFIG = {
  cookieNames: {
    auth: process.env.AUTH_COOKIE_NAME || 'auth_token',
    refresh: process.env.REFRESH_COOKIE_NAME || 'refresh_token'
  },
  expiry: {
    auth: parseInt(process.env.AUTH_TOKEN_EXPIRY || '7200'),
    refresh: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800')
  }
}; 