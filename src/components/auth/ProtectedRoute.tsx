"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import Loader from "@/components/common/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, accessToken } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state changed', { 
      isAuthenticated, 
      isLoading,
      hasToken: !!accessToken 
    });

    if (!isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: Redirecting to login');
      router.replace(ROUTES.AUTH.SIGNIN);
    }
  }, [isAuthenticated, isLoading, router, accessToken]);

  if (isLoading) {
    console.log('ProtectedRoute: Showing loader');
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, returning null');
    return null;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};
