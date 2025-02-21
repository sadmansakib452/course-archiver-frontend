import { create } from "zustand";
import {
  FileTemplate,
  TemplateState,
  TemplateFilters,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateResponse,
} from "@/types/file-templates/template.types";
import { TEMPLATE_CONFIG } from "@/config/template.config";
import { TEMPLATE_MESSAGES } from "@/constants/template.constants";
import { templateService } from "@/services/template.service";

interface TemplateStore extends TemplateState {
  // Actions
  fetchTemplates: (filters?: TemplateFilters) => Promise<void>;
  createTemplate: (data: CreateTemplateInput) => Promise<void>;
  updateTemplate: (id: string, data: UpdateTemplateInput) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setFilters: (filters: TemplateFilters) => void;
  clearFilters: () => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // Initial state
  templates: [],
  loading: {
    table: false,
    action: false,
  },
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: TEMPLATE_CONFIG.pagination.defaultLimit,
    totalPages: 0,
  },
  filters: {
    status: true,
  },

  // Actions
  fetchTemplates: async (filters?: TemplateFilters) => {
    try {
      set({ loading: { ...get().loading, table: true }, error: null });
      const response = await templateService.getTemplates(filters);
      set({
        templates: response.data,
        pagination: response.meta,
        loading: { ...get().loading, table: false },
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch templates",
        loading: { ...get().loading, table: false },
      });
    }
  },

  // Implementing remaining required actions
  createTemplate: async (data: CreateTemplateInput) => {
    try {
      set({ loading: { ...get().loading, action: true }, error: null });
      const response = await templateService.createTemplate(data);
      set({
        templates: [...get().templates, response],
        loading: { ...get().loading, action: false },
      });
    } catch (error: any) {
      set({
        error: error.message || TEMPLATE_MESSAGES.CREATE.ERROR,
        loading: { ...get().loading, action: false },
      });
      throw error;
    }
  },

  updateTemplate: async (id: string, data: UpdateTemplateInput) => {
    try {
      set({ loading: { ...get().loading, action: true }, error: null });
      const response = await templateService.updateTemplate(id, data);
      set({
        templates: get().templates.map((template) =>
          template.id === id ? response : template,
        ),
        loading: { ...get().loading, action: false },
      });
    } catch (error: any) {
      set({
        error: error.message || TEMPLATE_MESSAGES.UPDATE.ERROR,
        loading: { ...get().loading, action: false },
      });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      set({ loading: { ...get().loading, action: true }, error: null });
      await templateService.deleteTemplate(id);
      set({
        templates: get().templates.filter((template) => template.id !== id),
        loading: { ...get().loading, action: false },
      });
    } catch (error: any) {
      set({
        error: error.message || TEMPLATE_MESSAGES.DELETE.ERROR,
        loading: { ...get().loading, action: false },
      });
      throw error;
    }
  },

  toggleStatus: async (id: string) => {
    try {
      set({ loading: { ...get().loading, action: true }, error: null });
      const response = await templateService.toggleTemplateStatus(id);
      set({
        templates: get().templates.map((template) =>
          template.id === id ? response : template,
        ),
        loading: { ...get().loading, action: false },
      });
    } catch (error: any) {
      set({
        error: error.message || TEMPLATE_MESSAGES.STATUS.ERROR,
        loading: { ...get().loading, action: false },
      });
      throw error;
    }
  },

  setFilters: (filters: TemplateFilters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({ filters: {} });
  },
}));
