import { BaseEntity } from './common';
import { User } from './user';
import { FileUpload } from './common';

export interface KnowledgePage extends BaseEntity {
  organizationId: string;
  parentId?: string;
  parent?: KnowledgePage;
  children?: KnowledgePage[];
  title: string;
  slug: string;
  content: PageBlock[];
  status: PageStatus;
  visibility: PageVisibility;
  authorId: string;
  author?: User;
  collaborators: PageCollaborator[];
  tags: string[];
  coverImage?: string;
  icon?: string;
  position: number;
  templateId?: string;
  isTemplate: boolean;
  metadata: PageMetadata;
  version: number;
  publishedAt?: Date;
}

export type PageStatus = 'draft' | 'published' | 'archived';
export type PageVisibility = 'public' | 'organization' | 'team' | 'private';

export interface PageMetadata {
  wordCount: number;
  readTime: number;
  lastEditedBy: string;
  lastEditedAt: Date;
  publishedBy?: string;
  viewCount: number;
  likes: number;
  bookmarks: number;
}

export interface PageCollaborator {
  userId: string;
  user?: User;
  permission: 'view' | 'comment' | 'edit' | 'admin';
  addedAt: Date;
  addedBy: string;
}

export interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  properties?: { [key: string]: any };
  children?: PageBlock[];
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BlockType = 
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'todo'
  | 'quote'
  | 'code'
  | 'divider'
  | 'image'
  | 'video'
  | 'file'
  | 'embed'
  | 'table'
  | 'database'
  | 'callout'
  | 'toggle'
  | 'column'
  | 'link'
  | 'bookmark'
  | 'breadcrumb'
  | 'template';

export interface PageTemplate extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  category: string;
  blocks: PageBlock[];
  previewImage?: string;
  isPublic: boolean;
  authorId: string;
  author?: User;
  usageCount: number;
  tags: string[];
}

export interface PageComment extends BaseEntity {
  pageId: string;
  blockId?: string;
  userId: string;
  user?: User;
  content: string;
  mentions?: string[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  parentCommentId?: string;
  replies?: PageComment[];
}

export interface PageVersion extends BaseEntity {
  pageId: string;
  versionNumber: number;
  title: string;
  content: PageBlock[];
  authorId: string;
  author?: User;
  changesSummary: string;
  isPublished: boolean;
}

export interface PageSearch {
  query: string;
  organizationId: string;
  authorIds?: string[];
  tags?: string[];
  status?: PageStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface PageSearchResult {
  page: KnowledgePage;
  highlights: {
    title?: string;
    content?: string[];
  };
  relevanceScore: number;
}