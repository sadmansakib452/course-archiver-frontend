export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: UserProfile;
} 