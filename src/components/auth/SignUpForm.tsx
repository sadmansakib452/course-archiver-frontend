"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import { TextInput } from "@/components/common/TextInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader } from 'react-icons/fi';
import type { RegisterRequest } from "@/types/auth.types";
import { toast } from "react-hot-toast";

export default function SignUpForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      toast.success('Registration successful! Please sign in.');
      router.push(ROUTES.AUTH.SIGNIN);
    } catch (err: any) {
      console.error('SignUpForm: Registration error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-boxdark-2 dark:to-boxdark p-4">
      <div className="w-full max-w-md bg-white dark:bg-boxdark rounded-2xl shadow-xl overflow-hidden auth-card">
        {/* Logo & Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="mb-6 inline-flex justify-center">
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={150}
              height={40}
              className="dark:hidden"
              priority
            />
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              width={150}
              height={40}
              className="hidden dark:block"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up to get started
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              icon="user"
            />

            <TextInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              icon="mail"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-primary hover:text-primary/80 transition duration-200"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 