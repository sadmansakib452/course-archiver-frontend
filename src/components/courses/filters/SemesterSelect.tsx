"use client";
import { CourseSemester } from "@/types/course.types";
import { useCourseStore } from "@/store/course.store";

export default function SemesterSelect() {
  const { filters, setFilters, fetchCourses } = useCourseStore();

  const handleSemesterChange = (semester: CourseSemester | "") => {
    const updatedFilters = {
      ...filters,
      semester: semester || undefined,
      page: 1,
    };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  return (
    <select
      value={filters.semester || ""}
      onChange={(e) => handleSemesterChange(e.target.value as CourseSemester | "")}
      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
    >
      <option value="">All Semesters</option>
      {Object.values(CourseSemester).map((semester) => (
        <option key={semester} value={semester}>
          {semester}
        </option>
      ))}
    </select>
  );
} 