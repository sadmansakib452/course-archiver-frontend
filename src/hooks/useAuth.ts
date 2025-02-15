"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes.constants';
import type { RegisterRequest } from '@/types/auth.types';

export const useAuth = () => {
  const router = useRouter();
  const { 
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    login: storeLogin,
    register: storeRegister,
    clearAuth 
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (email: string, password: string) => {
    try {
      await storeLogin(email, password);
      router.replace(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      console.error('useAuth: Login failed', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await storeRegister(data);
      router.push(ROUTES.AUTH.SIGNIN);
    } catch (error: any) {
      console.error('useAuth: Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearAuth();
      router.replace(ROUTES.AUTH.SIGNIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register
  };
}; 