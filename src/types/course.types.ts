// Course-related enums
export enum CourseSemester {
  FALL = "FALL",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
}

// Faculty information in course context
export interface CourseFaculty {
  id: string;
  name: string;
  email: string;
  shortName: string;
}

// Base Course interface
export interface Course {
  id: string;
  code: string;
  name: string;
  section: number;
  semester: CourseSemester;
  year: number;
  facultyId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  faculty: CourseFaculty | null;
}

// Pagination interface
export interface CoursePagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// API Response interfaces
export interface CourseApiResponse {
  success: boolean;
  message: string;
  data: {
    courses: Course[];
    pagination: CoursePagination;
  };
}

// Course List Filters
export interface CourseFilters {
  code?: string;
  semester?: CourseSemester;
  year?: number;
  facultyId?: string;
  isActive?: boolean;
  search?: string;
}

// Course Table Sort
export interface CourseTableSort {
  field: keyof Course;
  direction: "asc" | "desc";
}

// Course Action Types
export type CourseAction = "view" | "edit" | "assign" | "toggle-status";

// Course Action Permission
export interface CourseActionPermission {
  action: CourseAction;
  allowed: boolean;
  reason?: string;
}

// Constants
export const COURSE_TABLE_COLUMNS = [
  { id: "code", label: "Course Code", sortable: true },
  { id: "name", label: "Course Name", sortable: true },
  { id: "section", label: "Section", sortable: true },
  { id: "semester", label: "Semester", sortable: true },
  { id: "year", label: "Year", sortable: true },
  { id: "faculty", label: "Faculty", sortable: true },
  { id: "isActive", label: "Status", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
] as const;

// Error Types
export interface CourseError {
  field?: string;
  message: string;
  code?: string;
}

export type CourseDeleteAction = "deactivate" | "permanent" | "restore";

export type DeleteConfirmationStep = "initial" | "confirm";

export interface CourseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: CourseDeleteAction) => Promise<void>;
  courseName: string;
  isLoading: boolean;
  isActive: boolean;
  loadingAction: "deactivate" | "delete" | "restore" | null;
}
