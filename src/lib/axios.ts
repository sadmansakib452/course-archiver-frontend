"use client";
import axios from "axios";
import { API_CONFIG } from "@/config/api.config";
import { tokenStorage } from "@/utils/storage.utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

// Create axios instance with proper baseURL
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL, // Using the config value
  timeout: API_CONFIG.timeouts.default,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      tokenStorage.clearTokens();
      
      // Use window.location only on client side
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        // Only redirect if not already on auth page
        if (!currentPath.startsWith('/auth')) {
          window.location.href = ROUTES.AUTH.SIGNIN;
        }
      }
    }
    return Promise.reject(error);
  }
); 