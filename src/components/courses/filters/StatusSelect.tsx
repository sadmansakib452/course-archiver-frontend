"use client";
import { useCourseStore } from "@/store/course.store";

export default function StatusSelect() {
  const { filters, setFilters, fetchCourses } = useCourseStore();

  const handleStatusChange = (status: string) => {
    const updatedFilters = {
      ...filters,
      isActive: status === "" ? undefined : status === "active",
      page: 1,
    };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  return (
    <select
      value={
        filters.isActive === undefined
          ? ""
          : filters.isActive
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
  );
}
