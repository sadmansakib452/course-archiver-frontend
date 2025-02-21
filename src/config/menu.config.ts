import { SidebarItem } from "@/types/sidebar.types";
import {
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiBook,
  FiHome,
  FiList,
  FiPlus,
  FiFile,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";
import { ROUTES } from "@/constants/routes.constants";
import { UserRole } from "@/types/auth.types";

// Define menu items with their permissions
export const MENU_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    route: ROUTES.DASHBOARD.ROOT,
    icon: FiHome,
  },
  {
    id: "manage-users",
    label: "Manage Users",
    route: ROUTES.DASHBOARD.USERS,
    icon: FiUsers,
    permission: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        id: "add-admin",
        label: "Add Admin",
        route: ROUTES.DASHBOARD.USERS_ADD_ADMIN,
        icon: FiUserPlus,
        permission: ["SUPER_ADMIN"],
      },
      {
        id: "add-faculty",
        label: "Add Faculty",
        route: ROUTES.DASHBOARD.USERS_ADD_FACULTY,
        icon: FiUserPlus,
        permission: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    id: "course-management",
    label: "Course Management",
    route: ROUTES.DASHBOARD.COURSES.LIST,
    icon: FiBook,
    permission: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        id: "course-list",
        label: "All Courses",
        route: ROUTES.DASHBOARD.COURSES.LIST,
        icon: FiList,
      },
      {
        id: "add-course",
        label: "Add Course",
        route: ROUTES.DASHBOARD.COURSES.ADD,
        icon: FiPlus,
      },
    ],
  },
  {
    id: "course-files",
    label: "Course Files",
    route: ROUTES.COURSE_FILES.ROOT,
    icon: FiFile,
    permission: ["SUPER_ADMIN", "ADMIN"],
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
    permission: ["SUPER_ADMIN", "ADMIN"],
  },
];

export const filterMenuItemsByRole = (
  items: SidebarItem[],
  userRole: UserRole,
): SidebarItem[] => {
  return items.reduce<SidebarItem[]>((acc, item) => {
    // Check if user has permission for this item
    if (item.permission && !item.permission.includes(userRole)) {
      return acc;
    }

    // Handle children recursively
    if (item.children) {
      const filteredChildren = item.children.filter(
        (child) => !child.permission || child.permission.includes(userRole),
      );

      // Only include parent if it has accessible children or no children
      if (filteredChildren.length > 0) {
        acc.push({
          ...item,
          children: filteredChildren,
        });
      }
    } else {
      acc.push(item);
    }

    return acc;
  }, []);
};
