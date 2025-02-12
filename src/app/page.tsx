"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import Loader from "@/components/common/Loader";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace(ROUTES.DASHBOARD.HOME);
      } else {
        router.replace(ROUTES.AUTH.SIGNIN);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loader while checking auth state
  return <Loader />;
}
