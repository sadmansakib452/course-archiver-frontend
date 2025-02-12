"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRememberMe } from "@/hooks/useRememberMe";
import { ROUTES } from "@/constants/routes.constants";
import { TextInput } from "@/components/common/TextInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader } from 'react-icons/fi';

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { remembered, remember, forget } = useRememberMe('remembered-email');
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load remembered email if exists
  useEffect(() => {
    if (remembered) {
      setFormData(prev => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, [remembered]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setRememberMe(checked);
      if (!checked) {
        forget();
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Handle remember me
      if (rememberMe) {
        remember(formData.email);
      } else {
        forget();
      }
    } catch (err: any) {
      console.error('SignInForm: Login error:', err);
      setError(err.message || 'Login failed');
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
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
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              icon="mail"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80 transition duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary hover:text-primary/80 transition duration-200"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 