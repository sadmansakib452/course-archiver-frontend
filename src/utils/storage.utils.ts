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

class TokenStorage {
  getAuthToken(): string | undefined {
    return Cookies.get(AUTH_CONFIG.cookieNames.auth);
  }

  getRefreshToken(): string | undefined {
    return Cookies.get(AUTH_CONFIG.cookieNames.refresh);
  }

  setAuthToken(token: string): void {
    Cookies.set(AUTH_CONFIG.cookieNames.auth, token, {
      ...defaultOptions,
      expires: AUTH_CONFIG.expiry.auth / (24 * 60 * 60),
      sameSite: 'lax' // Changed for better compatibility
    });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAuthToken(accessToken);
    Cookies.set(AUTH_CONFIG.cookieNames.refresh, refreshToken, {
      ...defaultOptions,
      expires: AUTH_CONFIG.expiry.refresh / (24 * 60 * 60)
    });
  }

  clearTokens(): void {
    Cookies.remove(AUTH_CONFIG.cookieNames.auth, { path: '/' });
    Cookies.remove(AUTH_CONFIG.cookieNames.refresh, { path: '/' });
  }
}

// Export a single instance
export const tokenStorage = new TokenStorage(); 