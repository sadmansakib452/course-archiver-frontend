"use client";
import { useState } from "react";
import { useCourseStore } from "@/store/course.store";
import { Course, COURSE_TABLE_COLUMNS, CourseFilters } from "@/types/course.types";
import { FiEdit2, FiUserPlus, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AssignFacultyModal from "./AssignFacultyModal";
import CourseFilterBar from "./CourseFilters";

export default function CourseList() {
  const { courses, isLoading, error, toggleCourseStatus, assignFaculty, fetchCourses, setFilters } = useCourseStore();
  const [actionLoading, setActionLoading] = useState<{[key: string]: boolean}>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Handle status toggle
  const handleStatusToggle = async (courseId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`status-${courseId}`]: true }));
      await toggleCourseStatus(courseId);
      toast.success("Course status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update course status");
    } finally {
      setActionLoading(prev => ({ ...prev, [`status-${courseId}`]: false }));
    }
  };

  // Handle faculty assignment
  const handleFacultyAssign = async (courseId: string, facultyId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`faculty-${courseId}`]: true }));
      await assignFaculty(courseId, facultyId);
      toast.success("Faculty assigned successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to assign faculty");
    } finally {
      setActionLoading(prev => ({ ...prev, [`faculty-${courseId}`]: false }));
    }
  };

  const openAssignModal = (course: Course) => {
    setSelectedCourse(course);
    setIsAssignModalOpen(true);
  };

  // Add handler
  const handleFilter = (filters: CourseFilters) => {
    setFilters(filters);
    fetchCourses(filters);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-meta-1">{error}</p>
      </div>
    );
  }

  return (
    <>
      <CourseFilterBar onFilter={handleFilter} isLoading={isLoading} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {COURSE_TABLE_COLUMNS.map((column) => (
                  <th key={column.id} className="py-4 px-4 font-medium text-black dark:text-white">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={COURSE_TABLE_COLUMNS.length} className="text-center py-6">
                    No courses found
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-b border-[#eee] dark:border-strokedark">
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{course.code}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{course.name}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{course.section}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{course.semester}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{course.year}</p>
                    </td>
                    <td className="py-5 px-4">
                      {course.faculty ? (
                        <div className="flex items-center gap-2">
                          <span className="text-black dark:text-white">
                            {course.faculty.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({course.faculty.shortName})
                          </span>
                        </div>
                      ) : (
                        <span className="text-meta-1">Not Assigned</span>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        course.isActive 
                          ? 'bg-success/10 text-success' 
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => handleStatusToggle(course.id)}
                          disabled={actionLoading[`status-${course.id}`]}
                          className="hover:text-primary"
                        >
                          {course.isActive ? (
                            <FiToggleRight className="h-5 w-5" />
                          ) : (
                            <FiToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() => {/* Handle edit */}}
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() => openAssignModal(course)}
                          disabled={actionLoading[`faculty-${course.id}`]}
                        >
                          <FiUserPlus className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AssignFacultyModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedCourse(null);
        }}
        onAssign={(facultyId) => {
          if (selectedCourse) {
            return handleFacultyAssign(selectedCourse.id, facultyId);
          }
          return Promise.reject("No course selected");
        }}
        currentFaculty={selectedCourse?.faculty || null}
        isLoading={actionLoading[`faculty-${selectedCourse?.id}`] || false}
      />
    </>
  );
} 