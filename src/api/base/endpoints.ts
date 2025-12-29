/**
 * API Endpoints Constants
 * 
 * Centralized API endpoints configuration
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    CONNECTWALLET: '/auth/connectWallet',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Driver License Management
  LICENSES: {
    BASE: '/licenses',
    LIST: '/licenses/getAll',
    GET: (id: string) => `/licenses/${id}`,
    CREATE: '/licenses',
    UPDATE: (id: string) => `/licenses/${id}`,
    DELETE: (id: string) => `/licenses/${id}`,
    SEARCH: '/licenses/search',
    BY_WALLET: (address: string) => `/licenses/blockchain/${address}`,
    STATS: {
      STATUS: '/licenses/stats/status',
      LICENSE_TYPE: '/licenses/stats/license-type',
      LICENSE_TYPE_DETAIL: '/licenses/stats/license-type-detail',
      CITY_DETAIL: '/licenses/stats/city-detail',
    },
    CONFIRM_BLOCKCHAIN: (id: string) => `/licenses/${id}/confirm-blockchain`,
    ADD_WALLET: (id: string) => `/licenses/${id}/add-wallet`,
    EXPORT: '/licenses/export',
    BY_NUMBER: (licenseNumber: string) => `/licenses/number/${licenseNumber}`,
    HISTORY: (id: string) => `/licenses/${id}/history`,
    RENEW: (id: string) => `/licenses/${id}/renew`,
    REPLACE: (id: string) => `/licenses/${id}/replace`,
    UPGRADE: (id: string) => `/licenses/${id}/upgrade`,
    SUSPEND: (id: string) => `/licenses/${id}/suspend`,
    RESTORE: (id: string) => `/licenses/${id}/restore`,
    REVOKE: (id: string) => `/licenses/${id}/revoke`,
  },

  // License Applications
  APPLICATIONS: {
    BASE: '/applications',
    LIST: '/applications',
    GET: (id: string) => `/applications/${id}`,
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    DELETE: (id: string) => `/applications/${id}`,
    SUBMIT: (id: string) => `/applications/${id}/submit`,
    APPROVE: (id: string) => `/applications/${id}/approve`,
    REJECT: (id: string) => `/applications/${id}/reject`,
    UPLOAD_DOCUMENT: (id: string) => `/applications/${id}/documents`,
    DELETE_DOCUMENT: (id: string, docId: string) => `/applications/${id}/documents/${docId}`,
    VERIFY_DOCUMENT: (id: string, docId: string) => `/applications/${id}/documents/${docId}/verify`,
  },

  // Vehicle Management
  VEHICLES: {
    BASE: '/vehicles',
    LIST: '/vehicles',
    GET: (id: string) => `/vehicles/${id}`,
    CREATE: '/vehicles',
    UPDATE: (id: string) => `/vehicles/${id}`,
    DELETE: (id: string) => `/vehicles/${id}`,
    SEARCH: '/vehicles/search',
    STATISTICS: '/vehicles/statistics',
    EXPORT: '/vehicles/export',
    BY_PLATE: (plateNumber: string) => `/vehicles/plate/${plateNumber}`,
    HISTORY: (id: string) => `/vehicles/${id}/history`,
    TRANSFER: (id: string) => `/vehicles/${id}/transfer`,
    UPDATE_STATUS: (id: string) => `/vehicles/${id}/status`,
    REPORT_STOLEN: (id: string) => `/vehicles/${id}/stolen`,
    SCRAP: (id: string) => `/vehicles/${id}/scrap`,
  },

  // Vehicle Inspections
  INSPECTIONS: {
    BASE: '/inspections',
    LIST: '/inspections',
    GET: (id: string) => `/inspections/${id}`,
    CREATE: '/inspections',
    UPDATE: (id: string) => `/inspections/${id}`,
    DELETE: (id: string) => `/inspections/${id}`,
    BY_VEHICLE: (vehicleId: string) => `/inspections/vehicle/${vehicleId}`,
    SCHEDULE: '/inspections/schedule',
    COMPLETE: (id: string) => `/inspections/${id}/complete`,
    UPLOAD_REPORT: (id: string) => `/inspections/${id}/report`,
    STATISTICS: '/inspections/statistics',
    UPCOMING: '/inspections/upcoming',
    OVERDUE: '/inspections/overdue',
  },

  // Vehicle Registrations
  REGISTRATIONS: {
    BASE: '/registrations',
    LIST: '/registrations',
    GET: (id: string) => `/registrations/${id}`,
    CREATE: '/registrations',
    UPDATE: (id: string) => `/registrations/${id}`,
    DELETE: (id: string) => `/registrations/${id}`,
    APPROVE: (id: string) => `/registrations/${id}/approve`,
    REJECT: (id: string) => `/registrations/${id}/reject`,
    ASSIGN_PLATE: (id: string) => `/registrations/${id}/assign-plate`,
    COMPLETE: (id: string) => `/registrations/${id}/complete`,
    STATISTICS: '/registrations/statistics',
  },

  // Traffic Violations
  VIOLATIONS: {
    BASE: '/violations',
    LIST: '/violations',
    GET: (id: string) => `/violations/${id}`,
    CREATE: '/violations',
    UPDATE: (id: string) => `/violations/${id}`,
    DELETE: (id: string) => `/violations/${id}`,
    SEARCH: '/violations/search',
    STATISTICS: '/violations/statistics',
    EXPORT: '/violations/export',
    BY_LICENSE: (licenseNumber: string) => `/violations/license/${licenseNumber}`,
    BY_VEHICLE: (plateNumber: string) => `/violations/vehicle/${plateNumber}`,
    PAY: (id: string) => `/violations/${id}/pay`,
    APPEAL: (id: string) => `/violations/${id}/appeal`,
    REVIEW_APPEAL: (id: string) => `/violations/${id}/appeal/review`,
    UPLOAD_EVIDENCE: (id: string) => `/violations/${id}/evidence`,
    UNPAID: '/violations/unpaid',
    OVERDUE: '/violations/overdue',
  },

  // Traffic Authorities
  AUTHORITIES: {
    BASE: '/authorities',
    LIST: '/authorities',
    GET: (id: string) => `/authorities/${id}`,
    CREATE: '/authorities',
    UPDATE: (id: string) => `/authorities/${id}`,
    DELETE: (id: string) => `/authorities/${id}`,
    BY_PROVINCE: (province: string) => `/authorities/province/${province}`,
    BY_TYPE: (type: string) => `/authorities/type/${type}`,
    OFFICERS: (id: string) => `/authorities/${id}/officers`,
    STATISTICS: '/authorities/statistics',
  },

  // Users & Permissions
  USERS: {
    BASE: '/users',
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
    UPDATE_PERMISSIONS: (id: string) => `/users/${id}/permissions`,
    UPDATE_STATUS: (id: string) => `/users/${id}/status`,
    RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,
    ACTIVITY_LOG: (id: string) => `/users/${id}/activity`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    LIST: '/notifications',
    GET: (id: string) => `/notifications/${id}`,
    CREATE: '/notifications',
    UPDATE: (id: string) => `/notifications/${id}`,
    DELETE: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    UNREAD: '/notifications/unread',
    SEND: '/notifications/send',
    SCHEDULE: '/notifications/schedule',
  },

  // News & Announcements
  NEWS: {
    BASE: '/news',
    LIST: '/news',
    GET: (id: string) => `/news/${id}`,
    BY_SLUG: (slug: string) => `/news/slug/${slug}`,
    CREATE: '/news',
    UPDATE: (id: string) => `/news/${id}`,
    DELETE: (id: string) => `/news/${id}`,
    PUBLISH: (id: string) => `/news/${id}/publish`,
    ARCHIVE: (id: string) => `/news/${id}/archive`,
    BY_CATEGORY: (category: string) => `/news/category/${category}`,
    FEATURED: '/news/featured',
    RECENT: '/news/recent',
  },

  // Reports & Analytics
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    LICENSES: '/reports/licenses',
    VEHICLES: '/reports/vehicles',
    VIOLATIONS: '/reports/violations',
    REVENUE: '/reports/revenue',
    PERFORMANCE: '/reports/performance',
    CUSTOM: '/reports/custom',
    EXPORT: '/reports/export',
    SCHEDULE: '/reports/schedule',
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
    BULK: '/upload/bulk',
  },

  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    SYSTEM: '/settings/system',
    EMAIL: '/settings/email',
    NOTIFICATION: '/settings/notification',
    SECURITY: '/settings/security',
  },

  // Audit Logs
  AUDIT: {
    LIST: '/audit/logs',
    GET: (id: string) => `/audit/logs/${id}`,
    BY_USER: (userId: string) => `/audit/logs/user/${userId}`,
    BY_ENTITY: (entityType: string, entityId: string) => `/audit/logs/${entityType}/${entityId}`,
    EXPORT: '/audit/logs/export',
  },
} as const;

/**
 * Helper function to build URL with query parameters
 */
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return `${endpoint}?${queryString}`;
};

/**
 * Helper function to replace path parameters
 */
export const replacePathParams = (path: string, params: Record<string, string>): string => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value);
  });
  return result;
};

export default API_ENDPOINTS;
