"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";
import UsersList from "@/components/users/UsersList";

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authorized
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    router.push(ROUTES.DASHBOARD.HOME);
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Users List
          </h4>
          {user.role === "SUPER_ADMIN" && (
            <button
              onClick={() => router.push(ROUTES.DASHBOARD.USERS_ADD_ADMIN)}
              className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-opacity-90"
            >
              Add New Admin
            </button>
          )}
        </div>
      </div>
      <UsersList />
    </div>
  );
} 