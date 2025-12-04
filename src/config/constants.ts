// Application constants
export const APP_NAME = 'ERP GPLX';
export const APP_DESCRIPTION = 'Hệ thống quản lý GPLX và đăng kiểm - Bộ Công an';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Toast duration
export const TOAST_DURATION = 3000;

// Supported chains
export const SUPPORTED_CHAINS = ['Ethereum', 'BSC', 'Polygon', 'Sepolia'];

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'erp_theme',
  LANGUAGE: 'erp_language',
  USER_PREFERENCES: 'erp_user_preferences',
} as const;
