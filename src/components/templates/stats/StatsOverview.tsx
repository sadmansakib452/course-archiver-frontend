"use client";
import { useTemplateStatsStore } from "@/store/template-stats.store";
import { formatBytes } from "@/utils/format.utils";
import { formatDate } from "@/utils/date.utils";
import { FiFileText, FiUsers, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function StatsOverview() {
  const { stats, loading } = useTemplateStatsStore();

  if (loading.stats) {
    return (
      <div className="mb-6 rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Template Info Card */}
      <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary/10">
            <FiFileText className="fill-primary text-primary h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">
              {stats.name}
            </h4>
            <p className="text-sm font-medium">{stats.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status</p>
            <div className="flex items-center gap-2">
              {stats.status ? (
                <>
                  <FiCheckCircle className="text-success" />
                  <span className="text-success">Active</span>
                </>
              ) : (
                <>
                  <FiXCircle className="text-danger" />
                  <span className="text-danger">Inactive</span>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Max Size</p>
            <span className="text-black dark:text-white">
              {formatBytes(stats.maxSize)}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Stats Card */}
      <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success/10">
            <FiUsers className="fill-success text-success h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-medium">Total Usage</span>
            <h4 className="text-2xl font-bold text-black dark:text-white">
              {stats.usageCount}
            </h4>
          </div>
        </div>
      </div>

      {/* File Types Card */}
      <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <span className="text-sm font-medium">Allowed File Types</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {stats.fileTypes.map((type) => (
            <span
              key={type}
              className="inline-block rounded bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Last Updated Card */}
      <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning/10">
            <FiClock className="fill-warning text-warning h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-medium">Last Updated</span>
            <p className="text-black dark:text-white">
              {formatDate(stats.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 