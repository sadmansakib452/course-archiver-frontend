"use client";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileForm from "@/components/profile/ProfileForm";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FiLoader } from "react-icons/fi";

export default function ProfilePage() {
  const { profile, loading, error, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <FiLoader className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="mx-auto max-w-5xl">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Profile Information
            </h3>
          </div>
          <div className="p-7">
            <ProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
} 