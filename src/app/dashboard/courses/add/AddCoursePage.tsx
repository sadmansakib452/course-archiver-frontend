"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCourseStore } from "@/store/course.store";
import { CreateCourseInput } from "@/types/course.types";
import { toast } from "react-hot-toast";
import AddCourseForm from "@/components/courses/AddCourseForm";
import { ROUTES } from "@/constants/routes.constants";

export default function AddCoursePage() {
  const router = useRouter();
  const { createCourse } = useCourseStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: CreateCourseInput) => {
    try {
      setIsLoading(true);
      await createCourse(data);
      toast.success("Course created successfully");
      router.push(ROUTES.COURSES);
    } catch (error: any) {
      // Don't throw error, just let form handle it
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Add New Course
        </h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Create a new course in the system
        </p>
      </div>

      <div className="max-w-2xl">
        <AddCourseForm onSubmit={handleCreate} isLoading={isLoading} />
      </div>
    </div>
  );
}
