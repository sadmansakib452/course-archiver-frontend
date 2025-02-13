import { axiosInstance } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";

interface CreateAdminInput {
  email: string;
  name: string;
  temporaryPassword: string;
  departmentCode: string;
}

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export const adminService = {
  createAdmin: async (data: CreateAdminInput) => {
    try {
      const response = await axiosInstance.post(API_CONFIG.endpoints.admin.create, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const apiError = error.response.data as ApiError;
        // Enhanced error handling
        if (apiError.statusCode === 409) {
          throw {
            ...apiError,
            field: 'email', // Specify which field caused the conflict
          };
        }
        throw apiError;
      }
      throw new Error('Something went wrong');
    }
  }
}; 