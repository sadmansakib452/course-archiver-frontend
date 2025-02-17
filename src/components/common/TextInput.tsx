"use client";
import { FiUser, FiMail, FiBookmark } from 'react-icons/fi';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  icon?: string;
  error?: string;
}

export const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  readOnly,
  icon,
  error,
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
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            {getIcon()}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className={`w-full rounded-lg border py-3 px-4 ${
            icon ? 'pl-11' : 'pl-4'
          } outline-none transition-colors duration-200 ${
            readOnly 
              ? 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400' 
              : 'border-gray-300 bg-white focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary'
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-meta-1">{error}</p>}
    </div>
  );
}; 