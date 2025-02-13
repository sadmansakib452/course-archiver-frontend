import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarDropdownProps } from "@/types/sidebar.types";

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  items,
  className = "",
}) => {
  const pathname = usePathname();

  return (
    <ul className={`mb-5.5 flex flex-col gap-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.route}
            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
              pathname === item.route ? "text-white" : ""
            }`}
          >
            {React.createElement(item.icon, {
              className: "w-4 h-4",
            })}
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded bg-${item.badge.variant} px-2 py-1 text-xs font-medium text-white`}
              >
                {item.badge.text}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
