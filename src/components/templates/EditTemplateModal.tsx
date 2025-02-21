"use client";
import { useState } from "react";
import { FileTemplate, UpdateTemplateInput } from "@/types/file-templates/template.types";
import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from "@/types/file-templates/template.types";
import { formatBytes } from "@/utils/format.utils";
import { FiX, FiLoader } from "react-icons/fi";
import Modal from "@/components/common/Modal";
import { toast } from "react-hot-toast";
import { updateTemplateSchema } from "@/validations/template.validation";

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: FileTemplate;
  onUpdate: (id: string, data: UpdateTemplateInput) => Promise<void>;
}

export default function EditTemplateModal({ isOpen, onClose, template, onUpdate }: EditTemplateModalProps) {
  // Form state
  const [formData, setFormData] = useState<UpdateTemplateInput>({
    name: template.name,
    description: template.description,
    isRequired: template.isRequired,
    fileTypes: template.fileTypes,
    maxSize: template.maxSize,
  });

  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
        ? Number(value) 
        : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file types selection
  const handleFileTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter((t) => t !== type)
        : [...prev.fileTypes, type],
    }));
  };

  // Form validation
  const validateForm = () => {
    try {
      updateTemplateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(template.id, formData);
      toast.success("Template updated successfully");
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message });
      toast.error(error.message || "Failed to update template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-xl rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Edit Template
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 rounded-lg bg-danger/10 p-4 text-danger">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Template Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger">{errors.name}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description}</p>
            )}
          </div>

          {/* File Types Selection */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Allowed File Types
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLOWED_FILE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleFileTypeToggle(type)}
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    formData.fileTypes.includes(type)
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 dark:bg-meta-4 dark:text-gray-300"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            {errors.fileTypes && (
              <p className="mt-1 text-sm text-danger">{errors.fileTypes}</p>
            )}
          </div>

          {/* Max Size Input */}
          <div>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Maximum File Size
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="maxSize"
                value={formData.maxSize}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({formatBytes(formData.maxSize)})
              </span>
            </div>
            {errors.maxSize && (
              <p className="mt-1 text-sm text-danger">{errors.maxSize}</p>
            )}
          </div>

          {/* Is Required Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRequired"
              checked={formData.isRequired}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="font-medium text-black dark:text-white">
              Required Template
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:shadow-1 disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Updating...</span>
                </>
              ) : (
                "Update Template"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 