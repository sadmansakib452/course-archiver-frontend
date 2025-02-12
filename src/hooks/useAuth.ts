"use client";
import { useCallback } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes.constants';
import type { RegisterRequest } from '@/types/auth.types';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    accessToken,
    isAuthenticated, 
    isLoading, 
    error,
    login: storeLogin,
    register: storeRegister,
    clearAuth 
  } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await storeLogin(email, password);
      router.replace(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      console.error('useAuth: Login failed', error);
      throw error;
    }
  }, [storeLogin, router]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      console.log('useAuth: Registration attempt');
      await storeRegister(data);
      console.log('useAuth: Registration successful');
      router.push(ROUTES.AUTH.SIGNIN);
    } catch (error: any) {
      console.error('useAuth: Registration failed', error);
      throw error;
    }
  }, [storeRegister, router]);

  const logout = useCallback(async () => {
    try {
      clearAuth();
      router.replace(ROUTES.AUTH.SIGNIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [clearAuth, router]);

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
} 