import { z } from 'zod';

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const StatusSchema = z.enum(['active', 'inactive', 'archived', 'draft']);

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const SearchFilterSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  status: z.array(z.string()).optional(),
  priority: z.array(PrioritySchema).optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
  projectIds: z.array(z.string().uuid()).optional(),
});

export const FileUploadSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  originalFilename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
  uploadedBy: z.string().uuid(),
  createdAt: z.date(),
});

export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export const UUIDSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const URLSchema = z.string().url();
export const SlugSchema = z.string().regex(/^[a-z0-9-]{1,50}$/);
export const UsernameSchema = z.string().regex(/^[a-zA-Z0-9_-]{3,30}$/);
export const PasswordSchema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/);
export const HexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
export const PhoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/);

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.any().optional(),
    }).optional(),
    meta: z.object({
      timestamp: z.date(),
      requestId: z.string(),
    }).optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
      totalPages: z.number().int(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });