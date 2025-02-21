"use client";

import { useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import {
  CreateCourseInput,
  CourseSemester,
  CourseValidationErrors,
} from "@/types/course.types";
import Modal from "@/components/common/Modal";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateCourseInput) => Promise<void>;
  isLoading: boolean;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: AddCourseModalProps) {
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
    // Clear field error when user types
    if (errors[name as keyof CourseValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Clear all errors before submission
      setError("");
      setErrors({});

      if (!validateForm()) return;

      // Wait for creation to complete
      await onCreate(formData);

      // Only reset form if successful
      setFormData({
        code: "",
        name: "",
        section: 1,
        semester: CourseSemester.FALL,
        year: new Date().getFullYear(),
      });
      // Don't close here - let the parent component handle closing
    } catch (error: any) {
      console.log("Modal Error:", error); // Debug log
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
      // Prevent error from propagating further
      return;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-black dark:text-white">
            Add New Course
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Error Display Section */}
        {(error || Object.values(errors).some(Boolean)) && (
          <div className="mb-6 rounded-lg border border-danger/20 bg-danger/5 p-4">
            {/* Show main error message if exists */}
            {error && (
              <div className="mb-2 text-sm font-medium text-danger">
                {error}
              </div>
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
            />
            {errors.code && (
              <p className="mt-1 text-sm text-danger">{errors.code}</p>
            )}
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
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger">{errors.name}</p>
            )}
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
            {errors.section && (
              <p className="mt-1 text-sm text-danger">{errors.section}</p>
            )}
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
            {errors.semester && (
              <p className="mt-1 text-sm text-danger">{errors.semester}</p>
            )}
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
            {errors.year && (
              <p className="mt-1 text-sm text-danger">{errors.year}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke px-6 py-2 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <FiLoader className="h-4 w-4 animate-spin" />}
            Create Course
          </button>
        </div>
      </div>
    </Modal>
  );
}
