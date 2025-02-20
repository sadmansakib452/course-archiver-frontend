"use client";
import { FiSearch, FiX } from "react-icons/fi";
import { useCourseStore } from "@/store/course.store";

export default function SearchInput() {
  const { search, setSearchTerm, handleSearch, clearSearch } = useCourseStore();

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2">
        <FiSearch className="h-4 w-4 text-gray-500" />
      </span>
      <input
        type="text"
        placeholder="Search courses..."
        value={search.searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-8 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
      />
      {search.searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-meta-1"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
} 