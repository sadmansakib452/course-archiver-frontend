"use client";
import { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { Course, UpdateCourseInput, CourseSemester } from "@/types/course.types";
import Modal from "@/components/common/Modal";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateCourseInput) => Promise<void>;
  course: Course;
  isLoading: boolean;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  onUpdate,
  course,
  isLoading,
}: EditCourseModalProps) {
  const [formData, setFormData] = useState<UpdateCourseInput>({});
  const [error, setError] = useState<string>("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: course.code,
        name: course.name,
        section: course.section,
        semester: course.semester,
        year: course.year,
      });
      setError("");
    }
  }, [isOpen, course]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "section" || name === "year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      // Only include changed fields
      const updates: UpdateCourseInput = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== course[key as keyof Course]) {
          updates[key as keyof UpdateCourseInput] = value;
        }
      });

      if (Object.keys(updates).length === 0) {
        setError("No changes made");
        return;
      }

      await onUpdate(updates);
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to update course");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-black dark:text-white">
            Edit Course
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Course Code */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Course Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            />
          </div>

          {/* Section */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Section
            </label>
            <input
              type="number"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
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
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            />
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
            Update Course
          </button>
        </div>
      </div>
    </Modal>
  );
} 