import { axiosInstance } from "@/lib/axios";
import { 
  User, 
  UsersApiResponse, 
  DeleteUserResponse, 
  UserTableFilters,
  UserTableSort,
  UserTablePagination,
  UserStatus
} from "@/types/user.types";
import { API_CONFIG } from "@/config/api.config";

export const userService = {
  // Fetch all users with filtering, sorting, and pagination
  getAllUsers: async (
    filters?: UserTableFilters,
    sort?: UserTableSort,
    pagination?: Partial<UserTablePagination>
  ): Promise<UsersApiResponse> => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
      }

      // Add sorting
      if (sort) {
        params.append('sortBy', sort.field);
        params.append('sortDirection', sort.direction);
      }

      // Add pagination
      if (pagination) {
        if (pagination.page) params.append('page', pagination.page.toString());
        if (pagination.limit) params.append('limit', pagination.limit.toString());
      }

      const response = await axiosInstance.get<UsersApiResponse>(
        `${API_CONFIG.endpoints.users.all}${params.toString() ? `?${params.toString()}` : ''}`
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Soft delete (deactivate) user
  deactivateUser: async (userId: string): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteUserResponse>(
        API_CONFIG.endpoints.users.delete(userId)
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to deactivate user:', error);
      throw new Error(error.response?.data?.message || 'Failed to deactivate user');
    }
  },

  // Permanent delete user
  permanentDeleteUser: async (userId: string, reason: string): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteUserResponse>(
        API_CONFIG.endpoints.users.permanentDelete(userId),
        {
          data: { reason } // Axios requires 'data' property for delete request body
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete user permanently:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Update user status
  updateUserStatus: async (
    userId: string, 
    status: UserStatus
  ): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.patch<DeleteUserResponse>(
        API_CONFIG.endpoints.users.status(userId),
        { status }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  // Get single user details
  getUserDetails: async (userId: string): Promise<User> => {
    try {
      const response = await axiosInstance.get<UsersApiResponse>(
        `/api/users/${userId}`
      );
      return response.data.data[0];
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  },

  // Restore user
  restoreUser: async (userId: string): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.post<DeleteUserResponse>(
        API_CONFIG.endpoints.users.restore(userId)
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to restore user:', error);
      throw new Error(error.response?.data?.message || 'Failed to restore user');
    }
  }
}; 