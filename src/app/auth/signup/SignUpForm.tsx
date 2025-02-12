"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import { TextInput } from "@/components/common/TextInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader, FiBookOpen } from 'react-icons/fi';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  designation: string;
  department: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.email.endsWith('@university.edu')) {
      setError("Please use your university email address");
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
        password: formData.password,
        designation: formData.designation,
        department: formData.department
      });
      router.push(ROUTES.AUTH.SIGNIN);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-boxdark-2 dark:to-boxdark p-4">
      <div className="w-full max-w-xl bg-white dark:bg-boxdark rounded-2xl shadow-xl overflow-hidden auth-card">
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
            Faculty Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our academic community
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-500 dark:text-red-400 border border-red-100 dark:border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. John Doe"
                  required
                  icon="user"
                />

                <TextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@university.edu"
                  required
                  icon="mail"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Assistant Professor"
                  required
                  icon="bookmark"
                />

                <TextInput
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  required
                  icon="bookmark"
                />
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wider">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>

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