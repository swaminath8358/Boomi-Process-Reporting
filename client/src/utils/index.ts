import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ProcessStatus } from '../types';
import clsx from 'clsx';

/**
 * Date formatting utilities
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateShort = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const formatDateRange = (startDate: string, endDate: string | null): string => {
  try {
    const start = format(parseISO(startDate), 'HH:mm:ss');
    if (!endDate) return `Started at ${start}`;
    const end = format(parseISO(endDate), 'HH:mm:ss');
    return `${start} - ${end}`;
  } catch {
    return 'Invalid date range';
  }
};

/**
 * Duration formatting utilities
 */
export const formatDuration = (milliseconds: number | null): string => {
  if (!milliseconds) return 'N/A';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const formatExecutionTime = (startTime: string, endTime: string | null): string => {
  try {
    if (!endTime) return 'In progress...';
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    const duration = end.getTime() - start.getTime();
    return formatDuration(duration);
  } catch {
    return 'N/A';
  }
};

/**
 * Number formatting utilities
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

/**
 * Status-related utilities
 */
export const getStatusColor = (status: ProcessStatus): string => {
  switch (status) {
    case 'Success':
      return 'text-green-600 dark:text-green-400';
    case 'Failed':
      return 'text-red-600 dark:text-red-400';
    case 'In Progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'Warning':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const getStatusBadgeClasses = (status: ProcessStatus): string => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
  
  switch (status) {
    case 'Success':
      return clsx(baseClasses, 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300');
    case 'Failed':
      return clsx(baseClasses, 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300');
    case 'In Progress':
      return clsx(baseClasses, 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300');
    case 'Warning':
      return clsx(baseClasses, 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300');
    default:
      return clsx(baseClasses, 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300');
  }
};

export const getStatusIcon = (status: ProcessStatus): string => {
  switch (status) {
    case 'Success':
      return '✓';
    case 'Failed':
      return '✗';
    case 'In Progress':
      return '⟳';
    case 'Warning':
      return '⚠';
    default:
      return '?';
  }
};

/**
 * Environment-related utilities
 */
export const getEnvironmentBadgeClasses = (environment: string): string => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded';
  
  switch (environment) {
    case 'Prod':
      return clsx(baseClasses, 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300');
    case 'Test':
      return clsx(baseClasses, 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300');
    case 'Dev':
      return clsx(baseClasses, 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300');
    default:
      return clsx(baseClasses, 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300');
  }
};

/**
 * String utilities
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * URL utilities
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Array utilities
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Local storage utilities
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

/**
 * Validation utilities
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce utility
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Copy to clipboard utility
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  }
};