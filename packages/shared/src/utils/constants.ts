export const APP_NAME = 'TaskCore';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  ORGANIZATIONS: '/api/organizations',
  PROJECTS: '/api/projects',
  TASKS: '/api/tasks',
  KNOWLEDGE: '/api/knowledge',
  PUNCH_LISTS: '/api/punch-lists',
  SEARCH: '/api/search',
  INTEGRATIONS: '/api/integrations',
  AI_ASSISTANT: '/api/ai-assistant',
  FILES: '/api/files',
  NOTIFICATIONS: '/api/notifications',
} as const;

export const WEBSOCKET_EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_ASSIGNED: 'task:assigned',
  COMMENT_ADDED: 'comment:added',
  PROJECT_UPDATED: 'project:updated',
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
  PUNCH_LIST_UPDATED: 'punchlist:updated',
  PAGE_UPDATED: 'page:updated',
  INTEGRATION_SYNC: 'integration:sync',
} as const;

export const ROLES = {
  ORGANIZATION: {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    GUEST: 'guest',
  },
  PROJECT: {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer',
  },
} as const;

export const PERMISSIONS = {
  ORGANIZATIONS: {
    CREATE: 'organizations:create',
    READ: 'organizations:read',
    UPDATE: 'organizations:update',
    DELETE: 'organizations:delete',
    MANAGE_MEMBERS: 'organizations:manage_members',
  },
  PROJECTS: {
    CREATE: 'projects:create',
    READ: 'projects:read',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
    MANAGE_MEMBERS: 'projects:manage_members',
  },
  TASKS: {
    CREATE: 'tasks:create',
    READ: 'tasks:read',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
    ASSIGN: 'tasks:assign',
  },
  KNOWLEDGE: {
    CREATE: 'knowledge:create',
    READ: 'knowledge:read',
    UPDATE: 'knowledge:update',
    DELETE: 'knowledge:delete',
    PUBLISH: 'knowledge:publish',
  },
  PUNCH_LISTS: {
    CREATE: 'punch_lists:create',
    READ: 'punch_lists:read',
    UPDATE: 'punch_lists:update',
    DELETE: 'punch_lists:delete',
    VERIFY: 'punch_lists:verify',
  },
} as const;

export const FILE_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_DOCUMENT_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
} as const;

export const TASK_STATUSES = [
  'todo',
  'in_progress',
  'review',
  'blocked',
  'completed',
  'cancelled',
] as const;

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const PUNCH_LIST_STATUSES = [
  'open',
  'in_progress',
  'pending_review',
  'completed',
  'verified',
  'rejected',
] as const;

export const PAGE_BLOCK_TYPES = [
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'bulletList',
  'numberedList',
  'todo',
  'quote',
  'code',
  'divider',
  'image',
  'video',
  'file',
  'embed',
  'table',
  'database',
  'callout',
  'toggle',
  'column',
  'link',
  'bookmark',
  'breadcrumb',
  'template',
] as const;

export const INTEGRATION_TYPES = [
  'slack',
  'github',
  'google_drive',
  'dropbox',
  'onedrive',
  'trello',
  'jira',
  'asana',
  'email',
  'calendar',
  'webhook',
  'zapier',
] as const;

export const TIME_ZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
] as const;