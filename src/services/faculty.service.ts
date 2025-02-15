import { axiosInstance } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";

interface CreateFacultyRequest {
  email: string;
  name: string;
  shortName: string;
  designation: string;
}

export const facultyService = {
  createFaculty: async (data: CreateFacultyRequest) => {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.endpoints.admin.faculty.create,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to create faculty:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create faculty"
      );
    }
  },
}; 