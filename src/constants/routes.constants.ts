export const ROUTES = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    HOME: "/dashboard",
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
  COURSES: "/dashboard/courses",
  COURSES_ADD: "/dashboard/courses/add",
  COURSE_FILES: {
    ROOT: "/dashboard/course-files",
    TEMPLATES: "/dashboard/course-files/templates",
    TEMPLATES_ADD: "/dashboard/course-files/templates/add",
    TEMPLATES_STATS: "/dashboard/course-files/templates-stats",
  },
} as const; 