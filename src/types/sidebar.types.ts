import { IconType } from "react-icons";
import { UserRole } from "./auth.types";

export interface SidebarItem {
  id: string;
  label: string;
  route: string;
  icon: IconType;
  permission?: UserRole[];
  children?: SidebarItem[];
  badge?: {
    text: string;
    variant: 'primary' | 'warning' | 'danger';
  };
}

export interface SidebarItemProps {
  item: SidebarItem;
  pageName: string;
  setPageName: (name: string) => void;
  level?: number;
}

export interface SidebarDropdownProps {
  items: SidebarItem[];
  className?: string;
}

export interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => React.ReactNode;
  activeCondition: boolean;
} 