// Base template interface
export interface FileTemplate {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  fileTypes: string[];
  maxSize: number; // in bytes
  status: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface TemplateResponse {
  success: boolean;
  message?: string;
  data: FileTemplate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// State types
export interface TemplateState {
  templates: FileTemplate[];
  loading: {
    table: boolean;
    action: boolean;
  };
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: TemplateFilters;
}

// Filter types
export interface TemplateFilters {
  page?: number;
  limit?: number;
  status?: boolean;
  search?: string;
}

// Action types
export interface CreateTemplateInput {
  name: string;
  description: string;
  isRequired: boolean;
  fileTypes: string[];
  maxSize: number;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  isRequired?: boolean;
  fileTypes?: string[];
  maxSize?: number;
}

// Component prop types
export interface TemplateTableProps {
  templates: FileTemplate[];
  isLoading: boolean;
  onEdit: (template: FileTemplate) => void;
  onDelete: (template: FileTemplate) => void;
  onStatusToggle: (template: FileTemplate) => void;
}

export interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: FileTemplate;
  onSubmit: (data: CreateTemplateInput | UpdateTemplateInput) => Promise<void>;
  isLoading: boolean;
}

// Constants
export const TEMPLATE_TABLE_COLUMNS = [
  { id: 'name', label: 'Template Name', sortable: true },
  { id: 'description', label: 'Description', sortable: false },
  { id: 'fileTypes', label: 'Allowed Files', sortable: false },
  { id: 'maxSize', label: 'Max Size', sortable: true },
  { id: 'isRequired', label: 'Required', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
] as const;

// Error types
export interface TemplateError {
  field?: string;
  message: string;
  code?: string;
}

// Loading state types
export interface TemplateActionState {
  type: 'create' | 'update' | 'delete' | 'toggle';
  templateId?: string;
}

// Permission types (for admin/super-admin)
export type TemplatePermission = 'SUPER_ADMIN' | 'ADMIN';

export const ALLOWED_ROLES: TemplatePermission[] = ['SUPER_ADMIN', 'ADMIN'];

// File type constants
export const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx'] as const;

// Size constants (in bytes)
export const FILE_SIZE_LIMITS = {
  MIN: 1024, // 1KB
  MAX: 104857600, // 100MB
  DEFAULT: 52428800, // 50MB
} as const;

// Validation types
export interface TemplateValidation {
  name?: string;
  description?: string;
  fileTypes?: string;
  maxSize?: string;
} 