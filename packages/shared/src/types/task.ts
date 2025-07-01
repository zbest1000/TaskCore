// Re-export task types from project module for convenience
export {
  Task,
  TaskStatus,
  TaskDependency,
  TaskComment,
  TaskFilter,
  TaskView,
  DependencyType
} from './project';

import { BaseEntity } from './common';
import { User } from './user';

export interface TaskActivity extends BaseEntity {
  taskId: string;
  userId: string;
  user?: User;
  action: TaskAction;
  oldValue?: any;
  newValue?: any;
  description: string;
  isSystem: boolean;
}

export type TaskAction =
  | 'created'
  | 'updated'
  | 'assigned'
  | 'unassigned'
  | 'status_changed'
  | 'priority_changed'
  | 'due_date_changed'
  | 'commented'
  | 'attachment_added'
  | 'attachment_removed'
  | 'dependency_added'
  | 'dependency_removed'
  | 'moved'
  | 'completed'
  | 'reopened'
  | 'deleted';

export interface TaskTemplate extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  taskData: Partial<Task>;
  subtasks: Partial<Task>[];
  isPublic: boolean;
  category: string;
  tags: string[];
  usageCount: number;
  createdBy: string;
  creator?: User;
}

export interface TimeEntry extends BaseEntity {
  taskId: string;
  userId: string;
  user?: User;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  isRunning: boolean;
  billable: boolean;
  rate?: number;
  tags: string[];
}

export interface TaskNotification extends BaseEntity {
  userId: string;
  taskId: string;
  task?: Task;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  data?: any;
}

export type NotificationType =
  | 'task_assigned'
  | 'task_due_soon'
  | 'task_overdue'
  | 'task_completed'
  | 'comment_added'
  | 'mention'
  | 'dependency_updated'
  | 'status_changed';