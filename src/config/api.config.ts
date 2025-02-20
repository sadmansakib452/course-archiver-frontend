export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  endpoints: {
    auth: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      refresh: "/api/auth/refresh",
      logout: "/api/auth/logout",
      passwordReset: {
        request: "/api/auth/password-reset/request",
        reset: "/api/auth/password-reset/reset",
        validate: "/api/auth/password-reset/validate",
      },
    },
    users: {
      all: "/api/users/all",
      profile: "/api/users/profile",
      delete: (id: string) => `/api/users/${id}`,
      permanentDelete: (id: string) => `/api/users/${id}/permanent`,
      status: (id: string) => `/api/users/${id}/status`,
      restore: (id: string) => `/api/users/${id}/restore`,
    },
    admin: {
      create: "/api/super-admin/admins",
      list: "/api/super-admin/admins",
      faculty: {
        create: "/api/admin/faculty",
        list: "/api/admin/faculty",
      },
    },
    courses: {
      list: "/api/course-management/courses",
      create: "/api/course-management/courses",
      update: (id: string) => `/api/course-management/courses/${id}`,
      delete: (id: string) => `/api/course-management/courses/${id}`,
      toggleStatus: (id: string) =>
        `/api/course-management/courses/${id}/status`,
      assignFaculty: (id: string) => `/api/course-management/courses/${id}`,
      permanentDelete: (id: string) =>
        `/api/course-management/courses/${id}/permanent`,
    },
    courseManagement: {
      courses: "/api/course-management/courses",
    },
  },
  cookieNames: {
    auth: process.env.AUTH_COOKIE_NAME || "auth_token",
    refresh: process.env.REFRESH_COOKIE_NAME || "refresh_token",
  },
  expiry: {
    auth: 7200, // 2 hours in seconds
    refresh: 604800, // 7 days in seconds
  },
  timeouts: {
    default: 10000, // 10 seconds
    upload: 30000, // 30 seconds
  },
} as const;

export const AUTH_CONFIG = {
  cookieNames: {
    auth: process.env.AUTH_COOKIE_NAME || "auth_token",
    refresh: process.env.REFRESH_COOKIE_NAME || "refresh_token",
  },
  expiry: {
    auth: parseInt(process.env.AUTH_TOKEN_EXPIRY || "7200"),
    refresh: parseInt(process.env.REFRESH_TOKEN_EXPIRY || "604800"),
  },
};

export const API_ROUTES = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
  },
  ADMIN: {
    CREATE: "/super-admin/admins",
    LIST: "/super-admin/admins",
  },
} as const;

export const ROUTES = {
  DASHBOARD: {
    FACULTY: "/dashboard/faculty",
    FACULTY_ADD: "/dashboard/faculty/add",
  },
};
