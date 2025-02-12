import { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Faculty Registration | Course Archiver",
  description: "Register as a faculty member in Course Archiver system",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
