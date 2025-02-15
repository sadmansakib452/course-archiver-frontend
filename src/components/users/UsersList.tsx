"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { 
  User, 
  UserStatus, 
  DeleteModalState,
  UserTableSort,
  UserTableFilters,
  USER_STATUSES
} from "@/types/user.types";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

export default function UsersList() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    userId: undefined,
    userName: undefined,
    mode: null,
  });
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [actionLoading, setActionLoading] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to manage loading states
  const handleActionWithLoading = async (
    userId: string, 
    action: () => Promise<void>
  ) => {
    const loadingKey = `${userId}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    try {
      await action();
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleDeleteUser = async (userId: string, reason: string) => {
    try {
      await userService.permanentDeleteUser(userId, reason);
      toast.success("User deleted successfully");
      setDeleteModal({ isOpen: false, userId: undefined, userName: undefined, mode: null });
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, UserStatus.INACTIVE);
      toast.success("User deactivated successfully");
      setDeleteModal({ isOpen: false, userId: undefined, userName: undefined, mode: null });
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to deactivate user");
    }
  };

  const handleRestoreUser = async (userId: string) => {
    await handleActionWithLoading(userId, async () => {
      try {
        await userService.restoreUser(userId);
        toast.success("User restored successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to restore user");
      }
    });
  };

  const renderActionButtons = (user: User) => {
    if (user.id === currentUser?.id) {
      return null;
    }

    const isLoading = actionLoading[user.id];

    return (
      <div className="flex items-center space-x-3.5">
        {currentUser?.role === "SUPER_ADMIN" && (
          <>
            {user.status === UserStatus.INACTIVE && (
              <button 
                className="hover:text-success flex items-center space-x-1 disabled:opacity-50"
                onClick={() => handleRestoreUser(user.id)}
                title="Restore User"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Restoring...</span>
                  </>
                ) : (
                  <FiRefreshCw className="h-5 w-5" />
                )}
              </button>
            )}
            <button 
              className="hover:text-danger flex items-center space-x-1 disabled:opacity-50"
              onClick={() => setDeleteModal({
                isOpen: true,
                userId: user.id,
                userName: user.name,
                mode: null
              })}
              title="Delete User"
              disabled={isLoading}
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Don't render anything while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-lg dark:bg-boxdark">
      {/* Table Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-4 md:px-6 xl:px-7.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-lg font-semibold text-black dark:text-white">
            Users List
          </h4>
          {currentUser?.role === "SUPER_ADMIN" && (
            <div className="flex gap-4">
              <button
                onClick={() => router.push(ROUTES.DASHBOARD.USERS_ADD_ADMIN)}
                className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-opacity-90"
              >
                Add New Admin
              </button>
              <button
                onClick={() => router.push(ROUTES.DASHBOARD.USERS_ADD_FACULTY)}
                className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-opacity-90"
              >
                Add Faculty
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full table-auto">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4 border-b border-gray-200 dark:border-strokedark">
                <th className="min-w-[200px] py-4 px-3 font-medium text-black dark:text-white xl:pl-8">
                  Name
                </th>
                <th className="min-w-[140px] py-4 px-3 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[100px] py-4 px-3 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="min-w-[100px] py-4 px-3 font-medium text-black dark:text-white">
                  Department
                </th>
                <th className="min-w-[90px] py-4 px-3 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[80px] py-4 px-3 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-black dark:text-white">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-gray-200 dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/30 transition-colors"
                  >
                    <td className="py-3 px-3 pl-8">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.name}
                      </h5>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.department}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        USER_STATUSES.find(s => s.value === user.status)?.color === 'success' 
                          ? 'bg-success/10 text-success dark:bg-success/20' 
                          : 'bg-danger/10 text-danger dark:bg-danger/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {renderActionButtons(user)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal 
        modalState={deleteModal}
        onClose={() => setDeleteModal({ isOpen: false, userId: undefined, userName: undefined, mode: null })}
        onDelete={handleDeleteUser}
        onDeactivate={handleDeactivateUser}
        isLoading={isLoading}
      />
    </div>
  );
} 