"use client";
import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { useCourseStore } from "@/store/course.store";
import SearchInput from "./SearchInput";
import SemesterSelect from "./SemesterSelect";
import StatusSelect from "./StatusSelect";
import YearSelect from "./YearSelect";

export default function FilterBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { filters, setFilters, fetchCourses, clearSearch } = useCourseStore();

  const handleClearFilters = () => {
    setFilters({});
    clearSearch();
    fetchCourses({});
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.semester ||
      filters.year ||
      filters.isActive !== undefined
    );
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-md">
          <SearchInput />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
        >
          <FiFilter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-stroke p-4 dark:border-strokedark sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="mb-2.5 block font-medium">Semester</label>
            <SemesterSelect />
          </div>
          <div>
            <label className="mb-2.5 block font-medium">Year</label>
            <YearSelect />
          </div>
          <div>
            <label className="mb-2.5 block font-medium">Status</label>
            <StatusSelect />
          </div>
          {hasActiveFilters() && (
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-stroke px-4 py-2 text-meta-1 hover:bg-danger/10 dark:border-strokedark"
              >
                <FiX className="h-5 w-5" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 