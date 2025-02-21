"use client";
import { useTemplateStatsStore } from "@/store/template-stats.store";
import { FiChevronDown } from "react-icons/fi";

export default function TemplateSelector() {
  const { 
    templates, 
    selectedTemplateId, 
    setSelectedTemplate, 
    fetchStats,
    loading 
  } = useTemplateStatsStore();

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    await fetchStats(templateId);
  };

  return (
    <div className="mb-6">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        Select Template
      </label>
      <div className="relative">
        <select
          value={selectedTemplateId || ""}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={loading.templates}
          className="w-full appearance-none rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
        >
          <option value="">Select a template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <FiChevronDown className="h-5 w-5" />
        </span>
      </div>
      {loading.templates && (
        <p className="mt-2 text-sm text-gray-500">Loading templates...</p>
      )}
    </div>
  );
} 