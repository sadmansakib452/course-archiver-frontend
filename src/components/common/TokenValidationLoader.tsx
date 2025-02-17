"use client";
import { FiLoader } from 'react-icons/fi';

export const TokenValidationLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-boxdark-2 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-boxdark text-center">
        <FiLoader className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          Validating Reset Link
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we verify your reset link...
        </p>
      </div>
    </div>
  );
}; 