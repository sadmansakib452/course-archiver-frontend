import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { API_CONFIG } from '@/config/api.config';
import Cookies from 'js-cookie';

class ApiService {
  private static instance: ApiService;
  private api;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  private constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get(API_CONFIG.cookieNames.auth);
        if (token) {
          console.log('ApiService: Adding auth header');
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('ApiService: Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('ApiService: Response received', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      async (error: AxiosError) => {
        console.error('ApiService: Request failed', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        
        if (error.response?.status === 401) {
          const authStore = useAuthStore.getState();
          authStore.clearAuth();
        }
        
        // Enhanced error handling for wrapped responses
        if (error.response?.data) {
          const errorData = error.response.data as ApiResponse<any>;
          if (!errorData.success) {
            throw new Error(errorData.message || 'Request failed');
          }
          throw error.response.data;
        }
        throw error;
      }
    );
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    try {
      console.log('ApiService: Making POST request', { url, data });
      const response = await this.api.post<T>(url, data);
      return response;
    } catch (error: any) {
      console.error('ApiService: POST request failed \n', { url, error });
      
      // Handle array of messages
      if (error.response?.data?.message) {
        const message = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]  // Take first message if array
          : error.response.data.message;
          
        throw new Error(message);
      }
      
      throw error;
    }
  }

  public async get<T>(url: string) {
    try {
      console.log('ApiService: Making GET request', { url });
      const response = await this.api.get<T>(url);
      return response;
    } catch (error: any) {
      console.error('ApiService: GET request failed', { url, error });
      if (error.response) {
        throw new Error(error.response.data.message || 'Request failed');
      }
      throw error;
    }
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
}

export const apiService = ApiService.getInstance(); 