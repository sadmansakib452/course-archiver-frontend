"use client";
import { useEffect } from "react";
import { useTemplateStatsStore } from "@/store/template-stats.store";
import TemplateSelector from "./TemplateSelector";
import StatsOverview from "./StatsOverview";
import RecentUsageTable from "./RecentUsageTable";

export default function TemplateStats() {
  const { fetchTemplates, error } = useTemplateStatsStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Template Statistics
        </h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          View usage statistics for file templates
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-danger/10 p-4 text-danger">
          {error}
        </div>
      )}

      <TemplateSelector />
      <StatsOverview />
      <RecentUsageTable />
    </div>
  );
} 