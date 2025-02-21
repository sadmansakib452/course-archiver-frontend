"use client";
import { useState } from "react";
import { useCourseStore } from "@/store/course.store";
import {
  Course,
  COURSE_TABLE_COLUMNS,
  CourseFilters,
  CourseDeleteAction,
  UpdateCourseInput,
  CreateCourseInput,
  CourseActionType,
} from "@/types/course.types";
import {
  FiEdit2,
  FiUserPlus,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import AssignFacultyModal from "./AssignFacultyModal";
import DeleteCourseModal from "./DeleteCourseModal";
import FilterBar from "./filters/FilterBar";
import CourseTable from "./CourseTable";
import EditCourseModal from "./EditCourseModal";
import AddCourseModal from "./AddCourseModal";
import { Faculty } from "@/types/faculty.types";

// Add specific loading state types
interface ActionLoadingState {
  type: "deactivate" | "delete" | "restore" | "assign" | "update";
  courseId: string;
}

export default function CourseList() {
  const {
    courses,
    loading, // Use granular loading state
    error,
    toggleCourseStatus,
    assignFaculty,
    fetchCourses,
    setFilters,
    deactivateCourse,
    deleteCoursePermantly,
    restoreCourse,
    refreshCourses,
    updateCourse,
    createCourse,
  } = useCourseStore();

  const [actionLoading, setActionLoading] = useState<{
    [key: string]: ActionLoadingState;
  }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle status toggle
  const handleStatusToggle = async (courseId: string) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        [`status-${courseId}`]: { type: "deactivate", courseId },
      }));
      await toggleCourseStatus(courseId);
      toast.success("Course status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update course status");
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[`status-${courseId}`];
        return newState;
      });
    }
  };

  // Handle faculty assignment
  const handleFacultyAssign = async (facultyId: string) => {
    if (!selectedCourse) return;

    try {
      setActionLoading((prev) => ({
        ...prev,
        [`faculty-${selectedCourse.id}`]: {
          type: "assign",
          courseId: selectedCourse.id,
        },
      }));

      await assignFaculty(selectedCourse.id, facultyId);
      toast.success("Faculty assigned successfully");
      setIsAssignModalOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign faculty");
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[`faculty-${selectedCourse.id}`];
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

    const actionKey = `delete-${selectedCourse.id}`;

    try {
      setActionLoading((prev) => ({
        ...prev,
        [actionKey]: {
          type: action as CourseActionType, // Ensure type safety
          courseId: selectedCourse.id,
        },
      }));

      if (action === "delete") {
        await deleteCoursePermantly(selectedCourse.id);
      } else if (action === "deactivate") {
        await deactivateCourse(selectedCourse.id);
      } else if (action === "restore") {
        await restoreCourse(selectedCourse.id);
      }

      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
      toast.success(`Course ${action}d successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading((prev) => {
        const { [actionKey]: _, ...rest } = prev;
        return rest;
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
      setActionLoading((prev) => ({
        ...prev,
        [`restore-${course.id}`]: {
          type: "restore",
          courseId: course.id,
        },
      }));

      await restoreCourse(course.id);
      toast.success(`Course "${course.name}" has been restored`);
      await refreshCourses();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to restore course";
      toast.error(errorMessage);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[`restore-${course.id}`];
        return newState;
      });
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: UpdateCourseInput) => {
    if (!selectedCourse) return;

    try {
      setActionLoading((prev) => ({
        ...prev,
        [`update-${selectedCourse.id}`]: {
          type: "update",
          courseId: selectedCourse.id,
        },
      }));

      await updateCourse(selectedCourse.id, data);
      toast.success("Course updated successfully");
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update course");
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[`update-${selectedCourse.id}`];
        return newState;
      });
    }
  };

  // Add new handler for course creation
  const handleCreate = async (data: CreateCourseInput) => {
    try {
      await createCourse(data);
      toast.success("Course created successfully");
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create course");
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
    <div className="animate-fade-in space-y-6">
      {/* Page Header with slide animation */}
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Course Management
          </h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Manage your courses, assign faculty, and track course status
          </p>
        </div>

        {/* Add Course Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          <FiPlus className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {/* Quick Stats with scale animation */}
      <div
        className="flex items-center gap-4 rounded-lg border border-stroke/10 bg-white/50 px-4 py-2 dark:border-strokedark/10 dark:bg-meta-4/20"
        style={{ animation: "scaleIn 0.3s ease-out" }}
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
            {courses.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-black/60 dark:text-white/60">Inactive</p>
          <p className="text-lg font-semibold text-danger">
            {courses.filter((c) => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* Error state with fade animation */}
      {error && (
        <div className="animate-fade-in rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
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
        onEdit={handleEdit}
        actionLoading={actionLoading}
      />

      <AssignFacultyModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedCourse(null);
        }}
        onAssign={handleFacultyAssign}
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

      {selectedCourse && (
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
          }}
          onUpdate={handleUpdate}
          course={selectedCourse}
          isLoading={!!actionLoading[`update-${selectedCourse.id}`]}
        />
      )}

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreate}
        isLoading={!!actionLoading.create}
      />
    </div>
  );
}
