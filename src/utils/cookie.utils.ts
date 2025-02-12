import Cookies from 'js-cookie';
import { AUTH_CONFIG } from '@/config/api.config';

interface CookieOptions {
  expires?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

const defaultOptions: CookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
};

export const cookieUtils = {
  setAuthTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(AUTH_CONFIG.cookieNames.auth, accessToken, {
      ...defaultOptions,
      expires: AUTH_CONFIG.expiry.auth / (24 * 60 * 60) // Convert seconds to days
    });

    Cookies.set(AUTH_CONFIG.cookieNames.refresh, refreshToken, {
      ...defaultOptions,
      expires: AUTH_CONFIG.expiry.refresh / (24 * 60 * 60)
    });
  },

  getAuthToken: () => {
    return Cookies.get(AUTH_CONFIG.cookieNames.auth);
  },

  getRefreshToken: () => {
    return Cookies.get(AUTH_CONFIG.cookieNames.refresh);
  },

  clearAuthTokens: () => {
    Cookies.remove(AUTH_CONFIG.cookieNames.auth, { path: '/' });
    Cookies.remove(AUTH_CONFIG.cookieNames.refresh, { path: '/' });
  }
}; 