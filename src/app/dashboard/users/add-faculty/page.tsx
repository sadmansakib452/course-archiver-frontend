"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";
import AddFacultyForm from "@/components/faculty/AddFacultyForm";

export default function AddFacultyPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [user, router]);

  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Add New Faculty
        </h3>
      </div>
      <AddFacultyForm />
    </div>
  );
} 