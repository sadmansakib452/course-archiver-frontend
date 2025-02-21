import * as z from "zod";
import { FILE_SIZE_LIMITS } from "@/types/file-templates/template.types";
import { formatBytes } from "@/utils/format.utils";

export const updateTemplateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  isRequired: z.boolean().optional(),
  fileTypes: z.array(z.string()).min(1, "At least one file type must be selected").optional(),
  maxSize: z.number()
    .min(FILE_SIZE_LIMITS.MIN, `Min size is ${formatBytes(FILE_SIZE_LIMITS.MIN)}`)
    .max(FILE_SIZE_LIMITS.MAX, `Max size is ${formatBytes(FILE_SIZE_LIMITS.MAX)}`)
    .optional(),
}); 