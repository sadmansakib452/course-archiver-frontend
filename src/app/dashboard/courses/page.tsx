"use client";
import { useEffect } from "react";
import { useCourseStore } from "@/store/course.store";
import CourseList from "@/components/courses/CourseList";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function CoursesPage() {
  const { fetchCourses, isLoading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="rounded-sm border px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Courses
        </h4>
        <Link
          href={ROUTES.DASHBOARD.COURSES.ADD}
          className="inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <FiPlus className="h-5 w-5" />
          Add Course
        </Link>
      </div>

      <CourseList />
    </div>
  );
} 