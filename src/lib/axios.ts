import axios from "axios";
import { API_CONFIG } from "@/config/api.config";

// Create axios instance with proper baseURL
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL, // Using the config value
  timeout: API_CONFIG.timeouts.default,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies instead of localStorage for SSR compatibility
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith(API_CONFIG.cookieNames.auth))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      document.cookie = `${API_CONFIG.cookieNames.auth}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
); 