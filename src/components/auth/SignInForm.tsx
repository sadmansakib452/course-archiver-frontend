"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const router = useRouter();
  const { login, isAuthenticated, remember } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      
      if (rememberMe) {
        remember(formData.email);
      }
    } catch (err: any) {
      console.error('SignInForm: Login error:', err);
      setError(err.message);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2 p-4">
      <div className="w-full max-w-[2000px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* Left Side - Branding */}
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                  priority
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                  priority
                />
              </Link>

              <p className="2xl:px-20">
                Welcome to Course Archiver. Please sign in to continue.
              </p>

              {/* Add your illustration SVG here */}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              {/* Logo for mobile view */}
              <div className="mb-8 flex justify-center xl:hidden">
                <Link href="/">
                  <Image
                    src={"/images/logo/logo.svg"}
                    alt="Logo"
                    width={140}
                    height={30}
                    priority
                  />
                </Link>
              </div>

              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Course Archiver
              </h2>

              {error && (
                <div className="mb-5 rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22">
                        {/* Email icon SVG */}
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22">
                        {/* Password icon SVG */}
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-base text-black dark:text-white">
                    Faculty member?{" "}
                    <Link 
                      href="/auth/signup" 
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