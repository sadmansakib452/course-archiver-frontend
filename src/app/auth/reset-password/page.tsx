import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Course Archiver",
  description: "Set your new password for Course Archiver",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
} 