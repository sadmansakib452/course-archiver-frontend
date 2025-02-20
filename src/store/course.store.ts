import { create } from "zustand";
import {
  Course,
  CourseFilters,
  CourseTableSort,
  CoursePagination,
  CourseApiResponse,
} from "@/types/course.types";
import { courseService } from "@/services/course.service";

interface CourseState {
  courses: Course[];
  pagination: CoursePagination | null;
  filters: CourseFilters;
  sort: CourseTableSort;
  isLoading: boolean;
  error: string | null;
}

interface CourseActions {
  fetchCourses: (
    filters?: CourseFilters,
    sort?: CourseTableSort,
    pagination?: Partial<CoursePagination>,
  ) => Promise<void>;
  toggleCourseStatus: (courseId: string) => Promise<void>;
  assignFaculty: (courseId: string, facultyId: string) => Promise<void>;
  setFilters: (filters: CourseFilters) => void;
  setSort: (sort: CourseTableSort) => void;
  clearError: () => void;
  reset: () => void;
  deactivateCourse: (courseId: string) => Promise<void>;
  deleteCoursePermantly: (courseId: string) => Promise<void>;
  refreshCourses: () => Promise<void>;
  restoreCourse: (courseId: string) => Promise<void>;
}

const initialState: CourseState = {
  courses: [],
  pagination: null,
  filters: {},
  sort: {
    field: "createdAt",
    direction: "desc",
  },
  isLoading: false,
  error: null,
};

export const useCourseStore = create<CourseState & CourseActions>(
  (set, get) => ({
    ...initialState,

    fetchCourses: async (filters, sort, pagination) => {
      try {
        set({ isLoading: true, error: null });
        const response = await courseService.getCourses(
          filters || get().filters,
          sort || get().sort,
          pagination,
        );
        set({
          courses: response.data.courses,
          pagination: response.data.pagination,
          filters: filters || get().filters,
          sort: sort || get().sort,
        });
      } catch (error: any) {
        set({ error: error.message });
        console.error("Failed to fetch courses:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    toggleCourseStatus: async (courseId: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await courseService.toggleCourseStatus(courseId);

        // Update the course in the state
        const courses = get().courses.map((course) =>
          course.id === courseId ? response.data.courses[0] : course,
        );

        set({ courses });
      } catch (error: any) {
        set({ error: error.message });
        console.error("Failed to toggle course status:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    assignFaculty: async (courseId: string, facultyId: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await courseService.assignFaculty(courseId, facultyId);

        // Update the course in the state
        const courses = get().courses.map((course) =>
          course.id === courseId ? response.data.courses[0] : course,
        );

        set({ courses });
      } catch (error: any) {
        set({ error: error.message });
        console.error("Failed to assign faculty:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    setFilters: (filters: CourseFilters) => {
      set({ filters });
    },

    setSort: (sort: CourseTableSort) => {
      set({ sort });
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      set(initialState);
    },

    deactivateCourse: async (courseId: string) => {
      try {
        set({ isLoading: true, error: null });
        console.log("CourseStore: Attempting deactivate:", courseId);

        await courseService.deactivateCourse(courseId);

        // Refetch courses with current filters to get updated data
        const currentFilters = get().filters;
        const currentSort = get().sort;
        const currentPagination = get().pagination;

        await get().fetchCourses(
          currentFilters,
          currentSort,
          currentPagination
            ? {
                page: currentPagination.page,
                limit: currentPagination.limit,
              }
            : undefined,
        );

        console.log("CourseStore: Deactivation successful and data refreshed");
      } catch (error: any) {
        console.error("CourseStore: Deactivation failed:", error);
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteCoursePermantly: async (courseId: string) => {
      try {
        set({ isLoading: true, error: null });
        console.log("CourseStore: Attempting permanent delete:", courseId);

        await courseService.deleteCoursePermantly(courseId);

        // Refetch courses with current filters to get updated data
        const currentFilters = get().filters;
        const currentSort = get().sort;
        const currentPagination = get().pagination;

        await get().fetchCourses(
          currentFilters,
          currentSort,
          currentPagination
            ? {
                page: currentPagination.page,
                limit: currentPagination.limit,
              }
            : undefined,
        );

        console.log("CourseStore: Delete successful and data refreshed");
      } catch (error: any) {
        console.error("CourseStore: Delete failed:", error);
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    // Helper function to refresh courses
    refreshCourses: async () => {
      const { filters, sort, pagination } = get();
      await get().fetchCourses(
        filters,
        sort,
        pagination
          ? {
              page: pagination.page,
              limit: pagination.limit,
            }
          : undefined,
      );
    },

    restoreCourse: async (courseId: string) => {
      try {
        set({ isLoading: true, error: null });
        console.log("CourseStore: Attempting restore:", courseId);

        await courseService.restoreCourse(courseId);

        // Refetch courses with current filters
        const { filters, sort, pagination } = get();
        await get().fetchCourses(
          filters,
          sort,
          pagination
            ? {
                page: pagination.page,
                limit: pagination.limit,
              }
            : undefined,
        );

        console.log("CourseStore: Restore successful and data refreshed");
      } catch (error: any) {
        console.error("CourseStore: Restore failed:", error);
        set({ error: error.message });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  }),
);
