"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ROUTES } from "@/constants/routes.constants";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [user, router]);

  return (
    <>
      <Breadcrumb pageName="Course Management" />
      <div className="mx-auto max-w-screen-2xl">{children}</div>
    </>
  );
} 