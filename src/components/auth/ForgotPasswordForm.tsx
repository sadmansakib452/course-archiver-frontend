"use client";
import { useState } from "react";
import Link from "next/link";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ROUTES } from "@/constants/routes.constants";
import { TextInput } from "@/components/common/TextInput";
import { FiLoader } from 'react-icons/fi';
import { EMAIL_VALIDATION } from "@/constants/validation.constants";
import { AUTH_MESSAGES } from "@/constants/auth.constants";
import { toast } from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { requestReset } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const sanitizedEmail = email.trim().toLowerCase();
    if (!EMAIL_VALIDATION.PATTERN.test(sanitizedEmail)) {
      setError(EMAIL_VALIDATION.ERROR_MESSAGES.INVALID);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting reset request for:', sanitizedEmail); // Debug log
      await requestReset(sanitizedEmail);
      setSubmitted(true);
      toast.success(AUTH_MESSAGES.PASSWORD_RESET.REQUEST_SUCCESS);
    } catch (err: any) {
      console.error('Reset request failed:', err); // Debug log
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-boxdark">
          <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white">
            Check Your Email
          </h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            We've sent password reset instructions to {email}
          </p>
          <Link
            href={ROUTES.AUTH.SIGNIN}
            className="block w-full rounded-lg bg-primary px-8 py-3 text-center text-sm font-semibold text-white hover:bg-opacity-90"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-boxdark">
        <h2 className="mb-6 text-center text-2xl font-bold text-black dark:text-white">
          Forgot Password
        </h2>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            icon="mail"
          />

          {error && (
            <div className="mb-4 text-sm text-meta-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Sending...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.AUTH.SIGNIN}
              className="text-sm font-medium text-primary hover:text-opacity-90"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 