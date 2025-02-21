export const TEMPLATE_MESSAGES = {
  CREATE: {
    SUCCESS: 'Template created successfully',
    ERROR: 'Failed to create template',
  },
  UPDATE: {
    SUCCESS: 'Template updated successfully',
    ERROR: 'Failed to update template',
  },
  DELETE: {
    SUCCESS: 'Template deleted successfully',
    ERROR: 'Failed to delete template',
    CONFIRM: 'Are you sure you want to delete this template?',
  },
  STATUS: {
    ACTIVE: 'Template activated successfully',
    INACTIVE: 'Template deactivated successfully',
    ERROR: 'Failed to update template status',
  },
  VALIDATION: {
    NAME_REQUIRED: 'Template name is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    FILE_TYPES_REQUIRED: 'At least one file type must be selected',
    INVALID_SIZE: 'Invalid file size limit',
    SIZE_RANGE: 'Size must be between 1KB and 100MB',
  },
  STATS: {
    ERROR: "Failed to fetch template statistics",
  },
} as const; 