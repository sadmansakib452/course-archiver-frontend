"use client";
import { useState } from "react";
import { useTemplateStore } from "@/store/template.store";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { TemplateFilters } from "@/types/file-templates/template.types";

export default function FilterBar() {
  const { filters, setFilters, fetchTemplates, clearFilters } = useTemplateStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const updatedFilters = {
      ...filters,
      search: value || undefined,
      page: 1,
    };
    setFilters(updatedFilters);
    fetchTemplates(updatedFilters);
  };

  const handleStatusChange = (status: string) => {
    const updatedFilters = {
      ...filters,
      status: status === "" ? undefined : status === "active",
      page: 1,
    };
    setFilters(updatedFilters);
    fetchTemplates(updatedFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    clearFilters();
    fetchTemplates();
  };

  const hasActiveFilters = () => {
    return filters.search || typeof filters.status === "boolean";
  };

  return (
    <div className="mb-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="flex w-full max-w-lg items-center gap-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-8 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <FiSearch className="h-4 w-4 text-gray-500" />
            </span>
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-meta-1"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
        >
          <FiFilter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Expanded Filter Options */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-stroke p-4 dark:border-strokedark sm:grid-cols-2 md:grid-cols-3">
          {/* Status Filter */}
          <div>
            <label className="mb-2.5 block font-medium">Status</label>
            <select
              value={
                filters.status === undefined
                  ? ""
                  : filters.status
                  ? "active"
                  : "inactive"
              }
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters Button */}
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