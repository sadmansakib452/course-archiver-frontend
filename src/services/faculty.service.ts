import {
  Faculty,
  FacultyResponse,
  AssignFacultyResponse,
  CreateFacultyInput,
} from "@/types/faculty.types";
import { axiosInstance } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";

class FacultyService {
  async getFaculties(): Promise<Faculty[]> {
    try {
      console.log("Fetching faculty list..."); // Debug log 1
      const response = await axiosInstance.get<Faculty[]>(
        API_CONFIG.endpoints.admin.faculty.list,
      );
      console.log("Faculty API Response:", response.data); // Debug log 2
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch faculty list:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch faculty list",
      );
    }
  }

  async createFaculty(data: CreateFacultyInput): Promise<Faculty> {
    try {
      const response = await axiosInstance.post<Faculty>(
        API_CONFIG.endpoints.admin.faculty.create,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to create faculty:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create faculty",
      );
    }
  }

  async assignFaculty(
    courseId: string,
    facultyId: string,
  ): Promise<AssignFacultyResponse> {
    try {
      const response = await axiosInstance.patch<AssignFacultyResponse>(
        API_CONFIG.endpoints.courses.assignFaculty(courseId),
        { facultyId },
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to assign faculty:", error);
      throw new Error(
        error.response?.data?.message || "Failed to assign faculty",
      );
    }
  }
}

export const facultyService = new FacultyService();
