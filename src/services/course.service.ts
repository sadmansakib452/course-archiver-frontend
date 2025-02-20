import { axiosInstance } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";
import {
  Course,
  CourseApiResponse,
  CourseFilters,
  CourseTableSort,
  CoursePagination,
} from "@/types/course.types";

interface DeleteResponse {
  success: boolean;
  message: string;
}

class CourseService {
  async getCourses(
    filters?: CourseFilters,
    sort?: CourseTableSort,
    pagination?: Partial<CoursePagination>,
  ): Promise<CourseApiResponse> {
    try {
      const params = new URLSearchParams();

      // Add filters including search
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      // Add sorting
      if (sort) {
        params.append("sortBy", sort.field);
        params.append("sortDirection", sort.direction);
      }

      // Add pagination
      if (pagination) {
        if (pagination.page) params.append("page", pagination.page.toString());
        if (pagination.limit)
          params.append("limit", pagination.limit.toString());
      }

      const response = await axiosInstance.get<CourseApiResponse>(
        `${API_CONFIG.endpoints.courses.list}${params.toString() ? `?${params.toString()}` : ""}`,
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch courses:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch courses",
      );
    }
  }

  async toggleCourseStatus(courseId: string): Promise<CourseApiResponse> {
    try {
      const response = await axiosInstance.patch<CourseApiResponse>(
        API_CONFIG.endpoints.courses.toggleStatus(courseId),
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to toggle course status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update course status",
      );
    }
  }

  async assignFaculty(
    courseId: string,
    facultyId: string,
  ): Promise<CourseApiResponse> {
    try {
      const response = await axiosInstance.patch<CourseApiResponse>(
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

  async deactivateCourse(courseId: string): Promise<void> {
    try {
      const response = await axiosInstance.patch(
        API_CONFIG.endpoints.courses.toggleStatus(courseId),
        { isActive: false },
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to deactivate course:", error);
      throw new Error(
        error.response?.data?.message || "Failed to deactivate course",
      );
    }
  }

  async deleteCoursePermantly(courseId: string): Promise<DeleteResponse> {
    try {
      console.log("CourseService: Attempting permanent delete:", courseId);
      const response = await axiosInstance.delete<DeleteResponse>(
        API_CONFIG.endpoints.courses.permanentDelete(courseId),
      );
      console.log("CourseService: Delete response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "CourseService: Delete failed:",
        error.response?.data || error,
      );
      throw new Error(
        error.response?.data?.message || "Failed to permanently delete course",
      );
    }
  }

  async restoreCourse(courseId: string): Promise<CourseApiResponse> {
    try {
      console.log("CourseService: Attempting restore:", courseId);
      const response = await axiosInstance.patch<CourseApiResponse>(
        API_CONFIG.endpoints.courses.toggleStatus(courseId),
        { isActive: true },
      );
      console.log("CourseService: Restore response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "CourseService: Restore failed:",
        error.response?.data || error,
      );
      throw new Error(
        error.response?.data?.message || "Failed to restore course",
      );
    }
  }

  async getCourseById(courseId: string): Promise<CourseApiResponse> {
    try {
      const response = await axiosInstance.get<CourseApiResponse>(
        API_CONFIG.endpoints.courses.update(courseId),
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch course:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch course",
      );
    }
  }
}

// Export a single instance
export const courseService = new CourseService();
