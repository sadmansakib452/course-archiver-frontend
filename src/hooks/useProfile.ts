import { useState } from "react";
import { profileService } from "@/services/profile.service";
import { UserProfile, UpdateProfileRequest } from "@/types/profile.types";
import { toast } from "react-hot-toast";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.updateProfile(data);
      setProfile(response.data);

      if (data.name) {
        toast.success("Profile name updated successfully");
      }
      if (data.newPassword) {
        toast.success("Password changed successfully");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
