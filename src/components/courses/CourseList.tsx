"use client";
import { useState } from "react";
import { useCourseStore } from "@/store/course.store";
import { Course, COURSE_TABLE_COLUMNS, CourseFilters } from "@/types/course.types";
import { FiEdit2, FiUserPlus, FiToggleLeft, FiToggleRight, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AssignFacultyModal from "./AssignFacultyModal";
import DeleteCourseModal from "./DeleteCourseModal";
import FilterBar from "./filters/FilterBar";
import CourseTable from "./CourseTable";

// Add specific loading state types
interface ActionLoadingState {
  type: 'deactivate' | 'delete' | 'restore';
  courseId: string;
}

export default function CourseList() {
  const { 
    courses, 
    loading,  // Use granular loading state
    error,
    toggleCourseStatus, 
    assignFaculty, 
    fetchCourses, 
    setFilters,
    deactivateCourse,
    deleteCoursePermantly,
    restoreCourse,
    refreshCourses
  } = useCourseStore();

  const [actionLoading, setActionLoading] = useState<{
    [key: string]: ActionLoadingState;
  }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle status toggle
  const handleStatusToggle = async (courseId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`status-${courseId}`]: { type: 'deactivate', courseId } }));
      await toggleCourseStatus(courseId);
      toast.success("Course status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update course status");
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[`status-${courseId}`];
        return newState;
      });
    }
  };

  // Handle faculty assignment
  const handleFacultyAssign = async (courseId: string, facultyId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [`faculty-${courseId}`]: { type: 'deactivate', courseId } }));
      await assignFaculty(courseId, facultyId);
      toast.success("Faculty assigned successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to assign faculty");
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[`faculty-${courseId}`];
        return newState;
      });
    }
  };

  const openAssignModal = (course: Course) => {
    setSelectedCourse(course);
    setIsAssignModalOpen(true);
  };

  // Create a separate handler for delete button click
  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Update handleDeleteAction to include restore
  const handleDeleteAction = async (action: CourseDeleteAction) => {
    if (!selectedCourse) return;

    const loadingKey = `delete-${selectedCourse.id}`;
    try {
      setActionLoading(prev => ({
        ...prev,
        [loadingKey]: {
          type: action === "deactivate" ? "deactivate" : 
                action === "restore" ? "restore" : "delete",
          courseId: selectedCourse.id
        }
      }));
      
      switch (action) {
        case "deactivate":
          await deactivateCourse(selectedCourse.id);
          toast.success(`Course "${selectedCourse.name}" has been deactivated`);
          break;
        case "restore":
          await restoreCourse(selectedCourse.id);
          toast.success(`Course "${selectedCourse.name}" has been restored`);
          break;
        case "permanent":
          await deleteCoursePermantly(selectedCourse.id);
          toast.success(`Course "${selectedCourse.name}" has been permanently deleted`);
          break;
      }

      // Close modal after successful action
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);

      // Refresh the list after action
      await refreshCourses();
    } catch (error: any) {
      const actionText = 
        action === "deactivate" ? "deactivate" : 
        action === "restore" ? "restore" : "permanently delete";
      const errorMessage = error.response?.data?.message || `Failed to ${actionText} course`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[loadingKey];
        return newState;
      });
    }
  };

  // Handle filter
  const handleFilter = (filters: CourseFilters) => {
    setFilters(filters);
    fetchCourses(filters);
  };

  // Add new handler for restore
  const handleRestoreCourse = async (course: Course) => {
    try {
      setActionLoading(prev => ({
        ...prev,
        [`restore-${course.id}`]: {
          type: 'restore',
          courseId: course.id
        }
      }));
      
      await restoreCourse(course.id);
      toast.success(`Course "${course.name}" has been restored`);
      await refreshCourses();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to restore course';
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[`restore-${course.id}`];
        return newState;
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-meta-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header with slide animation */}
      <div 
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Course Management
          </h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Manage your courses, assign faculty, and track course status
          </p>
        </div>
      </div>

      {/* Quick Stats with scale animation */}
      <div 
        className="flex items-center gap-4 rounded-lg border border-stroke/10 bg-white/50 px-4 py-2 dark:border-strokedark/10 dark:bg-meta-4/20"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        <div className="text-center">
          <p className="text-xs text-black/60 dark:text-white/60">Total</p>
          <p className="text-lg font-semibold text-black dark:text-white">
            {courses.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-black/60 dark:text-white/60">Active</p>
          <p className="text-lg font-semibold text-success">
            {courses.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-black/60 dark:text-white/60">Inactive</p>
          <p className="text-lg font-semibold text-danger">
            {courses.filter(c => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* Error state with fade animation */}
      {error && (
        <div 
          className="rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger animate-fade-in"
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <FilterBar />

      {/* Table */}
      <CourseTable
        courses={courses}
        isLoading={loading.table}
        onDelete={handleDelete}
        onRestore={handleRestoreCourse}
        onAssign={openAssignModal}
        actionLoading={actionLoading}
      />

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
        isLoading={Boolean(actionLoading[`faculty-${selectedCourse?.id}`])}
      />

      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleDeleteAction}
        courseName={selectedCourse?.name || ""}
        isLoading={Boolean(actionLoading[`delete-${selectedCourse?.id}`])}
        isActive={selectedCourse?.isActive || false}
        loadingAction={
          actionLoading[`delete-${selectedCourse?.id}`]?.type || null
        }
      />
    </div>
  );
} 