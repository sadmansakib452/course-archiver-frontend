"use client";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { UserProfile, UpdateProfileRequest } from "@/types/profile.types";
import { TextInput } from "@/components/common/TextInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader } from "react-icons/fi";
import { PASSWORD_VALIDATION } from "@/constants/validation.constants";

interface ProfileFormProps {
  profile: UserProfile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const { loading, updateProfile } = useProfile();
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: profile?.name || "",
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const updateData: UpdateProfileRequest = {};

      // Always include name in the request if it's different
      if (formData.name && formData.name !== profile?.name) {
        updateData.name = formData.name;
      }

      // Check if both password fields are filled
      if (formData.currentPassword || formData.newPassword) {
        // Validate both passwords are provided
        if (!formData.currentPassword) {
          setError("Current password is required to change password");
          return;
        }
        if (!formData.newPassword) {
          setError("New password is required");
          return;
        }

        // Password validation
        if (formData.newPassword.length < PASSWORD_VALIDATION.MIN_LENGTH) {
          setError(PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_LENGTH);
          return;
        }
        if (!PASSWORD_VALIDATION.PATTERN.test(formData.newPassword)) {
          setError(PASSWORD_VALIDATION.ERROR_MESSAGES.PATTERN);
          return;
        }

        // Include password fields in request
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Only make the API call if there are changes
      if (Object.keys(updateData).length > 0) {
        console.log("Updating profile with:", updateData);
        await updateProfile(updateData);

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      } else {
        setError("No changes to update");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      // Use the error message from the API response
      setError(err.message || "Failed to update profile");
    }
  };

  if (!profile) return null;

  return (
    <div className="rounded-sm bg-white dark:bg-boxdark">
      <form onSubmit={handleSubmit} className="p-6.5">
        {/* Basic Information Section */}
        <div className="mb-8">
          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Basic Information
          </h4>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <TextInput
                label="Email"
                name="email"
                value={profile.email}
                readOnly
                type="email"
                icon="mail"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>
            <div>
              <TextInput
                label="Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                icon="user"
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>

        {/* Role Information Section */}
        <div className="mb-8">
          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Role Information
          </h4>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <TextInput
                label="Role"
                name="role"
                value={profile.role}
                readOnly
                icon="bookmark"
              />
            </div>
            <div>
              <TextInput
                label="Department"
                name="department"
                value={profile.department}
                readOnly
                icon="bookmark"
              />
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="mb-8">
          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Change Password
          </h4>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword || ""}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={formData.newPassword || ""}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-meta-1/10 p-4 text-sm text-meta-1">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="-ml-1 mr-2 h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
