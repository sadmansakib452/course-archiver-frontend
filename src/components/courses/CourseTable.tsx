"use client";
import { Course, COURSE_TABLE_COLUMNS } from "@/types/course.types";
import { FiEdit2, FiUserPlus, FiTrash2, FiRefreshCw, FiLoader } from "react-icons/fi";

interface CourseTableProps {
  isLoading: boolean;
  courses: Course[];
  onDelete: (course: Course) => void;
  onRestore: (course: Course) => void;
  onAssign: (course: Course) => void;
  onEdit: (course: Course) => void;
  actionLoading: {
    [key: string]: {
      type: "deactivate" | "delete" | "restore" | "update" | "assign";
      courseId: string;
    };
  };
}

export default function CourseTable({
  isLoading,
  courses,
  onDelete,
  onRestore,
  onAssign,
  onEdit,
  actionLoading,
}: CourseTableProps) {
  // Define renderTableRow before using it
  const renderTableRow = (course: Course) => (
    <tr
      key={course.id}
      className="border-b border-stroke/10 transition-colors duration-200 hover:bg-black/[0.02] dark:border-strokedark/10 dark:hover:bg-white/[0.02]"
    >
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-black dark:text-white">
          {course.code}
        </p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-black dark:text-white">
          {course.name}
        </p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-black/70 dark:text-white/70">
          {course.section}
        </p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-black/70 dark:text-white/70">
          {course.semester}
        </p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-black/70 dark:text-white/70">
          {course.year}
        </p>
      </td>
      <td className="px-5 py-4">
        {course.faculty ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black dark:text-white">
              {course.faculty.name}
            </span>
            <span className="text-xs text-black/50 dark:text-white/50">
              ({course.faculty.shortName})
            </span>
          </div>
        ) : (
          <span className="text-sm font-medium text-meta-1">Not Assigned</span>
        )}
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            course.isActive
              ? "bg-success/10 text-success ring-1 ring-success/20"
              : "bg-danger/10 text-danger ring-1 ring-danger/20"
          }`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              course.isActive ? "bg-success" : "bg-danger"
            }`}
          ></span>
          {course.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {course.isActive ? (
            <button
              className="group relative rounded-lg p-2 hover:bg-danger/10"
              onClick={() => onDelete(course)}
              disabled={Boolean(actionLoading[`delete-${course.id}`])}
            >
              <FiTrash2 className="h-4 w-4 text-danger/70 group-hover:text-danger" />
            </button>
          ) : (
            <button
              className="group relative rounded-lg p-2 hover:bg-success/10"
              onClick={() => onRestore(course)}
              disabled={Boolean(actionLoading[`restore-${course.id}`])}
            >
              <FiRefreshCw className="h-4 w-4 text-success/70 group-hover:text-success" />
            </button>
          )}
          <button
            onClick={() => onEdit(course)}
            disabled={!!actionLoading[`update-${course.id}`]}
            className="text-primary hover:text-primary/80 disabled:opacity-50"
            title="Edit Course"
          >
            {actionLoading[`update-${course.id}`]?.type === 'update' ? (
              <FiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <FiEdit2 className="h-5 w-5" />
            )}
          </button>
          <button
            className="group relative rounded-lg p-2 hover:bg-primary/10"
            onClick={() => onAssign(course)}
            disabled={Boolean(actionLoading[`faculty-${course.id}`])}
          >
            <FiUserPlus className="h-4 w-4 text-primary/70 group-hover:text-primary" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="relative mx-auto w-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Table Container */}
      <div className="min-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              {COURSE_TABLE_COLUMNS.map((column) => (
                <th
                  key={column.id}
                  className="border-b border-stroke/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/70 dark:border-strokedark/10 dark:text-white/70"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan={COURSE_TABLE_COLUMNS.length}
                  className="px-5 py-12 text-center text-sm text-black/50 dark:text-white/50"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <p className="text-base font-medium">No courses found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map(renderTableRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
