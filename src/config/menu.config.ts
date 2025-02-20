import { SidebarItem } from "@/types/sidebar.types";
import { 
  FiUsers, 
  FiUserPlus, 
  FiSettings, 
  FiBook,
  FiArchive,
  FiHome,
  FiPlusCircle,
  FiList
} from "react-icons/fi";

// Define menu items with their permissions
export const MENU_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    route: "/dashboard",
    icon: FiHome,
  },
  {
    id: "manage-users",
    label: "Manage Users",
    route: "/dashboard/users",
    icon: FiUsers,
    permission: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        id: "add-admin",
        label: "Add Admin",
        route: "/dashboard/users/add-admin",
        icon: FiUserPlus,
        permission: ["SUPER_ADMIN"], // Only super admin can see this
      },
      {
        id: "add-faculty",
        label: "Add Faculty",
        route: "/dashboard/users/add-faculty",
        icon: FiUserPlus,
        permission: ["ADMIN", "SUPER_ADMIN"] // Both admin and super admin can see this
      }
    ]
  },
  {
    id: "course-management",
    label: "Course Management",
    route: "/dashboard/courses",
    icon: FiBook,
    permission: ["SUPER_ADMIN", "ADMIN"],
    children: [
      {
        id: "course-list",
        label: "All Courses",
        route: "/dashboard/courses",
        icon: FiList,
      },
      {
        id: "add-course",
        label: "Add Course",
        route: "/dashboard/courses/add",
        icon: FiPlusCircle,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    route: "/dashboard/settings",
    icon: FiSettings
  }
];

// Helper function to filter menu items based on user role
export const filterMenuItemsByRole = (items: SidebarItem[], userRole?: string) => {
  if (!userRole) return [];

  return items.reduce<SidebarItem[]>((acc, item) => {
    // Check if user has permission for this item
    if (item.permission && !item.permission.includes(userRole)) {
      return acc;
    }

    // If item has children, filter them recursively
    if (item.children) {
      const filteredChildren = item.children.filter(
        child => !child.permission || child.permission.includes(userRole)
      );

      // Only include parent if it has accessible children or no children
      if (filteredChildren.length > 0) {
        return [...acc, { ...item, children: filteredChildren }];
      }
      return acc;
    }

    return [...acc, item];
  }, []);
}; 