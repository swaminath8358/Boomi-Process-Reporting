import { format, formatDistanceToNow, parseISO } from 'date-fns';
import clsx from 'clsx';

/**
 * Date formatting utilities
 */
export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateShort = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const formatDateRange = (startDate, endDate) => {
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
export const formatDuration = (milliseconds) => {
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

export const formatExecutionTime = (startTime, endTime) => {
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
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

/**
 * Status-related utilities
 */
export const getStatusColor = (status) => {
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

export const getStatusBadgeClasses = (status) => {
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

export const getStatusIcon = (status) => {
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
export const getEnvironmentBadgeClasses = (environment) => {
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
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * URL utilities
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Array utilities
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
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
export const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

/**
 * Validation utilities
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
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
export const debounce = (func, wait) => {
  let timeout;
  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Copy to clipboard utility
 */
export const copyToClipboard = async (text) => {
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