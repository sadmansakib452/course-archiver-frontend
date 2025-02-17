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

      console.log("Updating profile with:", data);
      const response = await profileService.updateProfile(data);

      setProfile(response.data);

      // Show success messages based on what was updated
      if (data.name) {
        toast.success("Profile name updated successfully");
      }
      if (data.newPassword) {
        toast.success("Password changed successfully");
      }

      return response;
    } catch (err: any) {
      console.error("Profile update failed:", err);
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw to handle in the form
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
