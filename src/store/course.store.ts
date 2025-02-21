import { create } from "zustand";
import {
  Course,
  CourseFilters,
  CourseTableSort,
  CoursePagination,
  CourseApiResponse,
  CourseSearchState,
  PaginationState,
  UpdateCourseInput,
  UpdateCourseResponse,
  CourseLoadingState,
  CourseActionType,
  CreateCourseInput,
  CreateCourseResponse,
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
    update: boolean;
  };
  actionLoading: {
    [key: string]: { type: CourseActionType; courseId: string } | null;
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
  updateCourse: (courseId: string, data: UpdateCourseInput) => Promise<void>;
  createCourse: (data: CreateCourseInput) => Promise<void>;
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
    update: false,
  },
  actionLoading: {},
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
        set((state) => ({
          ...state,
          actionLoading: {
            ...state.actionLoading,
            [courseId]: { type: "deactivate", courseId },
          },
        }));

        const response = await courseService.toggleCourseStatus(courseId);

        set((state) => ({
          ...state,
          courses: state.courses.map((course) =>
            course.id === courseId ? response.data.courses[0] : course,
          ),
          actionLoading: {
            ...state.actionLoading,
            [courseId]: null,
          },
        }));
      } catch (error: any) {
        set((state) => ({
          ...state,
          error: error.message,
          actionLoading: {
            ...state.actionLoading,
            [courseId]: null,
          },
        }));
        throw error;
      }
    },

    assignFaculty: async (courseId: string, facultyId: string) => {
      try {
        set((state) => ({
          ...state,
          loading: {
            ...state.loading,
            actions: true,
          },
        }));

        const response = await courseService.assignFaculty(courseId, facultyId);

        // Fix type issues in state update
        set((state) => ({
          ...state,
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  faculty: response.data.faculty || null,
                  facultyId: response.data.facultyId || null,
                }
              : course,
          ),
          loading: {
            ...state.loading,
            actions: false,
          },
        }));
      } catch (error: any) {
        set((state) => ({
          ...state,
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

    updateCourse: async (courseId: string, data: UpdateCourseInput) => {
      try {
        // Set loading state
        set((state) => ({
          ...state,
          actionLoading: {
            ...state.actionLoading,
            [courseId]: { type: "update", courseId },
          },
        }));

        // Make API call
        const response = await courseService.updateCourse(courseId, data);

        // Update the course in state
        set((state) => ({
          ...state,
          courses: state.courses.map((course) =>
            course.id === courseId ? response.data : course,
          ),
          actionLoading: {
            ...state.actionLoading,
            [courseId]: null,
          },
        }));
      } catch (error: any) {
        // Handle error
        set((state) => ({
          ...state,
          error: error.message,
          actionLoading: {
            ...state.actionLoading,
            [courseId]: null,
          },
        }));
        throw error;
      }
    },

    createCourse: async (data: CreateCourseInput) => {
      try {
        // Set loading state
        set((state) => ({
          ...state,
          loading: {
            ...state.loading,
            actions: true,
          },
          actionLoading: {
            ...state.actionLoading,
            create: { type: "create", courseId: "new" },
          },
        }));

        // Make API call
        const response = await courseService.createCourse(data);

        // Verify response data exists
        if (!response.data) {
          throw new Error("Invalid response from server");
        }

        // Update courses list with new course
        set((state) => ({
          ...state,
          courses: [response.data!, ...state.courses], // We know data exists here
          loading: {
            ...state.loading,
            actions: false,
          },
          actionLoading: {
            ...state.actionLoading,
            create: null,
          },
        }));
      } catch (error: any) {
        // Handle error
        set((state) => ({
          ...state,
          error: error.message,
          loading: {
            ...state.loading,
            actions: false,
          },
          actionLoading: {
            ...state.actionLoading,
            create: null,
          },
        }));
        throw error; // Re-throw for component handling
      }
    },
  }),
);
