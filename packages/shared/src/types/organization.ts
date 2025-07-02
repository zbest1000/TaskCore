import { BaseEntity, Priority } from './common';
import { User } from './user';

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  settings: OrganizationSettings;
  memberCount?: number;
  projectCount?: number;
}

export interface OrganizationSettings {
  allowGuestAccess: boolean;
  defaultProjectVisibility: 'public' | 'private';
  requireTaskApproval: boolean;
  enableTimeTracking: boolean;
  enablePunchLists: boolean;
  customFields: CustomField[];
  integrations: {
    slack: boolean;
    github: boolean;
    googleDrive: boolean;
    dropbox: boolean;
  };
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required: boolean;
  description?: string;
}

export interface OrganizationMember extends BaseEntity {
  organizationId: string;
  userId: string;
  user?: User;
  role: OrganizationRole;
  permissions: Permission[];
  status: 'active' | 'invited' | 'suspended';
  invitedBy?: string;
  joinedAt: Date;
}

export type OrganizationRole = 'owner' | 'admin' | 'member' | 'guest';

export interface Permission {
  resource: string;
  actions: string[];
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  permissions: Permission[];
  invitedBy: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Team extends BaseEntity {
  organizationId: string;
  name: string;
  description?: string;
  color?: string;
  memberIds: string[];
  members?: User[];
  leaderId?: string;
  leader?: User;
}