import { UserRole } from "./auth.types";

// User Status enum
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

// Base User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface UsersApiResponse extends ApiResponse<User[]> {
  total: number;
  page: number;
  limit: number;
}

export interface UserApiResponse extends ApiResponse<User> {}

// Delete Response interfaces
export interface DeleteUserResponse extends ApiResponse<null> {
  userId: string;
  deletedAt: string;
}

// Action Response
export interface UserActionResponse {
  success: boolean;
  message: string;
  error?: string;
  statusCode: number;
}

// Table interfaces
export interface UserTableFilters {
  role?: UserRole;
  status?: UserStatus;
  department?: string;
  search?: string;
}

export interface UserTableSort {
  field: keyof User;
  direction: 'asc' | 'desc';
}

export interface UserTablePagination {
  page: number;
  limit: number;
  total: number;
}

// Department interface
export interface Department {
  code: string;
  name: string;
}

// User Actions
export type UserAction = 'view' | 'edit' | 'delete' | 'deactivate' | 'activate';

export interface UserActionPermission {
  action: UserAction;
  allowed: boolean;
  reason?: string;
}

// Modal interfaces
export interface DeleteModalState {
  isOpen: boolean;
  userId?: string;
  userName?: string;
  mode: 'deactivate' | 'delete' | null;
  reason?: string;
}

// Error interfaces
export interface UserError {
  field?: string;
  message: string;
  code?: string;
}

// Constants
export const USER_TABLE_COLUMNS = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'role', label: 'Role', sortable: true },
  { id: 'department', label: 'Department', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'createdAt', label: 'Created At', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false }
] as const;

export const USER_STATUSES = [
  { value: UserStatus.ACTIVE, label: 'Active', color: 'success' },
  { value: UserStatus.INACTIVE, label: 'Inactive', color: 'warning' },
  { value: UserStatus.PENDING, label: 'Pending', color: 'info' },
  { value: UserStatus.SUSPENDED, label: 'Suspended', color: 'danger' }
] as const; 