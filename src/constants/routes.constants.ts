export const ROUTES = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    USERS: "/dashboard/users",
    USERS_ADD_ADMIN: "/dashboard/users/add-admin",
    USERS_ADD_FACULTY: "/dashboard/users/add-faculty",
  },
} as const; 