import { axiosInstance } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";
import { 
  Course, 
  CourseApiResponse, 
  CourseFilters,
  CourseTableSort,
  CoursePagination 
} from "@/types/course.types";

class CourseService {
  async getCourses(
    filters?: CourseFilters,
    sort?: CourseTableSort,
    pagination?: Partial<CoursePagination>
  ): Promise<CourseApiResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      // Add sorting
      if (sort) {
        params.append('sortBy', sort.field);
        params.append('sortDirection', sort.direction);
      }

      // Add pagination
      if (pagination) {
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());
      }

      const response = await axiosInstance.get<CourseApiResponse>(
        `${API_CONFIG.endpoints.courses.list}${params.toString() ? `?${params.toString()}` : ''}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  }

  async toggleCourseStatus(courseId: string): Promise<CourseApiResponse> {
    try {
      const response = await axiosInstance.patch<CourseApiResponse>(
        API_CONFIG.endpoints.courses.toggleStatus(courseId)
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to toggle course status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update course status');
    }
  }

  async assignFaculty(courseId: string, facultyId: string): Promise<CourseApiResponse> {
    try {
      const response = await axiosInstance.patch<CourseApiResponse>(
        API_CONFIG.endpoints.courses.assignFaculty(courseId),
        { facultyId }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to assign faculty:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign faculty');
    }
  }
}

// Export a single instance
export const courseService = new CourseService(); 