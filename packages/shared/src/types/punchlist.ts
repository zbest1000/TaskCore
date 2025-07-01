import { BaseEntity, Priority } from './common';
import { User } from './user';
import { Project } from './project';
import { FileUpload } from './common';

export interface PunchList extends BaseEntity {
  organizationId: string;
  projectId: string;
  project?: Project;
  name: string;
  description?: string;
  status: PunchListStatus;
  priority: Priority;
  location?: Location;
  category: string;
  phase?: string;
  trade?: string;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator?: User;
  reviewerId?: string;
  reviewer?: User;
  dueDate?: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  items: PunchListItem[];
  tags: string[];
  referenceDocuments?: DocumentReference[];
  attachments?: FileUpload[];
  comments?: PunchListComment[];
  customFields: { [key: string]: any };
}

export type PunchListStatus = 'open' | 'in_progress' | 'pending_review' | 'completed' | 'verified' | 'rejected';

export interface Location {
  building?: string;
  floor?: string;
  room?: string;
  zone?: string;
  coordinates?: {
    x: number;
    y: number;
    z?: number;
  };
  address?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PunchListItem extends BaseEntity {
  punchListId: string;
  title: string;
  description: string;
  status: PunchItemStatus;
  priority: Priority;
  category: string;
  location?: Location;
  assigneeId?: string;
  assignee?: User;
  dueDate?: Date;
  completedAt?: Date;
  verifiedAt?: Date;
  position: number;
  photos: PunchPhoto[];
  annotations: PhotoAnnotation[];
  ocrResults?: OCRResult[];
  referenceSection?: DocumentSection;
  linkedTaskId?: string;
  linkedPageId?: string;
  customFields: { [key: string]: any };
}

export type PunchItemStatus = 'open' | 'in_progress' | 'completed' | 'verified' | 'rejected' | 'deferred';

export interface PunchPhoto extends BaseEntity {
  punchListItemId: string;
  fileId: string;
  file?: FileUpload;
  caption?: string;
  isMain: boolean;
  annotations: PhotoAnnotation[];
  ocrResult?: OCRResult;
  metadata: PhotoMetadata;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  exif?: { [key: string]: any };
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  camera?: string;
}

export interface PhotoAnnotation {
  id: string;
  type: AnnotationType;
  position: AnnotationPosition;
  content: string;
  color?: string;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
}

export type AnnotationType = 'arrow' | 'circle' | 'rectangle' | 'text' | 'highlight' | 'measurement';

export interface AnnotationPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  points?: { x: number; y: number }[];
}

export interface OCRResult {
  id: string;
  photoId: string;
  text: string;
  confidence: number;
  boundingBoxes: OCRBoundingBox[];
  language: string;
  processedAt: Date;
  engine: string;
  version: string;
}

export interface OCRBoundingBox {
  text: string;
  confidence: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DocumentReference {
  id: string;
  name: string;
  type: 'drawing' | 'specification' | 'plan' | 'manual' | 'contract' | 'other';
  url?: string;
  fileId?: string;
  section?: DocumentSection;
  version?: string;
  pageNumber?: number;
}

export interface DocumentSection {
  id: string;
  documentId: string;
  sectionNumber: string;
  title: string;
  content?: string;
  pageRange?: {
    start: number;
    end: number;
  };
}

export interface PunchListComment extends BaseEntity {
  punchListId: string;
  punchListItemId?: string;
  userId: string;
  user?: User;
  content: string;
  type: CommentType;
  attachments?: FileUpload[];
  mentions?: string[];
  isSystem: boolean;
  parentCommentId?: string;
  replies?: PunchListComment[];
}

export type CommentType = 'general' | 'issue' | 'clarification' | 'approval' | 'rejection';

export interface PunchListFilter {
  status?: PunchListStatus[];
  priority?: Priority[];
  assigneeIds?: string[];
  creatorIds?: string[];
  categories?: string[];
  phases?: string[];
  trades?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  location?: {
    building?: string;
    floor?: string;
    room?: string;
    zone?: string;
  };
  tags?: string[];
  search?: string;
}

export interface PunchListReport {
  totalItems: number;
  completedItems: number;
  openItems: number;
  overdue: number;
  byStatus: { [key in PunchListStatus]: number };
  byPriority: { [key in Priority]: number };
  byCategory: { [key: string]: number };
  byAssignee: { [key: string]: number };
  averageCompletionTime: number;
  trends: {
    period: string;
    created: number;
    completed: number;
  }[];
}