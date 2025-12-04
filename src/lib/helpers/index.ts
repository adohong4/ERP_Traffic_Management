// Helper functions for the application

import type { License, Vehicle, Violation } from '@/types';

/**
 * Check if a license is expired
 */
export const isLicenseExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

/**
 * Check if a vehicle inspection is due
 */
export const isInspectionDue = (inspectionDate: string): boolean => {
  const nextInspection = new Date(inspectionDate);
  const today = new Date();
  const daysUntilInspection = Math.floor(
    (nextInspection.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysUntilInspection <= 30; // Due within 30 days
};

/**
 * Get status badge variant
 */
export const getStatusVariant = (
  status: string,
): 'default' | 'success' | 'warning' | 'destructive' => {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
    active: 'success',
    valid: 'success',
    paid: 'success',
    published: 'success',
    expired: 'destructive',
    suspended: 'destructive',
    failed: 'destructive',
    unpaid: 'warning',
    pending: 'warning',
    draft: 'default',
    inactive: 'default',
  };
  return statusMap[status.toLowerCase()] || 'default';
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Filter items by search query
 */
export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  fields: (keyof T)[],
): T[] => {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value?.toString().toLowerCase().includes(query);
    }),
  );
};

/**
 * Sort items by field
 */
export const sortItems = <T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc',
): T[] => {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal > bVal ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Paginate items
 */
export const paginateItems = <T>(
  items: T[],
  page: number,
  pageSize: number,
): {
  items: T[];
  totalPages: number;
  totalItems: number;
} => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / pageSize),
    totalItems: items.length,
  };
};

/**
 * Get license class name in Vietnamese
 */
export const getLicenseClassName = (classCode: string): string => {
  const classNames: Record<string, string> = {
    A1: 'Hạng A1 - Xe mô tô hai bánh',
    A2: 'Hạng A2 - Xe mô tô ba bánh',
    B1: 'Hạng B1 - Xe ô tô đến 9 chỗ ngồi',
    B2: 'Hạng B2 - Xe ô tô trên 9 chỗ ngồi',
    C: 'Hạng C - Xe ô tô tải',
    D: 'Hạng D - Xe ô tô khách',
    E: 'Hạng E - Xe ô tô có rơ moóc',
    F: 'Hạng F - Xe máy chuyên dụng',
  };
  return classNames[classCode] || classCode;
};

/**
 * Get violation severity
 */
export const getViolationSeverity = (fine: number): 'low' | 'medium' | 'high' => {
  if (fine >= 10000000) return 'high';
  if (fine >= 5000000) return 'medium';
  return 'low';
};

/**
 * Generate random ID
 */
export const generateId = (prefix = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Validate Vietnamese phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate license number format
 */
export const isValidLicenseNumber = (licenseNumber: string): boolean => {
  // Format: 12 digits
  const licenseRegex = /^[0-9]{12}$/;
  return licenseRegex.test(licenseNumber.replace(/\s/g, ''));
};

/**
 * Validate plate number format
 */
export const isValidPlateNumber = (plateNumber: string): boolean => {
  // Format: 29A-12345 or 29A12345
  const plateRegex = /^[0-9]{2}[A-Z]{1,2}[-]?[0-9]{4,5}$/;
  return plateRegex.test(plateNumber.replace(/\s/g, ''));
};

/**
 * Format license number (add spaces for readability)
 */
export const formatLicenseNumber = (licenseNumber: string): string => {
  const cleaned = licenseNumber.replace(/\s/g, '');
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return licenseNumber;
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) => headers.map((header) => row[header]).join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

/**
 * Copy text to clipboard (with fallback)
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback to execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
};
