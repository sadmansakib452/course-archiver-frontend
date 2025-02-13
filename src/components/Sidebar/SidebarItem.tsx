import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SidebarItemProps } from "@/types/sidebar.types";
import SidebarDropdown from "./SidebarDropdown";

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
  level = 0,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Check permission
  if (item.permission && (!user || !item.permission.includes(user.role))) {
    return null;
  }

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
  };

  const isActive = (route: string): boolean => {
    if (route === "/dashboard") {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  const itemActive = isActive(item.route);

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
          ${itemActive ? "bg-graydark dark:bg-meta-4" : ""}
          ${level > 0 ? "pl-6" : ""}
        `}
      >
        {React.createElement(item.icon, {
          className: "w-5 h-5",
        })}
        <span>{item.label}</span>

        {item.badge && (
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 rounded bg-${item.badge.variant} px-2 py-1 text-xs font-medium text-white`}
          >
            {item.badge.text}
          </span>
        )}

        {item.children && (
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              pageName === item.label.toLowerCase() ? "rotate-180" : ""
            } transition-transform duration-200`}
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          </span>
        )}
      </Link>

      {item.children && (
        <div
          className={`transform overflow-hidden transition-all duration-300 ${
            pageName === item.label.toLowerCase() ? "block" : "hidden"
          }`}
        >
          <SidebarDropdown
            items={item.children}
            className="mt-4 flex flex-col gap-2.5 pl-6"
          />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
