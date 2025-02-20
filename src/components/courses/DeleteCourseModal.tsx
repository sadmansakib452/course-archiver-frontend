"use client";
import { useState } from "react";
import { FiX, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { CourseDeleteAction, CourseDeleteModalProps, DeleteConfirmationStep } from "@/types/course.types";

export default function DeleteCourseModal({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  isLoading,
  isActive,
  loadingAction,
}: CourseDeleteModalProps) {
  const [error, setError] = useState<string>("");
  const [confirmationStep, setConfirmationStep] = useState<DeleteConfirmationStep>("initial");

  const handleConfirm = async (action: CourseDeleteAction) => {
    try {
      if (action === "permanent" && confirmationStep === "initial") {
        setConfirmationStep("confirm");
        return;
      }

      setError("");
      await onConfirm(action);
      setConfirmationStep("initial");
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getLoadingText = (action: CourseDeleteAction) => {
    return action === "deactivate" ? "Deactivating..." : "Permanently Deleting...";
  };

  const getErrorMessage = (error: string, action: CourseDeleteAction) => {
    const actionText = action === "deactivate" ? "deactivate" : "permanently delete";
    return error || `Failed to ${actionText} course`;
  };

  const isActionLoading = (action: CourseDeleteAction) => {
    return isLoading && (
      (action === "deactivate" && loadingAction === "deactivate") ||
      (action === "permanent" && loadingAction === "delete")
    );
  };

  const renderButtons = () => {
    if (!isActive) {
      if (confirmationStep === "initial") {
        return (
          <button
            onClick={() => handleConfirm("permanent")}
            disabled={isLoading}
            className="w-full rounded-lg bg-danger px-6 py-3 text-white hover:bg-opacity-90"
          >
            Permanently Delete
          </button>
        );
      } else {
        return (
          <>
            <div className="mb-4 text-center text-meta-1">
              This action cannot be undone. Are you absolutely sure?
            </div>
            <button
              onClick={() => handleConfirm("permanent")}
              disabled={isLoading}
              className="w-full rounded-lg bg-danger px-6 py-3 text-white hover:bg-opacity-90"
            >
              {isActionLoading("permanent") ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Permanently...
                </div>
              ) : (
                "Yes, Delete Permanently"
              )}
            </button>
          </>
        );
      }
    }

    return (
      <>
        <button
          onClick={() => handleConfirm("deactivate")}
          disabled={isLoading}
          className="w-full rounded-lg border border-meta-1 bg-white px-6 py-3 text-meta-1 hover:bg-meta-1 hover:text-white dark:bg-boxdark"
        >
          {isActionLoading("deactivate") ? (
            <div className="flex items-center justify-center">
              <FiLoader className="mr-2 h-4 w-4 animate-spin" />
              {getLoadingText("deactivate")}
            </div>
          ) : (
            "Deactivate Course"
          )}
        </button>
        <button
          onClick={() => handleConfirm("permanent")}
          disabled={isLoading}
          className="w-full rounded-lg bg-danger px-6 py-3 text-white hover:bg-opacity-90"
        >
          Permanently Delete
        </button>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {isActive ? "Delete Course" : "Permanently Delete Course"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 text-meta-1">
            <FiAlertTriangle className="h-10 w-10" />
            <p className="text-lg">
              {isActive
                ? `What would you like to do with ${courseName}?`
                : `Are you sure you want to permanently delete ${courseName}?`}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-danger">
              {getErrorMessage(error, "deactivate")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {renderButtons()}
          <button
            onClick={() => {
              setConfirmationStep("initial");
              onClose();
            }}
            disabled={isLoading}
            className="w-full rounded-lg border border-stroke px-6 py-3 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 