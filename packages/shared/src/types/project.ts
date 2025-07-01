import { BaseEntity, Priority, Status } from './common';
import { User } from './user';
import { FileUpload } from './common';

export interface Project extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  ownerId: string;
  owner?: User;
  memberIds: string[];
  members?: ProjectMember[];
  settings: ProjectSettings;
  progress: number;
  taskCount?: number;
  completedTaskCount?: number;
  tags: string[];
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface ProjectSettings {
  visibility: 'public' | 'private';
  allowComments: boolean;
  enableTimeTracking: boolean;
  enableSubtasks: boolean;
  taskStatusFlow: TaskStatus[];
  customFields: { [key: string]: any };
  views: {
    kanban: boolean;
    list: boolean;
    calendar: boolean;
    timeline: boolean;
    board: boolean;
  };
}

export interface ProjectMember extends BaseEntity {
  projectId: string;
  userId: string;
  user?: User;
  role: ProjectRole;
  permissions: string[];
  addedBy: string;
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Section extends BaseEntity {
  projectId: string;
  name: string;
  description?: string;
  position: number;
  color?: string;
  taskCount?: number;
}

export interface Task extends BaseEntity {
  projectId: string;
  sectionId?: string;
  section?: Section;
  parentTaskId?: string;
  parentTask?: Task;
  subtasks?: Task[];
  name: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator?: User;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  position: number;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  dependencies?: TaskDependency[];
  dependents?: TaskDependency[];
  comments?: TaskComment[];
  attachments?: FileUpload[];
  customFields: { [key: string]: any };
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'blocked' | 'completed' | 'cancelled';

export interface TaskDependency extends BaseEntity {
  taskId: string;
  dependsOnTaskId: string;
  dependsOnTask?: Task;
  type: DependencyType;
}

export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';

export interface TaskComment extends BaseEntity {
  taskId: string;
  userId: string;
  user?: User;
  content: string;
  isSystem: boolean;
  mentions?: string[];
  attachments?: FileUpload[];
  parentCommentId?: string;
  replies?: TaskComment[];
}

export interface TaskFilter {
  assigneeIds?: string[];
  status?: TaskStatus[];
  priority?: Priority[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
  sectionIds?: string[];
  search?: string;
}

export interface TaskView {
  id: string;
  name: string;
  type: 'kanban' | 'list' | 'calendar' | 'timeline' | 'board';
  filters: TaskFilter;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isDefault: boolean;
  isPublic: boolean;
}