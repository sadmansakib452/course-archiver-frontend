"use client";

import { useState } from "react";
import {
  CreateCourseInput,
  CourseSemester,
  CourseValidationErrors,
} from "@/types/course.types";
import { FiLoader } from "react-icons/fi";

interface AddCourseFormProps {
  onSubmit: (data: CreateCourseInput) => Promise<void>;
  isLoading: boolean;
}

export default function AddCourseForm({
  onSubmit,
  isLoading,
}: AddCourseFormProps) {
  const [formData, setFormData] = useState<CreateCourseInput>({
    code: "",
    name: "",
    section: 1,
    semester: CourseSemester.FALL,
    year: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<CourseValidationErrors>({});
  const [error, setError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: CourseValidationErrors = {};

    if (!formData.code) newErrors.code = "Course code is required";
    if (!formData.name) newErrors.name = "Course name is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.year) newErrors.year = "Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "section" || name === "year" ? Number(value) : value,
    }));
    if (errors[name as keyof CourseValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear all errors before submission
    setError("");
    setErrors({});

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error: any) {
      // Handle API errors
      const message = error.message || "Failed to create course";

      // Check for specific error types
      if (message.includes("Section") && message.includes("already exists")) {
        setErrors((prev) => ({
          ...prev,
          section: message,
        }));
      } else {
        // Set general error
        setError(message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark"
    >
      {/* Error Display Section */}
      {(error || Object.values(errors).some(Boolean)) && (
        <div className="mb-6 rounded-lg border border-danger/20 bg-danger/5 p-4">
          {/* Show main error message if exists */}
          {error && (
            <div className="mb-2 text-sm font-medium text-danger">{error}</div>
          )}
          {/* Show field-specific errors */}
          <div className="space-y-1">
            {Object.entries(errors).map(([field, errorMsg]) =>
              errorMsg ? (
                <div key={field} className="text-sm text-danger/90">
                  • {errorMsg}
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Course Code */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Course Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary ${
              errors.code ? "border-danger" : "border-stroke"
            }`}
            placeholder="e.g. CSE101"
          />
        </div>

        {/* Course Name */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Course Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary ${
              errors.name ? "border-danger" : "border-stroke"
            }`}
            placeholder="e.g. Introduction to Computer Science"
          />
        </div>

        {/* Section */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Section *
          </label>
          <input
            type="number"
            name="section"
            value={formData.section}
            onChange={handleChange}
            min={1}
            className={`w-full rounded-lg border bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary ${
              errors.section ? "border-danger" : "border-stroke"
            }`}
          />
        </div>

        {/* Semester */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Semester *
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary ${
              errors.semester ? "border-danger" : "border-stroke"
            }`}
          >
            {Object.values(CourseSemester).map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Year *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min={2000}
            max={2100}
            className={`w-full rounded-lg border bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary ${
              errors.year ? "border-danger" : "border-stroke"
            }`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <FiLoader className="h-5 w-5 animate-spin" />}
          Create Course
        </button>
      </div>
    </form>
  );
}
