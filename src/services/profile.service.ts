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
      console.log('Making update profile request with:', data); // Debug log
      const response = await apiService.patch<ProfileResponse>(
        API_CONFIG.endpoints.users.profile,
        data
      );
      console.log('Update profile response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error.response || error); // Debug log
      
      // Handle specific error cases
      if (error.response?.status === 422) {
        throw new Error(error.response.data.details?.password || error.response.data.message);
      }
      if (error.response?.status === 401) {
        throw new Error("Current password is incorrect");
      }
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  },
}; 