import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Course Archiver",
  description: "Reset your password for Course Archiver",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
} 