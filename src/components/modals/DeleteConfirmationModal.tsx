"use client";
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { DeleteModalState } from '@/types/user.types';

interface DeleteConfirmationModalProps {
  modalState: DeleteModalState;
  onClose: () => void;
  onDeactivate: (userId: string) => Promise<void>;
  onDelete: (userId: string, reason: string) => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmationModal = ({
  modalState,
  onClose,
  onDeactivate,
  onDelete,
  isLoading
}: DeleteConfirmationModalProps) => {
  const { isOpen, userId, userName, mode } = modalState;
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState<'deactivate' | 'delete' | null>(mode);
  const [actionInProgress, setActionInProgress] = useState<'delete' | 'deactivate' | null>(null);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setError('');
      setSelectedMode(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !userId) return null;

  const handleAction = async (action: 'deactivate' | 'delete') => {
    if (action === 'deactivate') {
      setActionInProgress('deactivate');
      try {
        await onDeactivate(userId);
      } finally {
        setActionInProgress(null);
      }
    } else {
      if (!reason.trim()) {
        setError('Please provide a reason for deletion');
        return;
      }
      setActionInProgress('delete');
      try {
        await onDelete(userId, reason);
      } finally {
        setActionInProgress(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4 md:p-0">
        <div className="relative rounded-lg bg-white dark:bg-boxdark">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t border-b border-stroke p-4 dark:border-strokedark">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Delete User
            </h3>
            <button
              onClick={onClose}
              disabled={actionInProgress !== null}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="mr-4 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning bg-opacity-20">
                <FiAlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How would you like to delete {userName}?
              </p>
            </div>

            {/* Delete Options */}
            <div className="mb-6 space-y-4">
              <button
                onClick={() => setSelectedMode('deactivate')}
                className={`w-full rounded-lg border p-3 text-left transition-colors
                  ${selectedMode === 'deactivate' 
                    ? 'border-warning bg-warning/10' 
                    : 'border-stroke hover:border-warning'
                  }`}
              >
                <h4 className="font-medium text-black dark:text-white">Deactivate Account</h4>
                <p className="text-sm text-gray-500">User can be reactivated later</p>
              </button>

              <button
                onClick={() => setSelectedMode('delete')}
                className={`w-full rounded-lg border p-3 text-left transition-colors
                  ${selectedMode === 'delete' 
                    ? 'border-danger bg-danger/10' 
                    : 'border-stroke hover:border-danger'
                  }`}
              >
                <h4 className="font-medium text-black dark:text-white">Permanent Delete</h4>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </button>
            </div>

            {/* Reason Input for Delete Mode */}
            {selectedMode === 'delete' && (
              <div className="mb-4">
                <label 
                  htmlFor="deleteReason"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Reason for Deletion*
                </label>
                <textarea
                  id="deleteReason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError('');
                  }}
                  placeholder="Please provide a reason for deletion"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-black placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
                  rows={3}
                  disabled={actionInProgress !== null}
                />
                {error && (
                  <p className="mt-1 text-sm text-danger">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                disabled={actionInProgress !== null}
                className="rounded-lg border border-stroke px-6 py-2.5 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              
              {selectedMode && (
                <button
                  onClick={() => handleAction(selectedMode)}
                  disabled={actionInProgress !== null}
                  className={`rounded-lg px-6 py-2.5 text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50 flex items-center justify-center space-x-2
                    ${selectedMode === 'delete' ? 'bg-danger' : 'bg-warning'}`}
                >
                  {actionInProgress ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>
                        {selectedMode === 'delete' ? 'Deleting...' : 'Deactivating...'}
                      </span>
                    </>
                  ) : (
                    <span>
                      {selectedMode === 'delete' ? 'Delete Permanently' : 'Deactivate'}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 