import { create } from "zustand";
import { templateService } from "@/services/template.service";
import { FileTemplate } from "@/types/file-templates/template.types";
import { TemplateStats } from "@/types/file-templates/template-stats.types";

interface TemplateStatsState {
  // Data
  templates: FileTemplate[];
  selectedTemplateId: string | null;
  stats: TemplateStats | null;
  
  // UI States
  loading: {
    templates: boolean;
    stats: boolean;
  };
  error: string | null;

  // Actions
  fetchTemplates: () => Promise<void>;
  fetchStats: (templateId: string) => Promise<void>;
  setSelectedTemplate: (templateId: string | null) => void;
  clearStats: () => void;
}

export const useTemplateStatsStore = create<TemplateStatsState>((set, get) => ({
  // Initial state
  templates: [],
  selectedTemplateId: null,
  stats: null,
  loading: {
    templates: false,
    stats: false,
  },
  error: null,

  // Actions
  fetchTemplates: async () => {
    try {
      set({ loading: { ...get().loading, templates: true }, error: null });
      const response = await templateService.getTemplates();
      set({ 
        templates: response.data,
        loading: { ...get().loading, templates: false },
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch templates",
        loading: { ...get().loading, templates: false },
      });
    }
  },

  fetchStats: async (templateId: string) => {
    try {
      set({ loading: { ...get().loading, stats: true }, error: null });
      const stats = await templateService.getTemplateStats(templateId);
      set({ 
        stats,
        loading: { ...get().loading, stats: false },
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch template statistics",
        loading: { ...get().loading, stats: false },
      });
    }
  },

  setSelectedTemplate: (templateId: string | null) => {
    set({ selectedTemplateId: templateId });
  },

  clearStats: () => {
    set({ stats: null, selectedTemplateId: null });
  },
})); 