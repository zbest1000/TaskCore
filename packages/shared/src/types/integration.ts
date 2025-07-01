import { BaseEntity } from './common';

export interface Integration extends BaseEntity {
  organizationId: string;
  name: string;
  type: IntegrationType;
  provider: string;
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  isActive: boolean;
  lastSyncAt?: Date;
  errorCount: number;
  lastError?: string;
  settings: IntegrationSettings;
}

export type IntegrationType = 
  | 'slack'
  | 'github'
  | 'google_drive'
  | 'dropbox'
  | 'onedrive'
  | 'trello'
  | 'jira'
  | 'asana'
  | 'email'
  | 'calendar'
  | 'webhook'
  | 'zapier';

export interface IntegrationConfig {
  apiUrl?: string;
  apiVersion?: string;
  scopes: string[];
  webhookUrl?: string;
  syncFrequency?: number;
  customFields?: { [key: string]: any };
}

export interface IntegrationCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  webhookSecret?: string;
  expiresAt?: Date;
  encryptedData?: string;
}

export interface IntegrationSettings {
  autoSync: boolean;
  syncDirection: 'bidirectional' | 'import_only' | 'export_only';
  conflictResolution: 'manual' | 'local_wins' | 'remote_wins' | 'newest_wins';
  fieldMappings: FieldMapping[];
  filters: IntegrationFilter[];
  notifications: {
    onSync: boolean;
    onError: boolean;
    onConflict: boolean;
  };
}

export interface FieldMapping {
  localField: string;
  remoteField: string;
  direction: 'bidirectional' | 'import_only' | 'export_only';
  transform?: string;
  required: boolean;
}

export interface IntegrationFilter {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
  value: string;
  exclude: boolean;
}

export interface AutomationRule extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: Date;
  errorCount: number;
  lastError?: string;
}

export interface AutomationTrigger {
  type: TriggerType;
  event: string;
  source: string;
  filters?: { [key: string]: any };
  schedule?: CronSchedule;
}

export type TriggerType = 
  | 'event'
  | 'schedule'
  | 'webhook'
  | 'manual'
  | 'condition';

export interface CronSchedule {
  expression: string;
  timezone: string;
  enabled: boolean;
}

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'in_list'
  | 'not_in_list';

export interface AutomationAction {
  type: ActionType;
  provider: string;
  config: ActionConfig;
  delay?: number;
  retryCount?: number;
  onError?: 'continue' | 'stop' | 'retry';
}

export type ActionType =
  | 'send_notification'
  | 'create_task'
  | 'update_task'
  | 'assign_task'
  | 'create_project'
  | 'send_email'
  | 'post_to_slack'
  | 'create_github_issue'
  | 'upload_to_drive'
  | 'send_webhook'
  | 'run_script';

export interface ActionConfig {
  [key: string]: any;
}

export interface WebhookEvent {
  id: string;
  integrationId: string;
  source: string;
  eventType: string;
  payload: any;
  headers: { [key: string]: string };
  signature?: string;
  processedAt?: Date;
  status: 'pending' | 'processed' | 'failed' | 'ignored';
  error?: string;
  createdAt: Date;
}

export interface IntegrationLog extends BaseEntity {
  integrationId: string;
  type: 'sync' | 'webhook' | 'action' | 'error';
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  duration?: number;
  success: boolean;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: SyncError[];
  duration: number;
  startedAt: Date;
  completedAt: Date;
}

export interface SyncError {
  recordId?: string;
  field?: string;
  message: string;
  code?: string;
  severity: 'warning' | 'error';
}