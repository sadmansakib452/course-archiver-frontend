"use client";
import { useState, useEffect, useMemo } from "react";
import { FiX, FiLoader, FiSearch } from "react-icons/fi";
import { Faculty } from "@/types/faculty.types";
import { facultyService } from "@/services/faculty.service";
import Modal from "@/components/common/Modal";

interface AssignFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (facultyId: string) => Promise<void>;
  currentFaculty: Faculty | null;
  isLoading: boolean;
}

export default function AssignFacultyModal({
  isOpen,
  onClose,
  onAssign,
  currentFaculty,
  isLoading: isAssignLoading,
}: AssignFacultyModalProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);
  const [error, setError] = useState<string>("");

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFacultyId("");
      setSearchQuery("");
      setError("");
    }
  }, [isOpen]);

  // Fetch faculty when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacultyList();
    }
  }, [isOpen]);

  // Set initial selected faculty if exists
  useEffect(() => {
    if (currentFaculty?.id) {
      setSelectedFacultyId(currentFaculty.id);
    }
  }, [currentFaculty]);

  // Filter faculty based on search
  const filteredFaculty = useMemo(() => {
    if (!facultyList) return []; // Add null check
    return facultyList.filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [facultyList, searchQuery]);

  const fetchFacultyList = async () => {
    try {
      setIsLoadingFaculty(true);
      setError("");
      console.log("Before faculty fetch");
      const faculties = await facultyService.getFaculties();
      console.log("Received faculties:", faculties);

      if (!faculties || !Array.isArray(faculties)) {
        console.error("Invalid faculty data:", faculties);
        setError("Invalid faculty data received");
        return;
      }

      setFacultyList(faculties);
    } catch (error: any) {
      console.error("Failed to fetch faculty list:", error);
      setError(error.message || "Failed to fetch faculty list");
    } finally {
      setIsLoadingFaculty(false);
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

  // Add current faculty section
  const renderCurrentFaculty = () => {
    if (!currentFaculty) return null;

    return (
      <div className="mb-4 rounded-lg border border-stroke p-4 dark:border-strokedark">
        <p className="text-sm text-black/50 dark:text-white/50">
          Currently Assigned
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-black dark:text-white">
            {currentFaculty.name}
          </span>
          <span className="text-xs text-black/50 dark:text-white/50">
            ({currentFaculty.shortName})
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Assign Faculty
          </h3>
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Current Faculty */}
        {renderCurrentFaculty()}

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" />
            <input
              type="text"
              placeholder="Search by name, short name or department..."
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-md bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Faculty List */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoadingFaculty ? (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="py-8 text-center text-sm text-black/50 dark:text-white/50">
              No faculty found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaculty.map((faculty) => (
                <label
                  key={faculty.id}
                  className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors
                    ${
                      selectedFacultyId === faculty.id
                        ? "border-primary bg-primary/20 dark:bg-primary/30"
                        : "border-stroke hover:border-primary/50 hover:bg-primary/5 dark:border-strokedark dark:hover:bg-primary/10"
                    }
                    ${
                      currentFaculty?.id === faculty.id 
                        ? "ring-2 ring-success/30 dark:ring-success/40"
                        : ""
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="faculty"
                    value={faculty.id}
                    checked={selectedFacultyId === faculty.id}
                    onChange={() => setSelectedFacultyId(faculty.id)}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium 
                        ${selectedFacultyId === faculty.id 
                          ? "text-primary dark:text-primary" 
                          : "text-black dark:text-white"}`}
                      >
                        {faculty.name}
                      </span>
                      <span className="text-xs text-black/50 dark:text-white/50">
                        ({faculty.shortName})
                      </span>
                      {currentFaculty?.id === faculty.id && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-black/50 dark:text-white/50">
                      {faculty.designation} • {faculty.department}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-stroke px-6 py-2 text-sm font-medium text-black hover:bg-black/[0.02] dark:border-strokedark dark:text-white dark:hover:bg-white/[0.02]"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={isAssignLoading || !selectedFacultyId}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAssignLoading && <FiLoader className="h-4 w-4 animate-spin" />}
            Assign Faculty
          </button>
        </div>
      </div>
    </Modal>
  );
}
