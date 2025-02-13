export const ROUTES = {
  ROOT: "/",
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password"
  },
  DASHBOARD: {
    HOME: "/dashboard",
    USERS: "/dashboard/users",
    USERS_ADD_ADMIN: "/dashboard/users/add-admin",
    USERS_ADD_FACULTY: "/dashboard/users/add-faculty",
    COURSES: "/dashboard/courses",
    SETTINGS: "/dashboard/settings"
  }
} as const; 