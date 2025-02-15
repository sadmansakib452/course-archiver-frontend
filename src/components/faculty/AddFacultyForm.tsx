"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ROUTES } from "@/constants/routes.constants";
import { facultyService } from "@/services/faculty.service";

interface FacultyFormData {
  email: string;
  name: string;
  shortName: string;
  designation: string;
}

export default function AddFacultyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacultyFormData>();

  const onSubmit = async (data: FacultyFormData) => {
    try {
      setIsLoading(true);
      await facultyService.createFaculty(data);
      toast.success("Faculty added successfully");
      router.push(ROUTES.DASHBOARD.USERS);
    } catch (error: any) {
      toast.error(error.message || "Failed to add faculty");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6.5">
        {/* Name */}
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter faculty name"
            {...register("name", {
              required: "Name is required",
            })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.name && (
            <p className="text-meta-1 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Email <span className="text-meta-1">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter faculty email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.email && (
            <p className="text-meta-1 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Short Name */}
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Short Name <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter short name (e.g., SSD)"
            {...register("shortName", {
              required: "Short name is required",
              maxLength: {
                value: 5,
                message: "Short name must be 5 characters or less",
              },
            })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.shortName && (
            <p className="text-meta-1 text-sm mt-1">{errors.shortName.message}</p>
          )}
        </div>

        {/* Designation */}
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Designation <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter designation"
            {...register("designation", {
              required: "Designation is required",
            })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {errors.designation && (
            <p className="text-meta-1 text-sm mt-1">
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {isLoading ? "Adding..." : "Add Faculty"}
        </button>
      </div>
    </form>
  );
} 