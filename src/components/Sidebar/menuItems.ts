import {
  FiHome,
  FiUsers,
  FiBook,
  FiFile,
  FiFileText,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";
import { ROUTES } from "@/constants/routes.constants";
import { SidebarItem } from "@/types/sidebar.types";

export const menuItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    route: ROUTES.DASHBOARD.ROOT,
    icon: FiHome,
    permission: ["ADMIN", "SUPER_ADMIN", "FACULTY"],
  },
  {
    id: "manage-users",
    label: "Manage Users",
    route: ROUTES.DASHBOARD.USERS,
    icon: FiUsers,
    permission: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    id: "course-management",
    label: "Course Management",
    route: ROUTES.COURSES,
    icon: FiBook,
    permission: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    id: "course-files",
    label: "Course Files",
    route: ROUTES.COURSE_FILES.ROOT,
    icon: FiFile,
    permission: ["ADMIN", "SUPER_ADMIN"],
    children: [
      {
        id: "file-templates",
        label: "File Templates",
        route: ROUTES.COURSE_FILES.TEMPLATES,
        icon: FiFileText,
      },
      {
        id: "templates-stats",
        label: "Template Stats",
        route: ROUTES.COURSE_FILES.TEMPLATES_STATS,
        icon: FiBarChart2,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    route: "/settings",
    icon: FiSettings,
    permission: ["ADMIN", "SUPER_ADMIN"],
  },
];
