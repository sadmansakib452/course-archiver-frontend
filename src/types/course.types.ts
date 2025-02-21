// Add import at the top
import { Faculty } from "./faculty.types";

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
  faculty: Faculty | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
    faculty?: Faculty;
    facultyId?: string;
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
  page?: number;
  limit?: number;
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

export type CourseDeleteAction = 'delete' | 'deactivate' | 'restore';

export type DeleteConfirmationStep = "initial" | "confirm";

export interface CourseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: CourseDeleteAction) => Promise<void>;
  courseName: string;
  isLoading: boolean;
  isActive: boolean;
  loadingAction: CourseActionType;
}

// Add to existing types
export interface CourseSearchState {
  searchTerm: string;
  isSearching: boolean;
}

// Add pagination type
export interface PaginationState {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// New type for course update
export interface UpdateCourseInput {
  code?: string;
  name?: string;
  section?: number;
  semester?: CourseSemester;
  year?: number;
  facultyId?: string | null;
}

// Response type for course update
export interface UpdateCourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

// Add modal props type
export interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateCourseInput) => Promise<void>;
  course: Course;
  isLoading: boolean;
}

// Add loading action type to existing types
export type CourseActionType = 'deactivate' | 'delete' | 'restore' | 'update' | 'assign' | null;

// Update existing loading state type if exists, or add new
export interface ActionLoadingState {
  type: Exclude<CourseActionType, null>;  // Exclude null from possible types
  courseId: string;
}

// Add CreateCourse related types
export interface CreateCourseInput {
  code: string;
  name: string;
  section: number;
  semester: CourseSemester;
  year: number;
  facultyId?: string | null;
}

// Response type for course creation
export interface CreateCourseResponse {
  success: boolean;
  message: string;
  data: Course | null;
}

// Add modal props type (following EditCourseModalProps pattern)
export interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateCourseInput) => Promise<void>;
  isLoading: boolean;
}

// Add validation types for course creation
export interface CourseValidationErrors {
  code?: string;
  name?: string;
  section?: string;
  semester?: string;
  year?: string;
  facultyId?: string;
}

// Add API Error type
export interface ApiError {
  success: boolean;
  message: string;
  data?: any;
}
