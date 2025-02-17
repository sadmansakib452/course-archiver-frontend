import { apiService } from "./api.service";
import { API_CONFIG } from "@/config/api.config";
import { ProfileResponse, UpdateProfileRequest } from "@/types/profile.types";

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiService.get<ProfileResponse>(
      API_CONFIG.endpoints.users.profile
    );
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    try {
      console.log('Making update profile request with:', data);
      const response = await apiService.patch<ProfileResponse>(
        API_CONFIG.endpoints.users.profile,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      // Handle API error response
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to update profile');
      }
      
      throw error;
    }
  },
}; 