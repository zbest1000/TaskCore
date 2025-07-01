import type { Priority } from '../types/common';
import type { TaskStatus, ProjectStatus } from '../types/project';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]{1,50}$/;
  return slugRegex.test(slug);
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const isValidPriority = (priority: string): priority is Priority => {
  return ['low', 'medium', 'high', 'urgent'].includes(priority);
};

export const isValidTaskStatus = (status: string): status is TaskStatus => {
  return ['todo', 'in_progress', 'review', 'blocked', 'completed', 'cancelled'].includes(status);
};

export const isValidProjectStatus = (status: string): status is ProjectStatus => {
  return ['planning', 'active', 'on_hold', 'completed', 'cancelled'].includes(status);
};

export const isValidUrl = (url: string): boolean => {
  try {
    // Simple URL validation without using global URL constructor
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size > 0 && size <= maxSize;
};

export const isValidMimeType = (mimeType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimeType);
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateMinValue = (value: number, minValue: number, fieldName: string): string | null => {
  if (value < minValue) {
    return `${fieldName} must be at least ${minValue}`;
  }
  return null;
};

export const validateMaxValue = (value: number, maxValue: number, fieldName: string): string | null => {
  if (value > maxValue) {
    return `${fieldName} must not exceed ${maxValue}`;
  }
  return null;
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

export const validateArrayLength = (arr: any[], min: number, max: number, fieldName: string): string | null => {
  if (arr.length < min) {
    return `${fieldName} must have at least ${min} items`;
  }
  if (arr.length > max) {
    return `${fieldName} must not have more than ${max} items`;
  }
  return null;
};