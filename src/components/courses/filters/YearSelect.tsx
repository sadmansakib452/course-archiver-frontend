"use client";
import { useCourseStore } from "@/store/course.store";

export default function YearSelect() {
  const { filters, setFilters, fetchCourses } = useCourseStore();

  // Generate year options (current year + 1 year ahead, 4 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 6 },
    (_, i) => currentYear + 1 - i
  ).sort((a, b) => b - a);

  const handleYearChange = (yearStr: string) => {
    const year = yearStr === "" ? undefined : parseInt(yearStr);
    const updatedFilters = {
      ...filters,
      year,
      page: 1,
    };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  return (
    <select
      value={filters.year || ""}
      onChange={(e) => handleYearChange(e.target.value)}
      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
    >
      <option value="">All Years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
} 