"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants/routes.constants";
import { adminService } from "@/services/admin.service";
import { toast } from "react-hot-toast";

const adminSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  temporaryPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least 1 uppercase letter and 1 number"
    ),
  departmentCode: z.string().min(2, "Please select a department"),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function AddAdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminFormData) => {
    try {
      setIsLoading(true);
      await adminService.createAdmin(data);
      toast.success('Admin created successfully');
      reset(); // Reset form
      router.push(ROUTES.DASHBOARD.USERS);
    } catch (error: any) {
      if (error.statusCode === 409) {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Something went wrong');
        setError("root", {
          message: error.message || "Something went wrong",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.root.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4.5 flex flex-col gap-6">
        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Email <span className="text-meta-1">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={`w-full rounded border-[1.5px] ${
              errors.email ? 'border-danger' : 'border-stroke'
            } bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-meta-1">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter full name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-meta-1">{errors.name.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Department <span className="text-meta-1">*</span>
          </label>
          <select
            {...register("departmentCode")}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science</option>
            <option value="EEE">Electrical Engineering</option>
            {/* Add more departments */}
          </select>
          {errors.departmentCode && (
            <p className="mt-1 text-xs text-meta-1">
              {errors.departmentCode.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Temporary Password <span className="text-meta-1">*</span>
          </label>
          <input
            type="password"
            {...register("temporaryPassword")}
            placeholder="Enter temporary password"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.temporaryPassword && (
            <p className="mt-1 text-xs text-meta-1">
              {errors.temporaryPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating...
          </span>
        ) : (
          "Create Admin"
        )}
      </button>
    </form>
  );
} 