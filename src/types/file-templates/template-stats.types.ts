// Template stats types
export interface TemplateUsage {
  courseId: string;
  courseName: string;
  courseCode: string;
  userId: string;
  userName: string;
  usedAt: string;
}

export interface TemplateStats {
  id: string;
  name: string;
  description: string;
  status: boolean;
  maxSize: number;
  usageCount: number;
  recentUsage: TemplateUsage[];
  isRequired: boolean;
  fileTypes: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateStatsResponse {
  success: boolean;
  message?: string;
  data: TemplateStats;
} 