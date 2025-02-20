export const ROUTES = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    PROFILE: "/dashboard/profile",
    USERS: "/dashboard/users",
    USERS_ADD_ADMIN: "/dashboard/users/add-admin",
    USERS_ADD_FACULTY: "/dashboard/users/add-faculty",
    COURSES: {
      LIST: "/dashboard/courses",
      ADD: "/dashboard/courses/add",
      EDIT: (id: string) => `/dashboard/courses/${id}/edit`,
    },
  },
} as const; 