"use client";
import { useTemplateStatsStore } from "@/store/template-stats.store";
import { formatDate } from "@/utils/date.utils";
import { FiBook, FiUser } from "react-icons/fi";

const TABLE_HEADERS = [
  { id: 'course', label: 'Course' },
  { id: 'user', label: 'User' },
  { id: 'date', label: 'Used At' },
] as const;

export default function RecentUsageTable() {
  const { stats, loading } = useTemplateStatsStore();

  if (loading.stats) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!stats?.recentUsage?.length) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          Recent Usage
        </h3>
        <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          No recent usage found
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
        Recent Usage
      </h3>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.id}
                  className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentUsage.map((usage, index) => (
              <tr key={`${usage.courseId}-${index}`}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FiBook className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {usage.courseName}
                      </h5>
                      <p className="text-sm">{usage.courseCode}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <FiUser className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-black dark:text-white">
                      {usage.userName}
                    </span>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatDate(usage.usedAt)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 