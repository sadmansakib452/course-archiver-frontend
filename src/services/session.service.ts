import { tokenStorage } from '@/utils/storage.utils';
import { authService } from './auth.service';
import { useAuthStore } from '@/store/auth.store';

class SessionManager {
  private static instance: SessionManager;
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.setupTokenRefresh();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupTokenRefresh() {
    // Check token every minute
    setInterval(() => {
      this.checkTokenExpiry();
    }, 60000);
  }

  private async checkTokenExpiry() {
    const token = tokenStorage.getAuthToken();
    if (!token) return;

    try {
      const tokenData = this.parseToken(token);
      const expiresIn = tokenData.exp * 1000 - Date.now();
      
      // If token expires in less than 5 minutes, refresh it
      if (expiresIn < 300000) {
        await this.refreshToken();
      }
    } catch (error) {
      console.error('Token check failed:', error);
    }
  }

  private parseToken(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  public async refreshToken() {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const response = await authService.refreshToken(refreshToken);
      useAuthStore.getState().setAuth(response);
      
      return response;
    } catch (error) {
      useAuthStore.getState().clearAuth();
      throw error;
    }
  }

  public startSession(expiresIn: number) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Refresh 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  public clearSession() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    tokenStorage.clearTokens();
  }
}

export const sessionManager = SessionManager.getInstance(); 