"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import SidebarItem from "./SidebarItem";
import { MENU_ITEMS, filterMenuItemsByRole } from "@/config/menu.config";
import { useTheme } from "@/hooks/useTheme";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { theme } = useTheme();
  const location = usePathname();
  const { pathname } = usePathname();
  const { user } = useAuth();
  const [pageName, setPageName] = useState("");

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Filter menu items based on user role
  const filteredMenuItems = filterMenuItemsByRole(MENU_ITEMS, user?.role);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Logo Area */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <div className="flex items-center gap-2">
              {/* Mobile Logo Icon */}
              <Image
                width={32}
                height={32}
                src={"/images/logo/logo.svg"}
                alt="Logo"
                className="block lg:hidden"
              />

              {/* Desktop Logo - Light Mode */}
              <Image
                width={176}
                height={32}
                src={"/images/logo/logo.svg"}
                alt="Logo"
                className="hidden dark:hidden lg:block"
                priority
              />

              {/* Desktop Logo - Dark Mode */}
              <Image
                width={176}
                height={32}
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                className="hidden dark:lg:block"
                priority
              />
            </div>
          </Link>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.21248 17.625 9.36248 17.4375C9.69998 17.1 9.69998 16.575 9.36248 16.2375L2.98748 9.75H19C19.45 9.75 19.825 9.375 19.825 8.925C19.825 8.475 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {filteredMenuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
