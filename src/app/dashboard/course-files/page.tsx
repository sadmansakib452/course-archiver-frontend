import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Files | Course Archiver",
  description: "Manage course files and templates",
};

export default function CourseFilesPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Course Files
        </h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Manage your course files and documentation
        </p>
      </div>

      {/* Cards for different file sections */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Templates Card */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
            File Templates
          </h3>
          <p className="mb-4 text-sm text-black/60 dark:text-white/60">
            Manage and create templates for course documentation
          </p>
          <a
            href="/dashboard/course-files/templates"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            View Templates →
          </a>
        </div>

        {/* Placeholder for future sections */}
        <div className="rounded-lg border border-stroke bg-white/50 p-6 shadow-sm dark:border-strokedark dark:bg-boxdark/50">
          <h3 className="mb-3 text-lg font-semibold text-black/50 dark:text-white/50">
            Course Documents
          </h3>
          <p className="mb-4 text-sm text-black/40 dark:text-white/40">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 