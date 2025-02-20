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
  }),
);
