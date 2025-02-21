import { axiosInstance } from "@/lib/axios";
import { TEMPLATE_CONFIG } from "@/config/template.config";
import {
  FileTemplate,
  TemplateResponse,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilters,
} from "@/types/file-templates/template.types";
import {
  TemplateStats,
  TemplateStatsResponse,
} from "@/types/file-templates/template-stats.types";
import { TEMPLATE_MESSAGES } from "@/constants/template.constants";

class TemplateService {
  async getTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      // Only create params if filters exist
      const params = filters ? new URLSearchParams() : undefined;

      if (filters) {
        // Only add non-pagination filters
        if (filters.search) params?.append("search", filters.search);
        if (typeof filters.status === "boolean")
          params?.append("status", filters.status.toString());
      }

      const response = await axiosInstance.get<TemplateResponse>(
        TEMPLATE_CONFIG.endpoints.list,
        params ? { params } : undefined,
      );

      return response.data;
    } catch (error: any) {
      console.error("TemplateService: Fetch failed:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch templates",
      );
    }
  }

  async createTemplate(data: CreateTemplateInput): Promise<FileTemplate> {
    try {
      const response = await axiosInstance.post<TemplateResponse>(
        TEMPLATE_CONFIG.endpoints.create,
        data,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || TEMPLATE_MESSAGES.CREATE.ERROR,
        );
      }

      return response.data.data[0];
    } catch (error: any) {
      console.error("TemplateService: Create failed:", error);
      throw new Error(
        error.response?.data?.message || TEMPLATE_MESSAGES.CREATE.ERROR,
      );
    }
  }

  async updateTemplate(
    id: string,
    data: UpdateTemplateInput,
  ): Promise<FileTemplate> {
    try {
      const response = await axiosInstance.patch<{
        success: boolean;
        message: string;
        data: FileTemplate;
      }>(TEMPLATE_CONFIG.endpoints.update(id), data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || TEMPLATE_MESSAGES.UPDATE.ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      console.error("TemplateService: Update failed:", error);
      throw new Error(
        error.response?.data?.message || TEMPLATE_MESSAGES.UPDATE.ERROR,
      );
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
      }>(TEMPLATE_CONFIG.endpoints.delete(id));

      if (!response.data.success) {
        throw new Error(
          response.data.message || TEMPLATE_MESSAGES.DELETE.ERROR,
        );
      }
    } catch (error: any) {
      console.error("TemplateService: Delete failed:", error);
      throw new Error(
        error.response?.data?.message || TEMPLATE_MESSAGES.DELETE.ERROR,
      );
    }
  }

  async toggleTemplateStatus(id: string): Promise<FileTemplate> {
    try {
      const response = await axiosInstance.patch<{
        success: boolean;
        message: string;
        data: FileTemplate;
      }>(TEMPLATE_CONFIG.endpoints.toggleStatus(id));

      if (!response.data.success) {
        throw new Error(
          response.data.message || TEMPLATE_MESSAGES.STATUS.ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      console.error("TemplateService: Toggle status failed:", error);
      throw new Error(
        error.response?.data?.message || TEMPLATE_MESSAGES.STATUS.ERROR,
      );
    }
  }

  async getTemplateStats(id: string): Promise<TemplateStats> {
    try {
      const response = await axiosInstance.get<TemplateStatsResponse>(
        TEMPLATE_CONFIG.endpoints.stats(id),
      );

      if (!response.data.success) {
        throw new Error(response.data.message || TEMPLATE_MESSAGES.STATS.ERROR);
      }

      return response.data.data;
    } catch (error: any) {
      console.error("TemplateService: Get stats failed:", error);
      throw new Error(
        error.response?.data?.message || TEMPLATE_MESSAGES.STATS.ERROR,
      );
    }
  }
}

// Export a single instance
export const templateService = new TemplateService();
