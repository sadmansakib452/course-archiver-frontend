import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthResponse, RegisterRequest } from '@/types/auth.types';
import { tokenStorage } from '@/utils/storage.utils';
import { authService } from '@/services/auth.service';
import Cookies from 'js-cookie';
import { AUTH_CONFIG } from '@/config/api.config';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const useAuthStore = create<AuthState & AuthActions & {
  login: (email: string, password: string) => Promise<void>;
}>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (data: AuthResponse) => {
        console.log('AuthStore: Setting auth data', { user: data.user });
        
        // Store token in both memory and cookie
        Cookies.set(AUTH_CONFIG.cookieNames.auth, data.accessToken, {
          expires: AUTH_CONFIG.expiry.auth / (24 * 60 * 60),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });

        // Store in memory
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          error: null
        });

        // Store user in localStorage for persistence
        localStorage.setItem('auth-user', JSON.stringify(data.user));
      },

      clearAuth: () => {
        console.log('AuthStore: Clearing auth data');
        
        // Clear cookies
        Cookies.remove(AUTH_CONFIG.cookieNames.auth);
        
        // Clear memory
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null
        });
      },

      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();
          get().setAuth(response);
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },

      initialize: async () => {
        try {
          // Check both cookie and memory token
          const cookieToken = Cookies.get(AUTH_CONFIG.cookieNames.auth);
          const memoryToken = get().accessToken;
          const token = cookieToken || memoryToken;

          console.log('AuthStore: Initializing with token:', !!token);

          if (!token) {
            set({ isLoading: false });
            return;
          }

          // Set token in memory if only in cookie
          if (cookieToken && !memoryToken) {
            set({ accessToken: cookieToken });
          }

          const response = await authService.getProfile();
          if (response) {
            set({ 
              user: response, 
              isAuthenticated: true,
              accessToken: token
            });
          }
        } catch (error: any) {
          console.error('AuthStore: Initialize error:', error);
          if (error.response?.status === 401) {
            get().clearAuth();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        console.log('AuthStore: Login attempt');
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ email, password });
          console.log('AuthStore: Login successful, setting auth data', response);
          
          if (!response.accessToken) {
            throw new Error('No access token received');
          }

          // Set auth data
          get().setAuth(response);
          
          // Verify the state was updated
          const state = get();
          console.log('AuthStore: State after login', {
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            hasToken: !!state.accessToken
          });
          
          return response;
        } catch (error: any) {
          console.error('AuthStore: Login error', error);
          // Pass through the exact error message
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterRequest) => {
        console.log('AuthStore: Registration attempt');
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);
          console.log('AuthStore: Registration successful');
          return response;
        } catch (error: any) {
          console.error('AuthStore: Registration error', error);
          // Pass through the exact error message
          throw error;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // Validate token on rehydration
        if (state) {
          state.initialize();
        }
      }
    }
  )
); 