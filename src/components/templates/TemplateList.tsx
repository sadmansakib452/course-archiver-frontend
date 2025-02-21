"use client";
import { useEffect } from "react";
import { useTemplateStore } from "@/store/template.store";
import TemplateTable from "./TemplateTable";
import FilterBar from "./filters/FilterBar";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function TemplateList() {
  const { fetchTemplates, templates, loading, filters } = useTemplateStore();

  useEffect(() => {
    fetchTemplates(filters);
  }, [fetchTemplates, filters]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          File Templates
        </h4>
        <Link
          href={ROUTES.COURSE_FILES.TEMPLATES_ADD}
          className="inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <FiPlus className="h-5 w-5" />
          Add Template
        </Link>
      </div>

      <FilterBar />
      <TemplateTable />
    </div>
  );
} 