"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ROUTES } from "@/constants/routes.constants";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader } from "react-icons/fi";
import { AUTH_MESSAGES } from "@/constants/auth.constants";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { loading, error, resetPassword } = usePasswordReset();

  if (!token) {
    router.replace(ROUTES.AUTH.FORGOT_PASSWORD);
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Step 1: Reset password form submitted");

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      console.log("Step 1a: Password mismatch detected");
      return;
    }

    try {
      console.log("Step 2: Calling resetPassword hook");
      await resetPassword(token, formData.password);
    } catch (err: any) {
      console.log("Step 1b: Form submission error caught", { err });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-boxdark-2">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-boxdark">
        <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <PasswordInput
            label="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <div className="mt-4">
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Show error from hook instead of local state */}
          {error && (
            <div className="mt-4 text-sm text-meta-1">{error.message}</div>
          )}

          {formData.password !== formData.confirmPassword && (
            <div className="mt-4 text-sm text-meta-1">
              {AUTH_MESSAGES.PASSWORD_RESET.PASSWORD_MISMATCH}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || formData.password !== formData.confirmPassword}
            className="mt-6 flex w-full items-center justify-center rounded-lg border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="-ml-1 mr-2 h-5 w-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
