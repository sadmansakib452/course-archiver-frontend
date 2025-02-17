"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constants/routes.constants";
import { TextInput } from "@/components/common/TextInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import { FiLoader } from 'react-icons/fi';
import { EMAIL_VALIDATION } from "@/constants/validation.constants";
import { toast } from "react-hot-toast";
import { useRememberCredentials } from '@/hooks/useRememberCredentials';

const SignInForm = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { remembered, rememberCredentials, forgetCredentials } = useRememberCredentials();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Load remembered email on mount
  useEffect(() => {
    if (remembered?.email) {
      setFormData(prev => ({
        ...prev,
        email: remembered.email
      }));
      setRememberMe(true);
    }
  }, [remembered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!EMAIL_VALIDATION.PATTERN.test(formData.email)) {
      setError(EMAIL_VALIDATION.ERROR_MESSAGES.INVALID);
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      
      // Handle remember me
      if (rememberMe) {
        rememberCredentials(formData.email);
      } else {
        forgetCredentials();
      }
    } catch (err: any) {
      console.error('SignInForm: Login error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Update remember me checkbox handler
  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2 p-4">
      <div className="w-full max-w-[2000px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="2xl:px-20">
                Course Archiver - Streamline Your Course Documentation
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    icon="mail"
                  />
                </div>

                <div className="mb-6">
                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={handleRememberMe}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 text-sm text-black dark:text-white"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    href={ROUTES.AUTH.FORGOT_PASSWORD}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-base text-black dark:text-white">
                    Faculty member?{" "}
                    <Link 
                      href={ROUTES.AUTH.SIGNUP} 
                      className="text-primary hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm; 