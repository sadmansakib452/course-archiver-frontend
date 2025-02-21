"use client";
import { FiAlertTriangle } from "react-icons/fi";
import Modal from "@/components/common/Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  templateName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  templateName,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
            <FiAlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <h3 className="text-xl font-medium text-black dark:text-white">
            Delete Template
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-base text-body-color dark:text-gray-300">
            Are you sure you want to delete <span className="font-medium">{templateName}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:shadow-1 disabled:cursor-not-allowed disabled:bg-opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Template"}
          </button>
        </div>
      </div>
    </Modal>
  );
} 