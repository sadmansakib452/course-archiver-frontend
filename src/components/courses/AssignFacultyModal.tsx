"use client";
import { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { CourseFaculty } from "@/types/course.types";

interface AssignFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (facultyId: string) => Promise<void>;
  currentFaculty: CourseFaculty | null;
  isLoading: boolean;
}

export default function AssignFacultyModal({
  isOpen,
  onClose,
  onAssign,
  currentFaculty,
  isLoading
}: AssignFacultyModalProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
  const [facultyList, setFacultyList] = useState<CourseFaculty[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Fetch faculty list
      fetchFacultyList();
    }
  }, [isOpen]);

  const fetchFacultyList = async () => {
    try {
      // TODO: Implement faculty list fetching
      // This will be implemented in the next iteration
      setFacultyList([]);
    } catch (error) {
      setError("Failed to fetch faculty list");
    }
  };

  const handleAssign = async () => {
    if (!selectedFacultyId) {
      setError("Please select a faculty");
      return;
    }
    try {
      await onAssign(selectedFacultyId);
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to assign faculty");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Assign Faculty
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

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Current Faculty
          </label>
          <div className="rounded-md bg-gray-100 p-3 dark:bg-meta-4">
            {currentFaculty ? (
              <div>
                <p className="font-medium text-black dark:text-white">
                  {currentFaculty.name}
                </p>
                <p className="text-sm text-gray-500">
                  {currentFaculty.email} ({currentFaculty.shortName})
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No faculty assigned</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Select New Faculty
          </label>
          <select
            value={selectedFacultyId}
            onChange={(e) => setSelectedFacultyId(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Faculty</option>
            {facultyList.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} ({faculty.shortName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isLoading || !selectedFacultyId}
            className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </div>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 