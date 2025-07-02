export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'active' | 'inactive' | 'archived' | 'draft';

export interface SearchFilter {
  query?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  status?: string[];
  priority?: Priority[];
  assigneeIds?: string[];
  projectIds?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface FileUpload {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  entityType: string;
  entityId: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  organizationId?: string;
  projectId?: string;
}