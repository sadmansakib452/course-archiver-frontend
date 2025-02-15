"use client";
import axios from "axios";
import { API_CONFIG } from "@/config/api.config";
import { tokenStorage } from "@/utils/storage.utils";
import { useRouter } from "next/navigation";

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
      // Use Next.js router instead of window.location
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
); 