import { create } from "zustand";
import {
  Course,
  CourseFilters,
  CourseTableSort,
  CoursePagination,
  CourseApiResponse,
  CourseSearchState,
  PaginationState,
} from "@/types/course.types";
import { courseService } from "@/services/course.service";
import { debounce } from "lodash";

interface CourseState {
  courses: Course[];
  pagination: PaginationState;
  filters: CourseFilters;
  sort: CourseTableSort;
  search: CourseSearchState;
  isLoading: boolean;
  error: string | null;
  loading: {
    table: boolean;
    filters: boolean;
    actions: boolean;
  };
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
  setSearchTerm: (searchTerm: string) => void;
  handleSearch: (searchTerm: string) => Promise<void>;
  clearSearch: () => void;
  setTableLoading: (loading: boolean) => void;
  setFilterLoading: (loading: boolean) => void;
  setActionLoading: (loading: boolean) => void;
}

const initialState: CourseState = {
  courses: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  },
  filters: {},
  sort: {
    field: "createdAt",
    direction: "desc",
  },
  search: {
    searchTerm: "",
    isSearching: false,
  },
  isLoading: false,
  error: null,
  loading: {
    table: false,
    filters: false,
    actions: false,
  },
};

// Update the type for set and get
const handleSearchImpl =
  (
    set: (
      state: Partial<CourseState> | ((state: CourseState) => CourseState),
    ) => void,
    get: () => CourseState & CourseActions,
  ) =>
  async (searchTerm: string): Promise<void> => {
    try {
      set((state: CourseState) => ({
        ...state,
        search: {
          ...state.search,
          isSearching: true,
        },
      }));

      const currentFilters = get().filters;
      const updatedFilters = {
        ...currentFilters,
        search: searchTerm || undefined,
        page: 1,
      };

      await get().fetchCourses(updatedFilters);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      set((state: CourseState) => ({
        ...state,
        search: {
          ...state.search,
          isSearching: false,
        },
      }));
    }
  };

export const useCourseStore = create<CourseState & CourseActions>(
  (set, get) => ({
    ...initialState,

    fetchCourses: async (filters, sort, pagination) => {
      try {
        set((state) => ({
          loading: {
            ...state.loading,
            table: true,
            filters: false,
          },
        }));
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
        set((state) => ({
          loading: {
            ...state.loading,
            table: false,
          },
        }));
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
        set((state) => ({
          loading: {
            ...state.loading,
            actions: true,
          },
        }));

        const response = await courseService.assignFaculty(courseId, facultyId);

        // Optimistic update - update the course in state immediately
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  faculty: response.data.faculty,
                  facultyId: response.data.facultyId,
                }
              : course,
          ),
          loading: {
            ...state.loading,
            actions: false,
          },
        }));

        return response;
      } catch (error: any) {
        set((state) => ({
          error: error.message,
          loading: {
            ...state.loading,
            actions: false,
          },
        }));
        throw error;
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
        set((state) => ({
          loading: {
            ...state.loading,
            table: true,
            actions: true,
          },
        }));

        await courseService.restoreCourse(courseId);

        // Refetch only table data
        const { filters, sort, pagination } = get();
        const response = await courseService.getCourses(
          filters,
          sort,
          pagination,
        );

        set((state) => ({
          courses: response.data.courses,
          pagination: response.data.pagination,
          loading: {
            ...state.loading,
            table: false,
            actions: false,
          },
        }));
      } catch (error: any) {
        set((state) => ({
          error: error.message,
          loading: {
            ...state.loading,
            table: false,
            actions: false,
          },
        }));
        throw error;
      }
    },

    setSearchTerm: (searchTerm: string) => {
      set((state) => ({
        search: {
          ...state.search,
          searchTerm,
        },
      }));
    },

    handleSearch: (searchTerm: string): Promise<void> => {
      return new Promise((resolve) => {
        const debouncedSearch = debounce(async (term: string) => {
          await handleSearchImpl(set, get)(term);
          resolve();
        }, 500);
        debouncedSearch(searchTerm);
      });
    },

    clearSearch: () => {
      const store = get();
      store.setSearchTerm("");
      store.handleSearch("");
    },

    setTableLoading: (loading: boolean) =>
      set((state) => ({
        loading: {
          ...state.loading,
          table: loading,
        },
      })),

    setFilterLoading: (loading: boolean) =>
      set((state) => ({
        loading: {
          ...state.loading,
          filters: loading,
        },
      })),

    setActionLoading: (loading: boolean) =>
      set((state) => ({
        loading: {
          ...state.loading,
          actions: loading,
        },
      })),
  }),
);
