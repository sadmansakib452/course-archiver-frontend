import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthResponse, RegisterRequest } from "@/types/auth.types";
import { tokenStorage } from "@/utils/storage.utils";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { AUTH_CONFIG } from "@/config/api.config";

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
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: tokenStorage.getAuthToken() || null,
      isAuthenticated: !!tokenStorage.getAuthToken(),
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          const token = tokenStorage.getAuthToken();
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          const profile = await authService.getProfile();

          if (profile) {
            set({
              user: profile,
              accessToken: token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            tokenStorage.clearTokens();
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("AuthStore: Initialize error:", error);
          tokenStorage.clearTokens();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setAuth: (data: AuthResponse) => {
        // Store token in both memory and cookie
        tokenStorage.setAuthToken(data.accessToken);

        // Store in memory
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      },

      clearAuth: () => {
        // Clear tokens
        tokenStorage.clearTokens();

        // Clear memory
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
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

      login: async (email: string, password: string) => {
        console.log("AuthStore: Login attempt");
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ email, password });
          console.log(
            "AuthStore: Login successful, setting auth data",
            response,
          );

          if (!response.accessToken) {
            throw new Error("No access token received");
          }

          // Set auth data
          get().setAuth(response);

          return response;
        } catch (error: any) {
          console.error("AuthStore: Login error", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterRequest) => {
        console.log("AuthStore: Registration attempt");
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);
          console.log("AuthStore: Registration successful");
          return response;
        } catch (error: any) {
          console.error("AuthStore: Registration error", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          get().clearAuth();
        } catch (error) {
          console.error("Logout failed:", error);
          // Still clear auth even if logout fails
          get().clearAuth();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate token on rehydration
        if (state && state.accessToken) {
          const token = tokenStorage.getAuthToken();
          if (!token) {
            state.clearAuth();
          } else {
            state.initialize();
          }
        }
      },
    },
  ),
);
