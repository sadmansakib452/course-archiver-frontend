"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";
import AddAdminForm from "@/components/users/AddAdminForm";

export default function AddAdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not super admin
  if (!user || user.role !== "SUPER_ADMIN") {
    router.push(ROUTES.DASHBOARD.HOME);
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 text-xl font-semibold text-black dark:text-white">
        Add New Admin
      </div>
      <AddAdminForm />
    </div>
  );
} 