export const TEMPLATE_CONFIG = {
  endpoints: {
    list: '/api/admin/file-templates',
    create: '/api/admin/file-templates',
    update: (id: string) => `/api/admin/file-templates/${id}`,
    delete: (id: string) => `/api/admin/file-templates/${id}`,
    toggle: (id: string) => `/api/admin/file-templates/${id}/toggle`,
    toggleStatus: (id: string) => `/api/admin/file-templates/${id}/status`,
    stats: (id: string) => `/api/admin/file-templates/${id}/stats`,
  },
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },
  permissions: {
    manage: ['SUPER_ADMIN', 'ADMIN'],
  },
} as const; 