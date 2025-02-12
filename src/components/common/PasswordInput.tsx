"use client";
import { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
  required?: boolean;
  label: string;
}

export const PasswordInput = ({ 
  value, 
  onChange, 
  name, 
  placeholder, 
  required = false,
  label 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-boxdark-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}; 