"use client";
import { FiUser, FiMail, FiBookmark } from 'react-icons/fi';

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
  required?: boolean;
  label: string;
  type?: string;
  icon?: 'user' | 'mail' | 'bookmark';
}

export const TextInput = ({ 
  value, 
  onChange, 
  name, 
  placeholder, 
  required = false,
  label,
  type = "text",
  icon = "user"
}: TextInputProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'mail':
        return <FiMail className="h-5 w-5 text-gray-400" />;
      case 'bookmark':
        return <FiBookmark className="h-5 w-5 text-gray-400" />;
      default:
        return <FiUser className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getIcon()}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-boxdark-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}; 