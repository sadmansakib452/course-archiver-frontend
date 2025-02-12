// This is a server component (no "use client")
import { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Course Archiver",
  description: "Sign in to Course Archiver",
};

export default function SignInPage() {
  return <SignInForm />;
}
