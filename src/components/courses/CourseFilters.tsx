"use client";
import { useState } from "react";
import { CourseFilters, CourseSemester } from "@/types/course.types";
import { FiSearch, FiFilter } from "react-icons/fi";

interface CourseFilterProps {
  onFilter: (filters: CourseFilters) => void;
  isLoading?: boolean;
}

export default function CourseFilterBar({ onFilter, isLoading }: CourseFilterProps) {
  const [filters, setFilters] = useState<CourseFilters>({});

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="flex w-full max-w-lg items-center gap-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            disabled={isLoading}
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          value={filters.semester || ""}
          onChange={(e) => handleFilterChange("semester", e.target.value)}
          disabled={isLoading}
        >
          <option value="">All Semesters</option>
          {Object.values(CourseSemester).map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          value={filters.year?.toString() || ""}
          onChange={(e) => handleFilterChange("year", parseInt(e.target.value) || undefined)}
          disabled={isLoading}
        >
          <option value="">All Years</option>
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          value={filters.isActive?.toString() || ""}
          onChange={(e) => handleFilterChange("isActive", e.target.value === "true")}
          disabled={isLoading}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          onClick={() => {
            setFilters({});
            onFilter({});
          }}
          disabled={isLoading || Object.keys(filters).length === 0}
          className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 dark:border-form-strokedark dark:hover:bg-meta-4"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 