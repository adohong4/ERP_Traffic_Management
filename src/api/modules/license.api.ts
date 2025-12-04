import { api } from '../base/apiClient';
import { API_ENDPOINTS, buildUrl } from '../base/endpoints';
import type {
  DriverLicense,
  LicenseApplication,
  LicenseHistory,
  LicenseStatistics,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * License API Module
 * 
 * Handles all API calls related to driver licenses
 */

// ==================== License CRUD ====================

/**
 * Get all licenses with pagination and filters
 */
export const getLicenses = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  class?: string;
  province?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedResponse<DriverLicense>> => {
  const url = buildUrl(API_ENDPOINTS.LICENSES.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<DriverLicense>>>(url);
  return response.data.data!;
};

/**
 * Get license by ID
 */
export const getLicenseById = async (id: string): Promise<DriverLicense> => {
  const response = await api.get<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.GET(id)
  );
  return response.data.data!;
};

/**
 * Get license by license number
 */
export const getLicenseByNumber = async (licenseNumber: string): Promise<DriverLicense> => {
  const response = await api.get<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.BY_NUMBER(licenseNumber)
  );
  return response.data.data!;
};

/**
 * Create new license
 */
export const createLicense = async (data: Partial<DriverLicense>): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Update license
 */
export const updateLicense = async (
  id: string,
  data: Partial<DriverLicense>
): Promise<DriverLicense> => {
  const response = await api.put<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.UPDATE(id),
    data
  );
  return response.data.data!;
};

/**
 * Delete license
 */
export const deleteLicense = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.LICENSES.DELETE(id));
};

/**
 * Search licenses
 */
export const searchLicenses = async (query: string): Promise<DriverLicense[]> => {
  const response = await api.get<ApiResponse<DriverLicense[]>>(
    buildUrl(API_ENDPOINTS.LICENSES.SEARCH, { q: query })
  );
  return response.data.data!;
};

// ==================== License Actions ====================

/**
 * Renew license
 */
export const renewLicense = async (
  id: string,
  data: { expiryDate: string }
): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.RENEW(id),
    data
  );
  return response.data.data!;
};

/**
 * Replace license (lost or damaged)
 */
export const replaceLicense = async (
  id: string,
  data: { reason: string; newLicenseNumber?: string }
): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.REPLACE(id),
    data
  );
  return response.data.data!;
};

/**
 * Upgrade license class
 */
export const upgradeLicense = async (
  id: string,
  data: { newClass: string }
): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.UPGRADE(id),
    data
  );
  return response.data.data!;
};

/**
 * Suspend license
 */
export const suspendLicense = async (
  id: string,
  data: { reason: string; suspensionDate: string; duration?: number }
): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.SUSPEND(id),
    data
  );
  return response.data.data!;
};

/**
 * Restore suspended license
 */
export const restoreLicense = async (id: string): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.RESTORE(id)
  );
  return response.data.data!;
};

/**
 * Revoke license
 */
export const revokeLicense = async (
  id: string,
  data: { reason: string }
): Promise<DriverLicense> => {
  const response = await api.post<ApiResponse<DriverLicense>>(
    API_ENDPOINTS.LICENSES.REVOKE(id),
    data
  );
  return response.data.data!;
};

// ==================== License History ====================

/**
 * Get license history
 */
export const getLicenseHistory = async (id: string): Promise<LicenseHistory[]> => {
  const response = await api.get<ApiResponse<LicenseHistory[]>>(
    API_ENDPOINTS.LICENSES.HISTORY(id)
  );
  return response.data.data!;
};

// ==================== License Applications ====================

/**
 * Get all applications
 */
export const getApplications = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
}): Promise<PaginatedResponse<LicenseApplication>> => {
  const url = buildUrl(API_ENDPOINTS.APPLICATIONS.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<LicenseApplication>>>(url);
  return response.data.data!;
};

/**
 * Get application by ID
 */
export const getApplicationById = async (id: string): Promise<LicenseApplication> => {
  const response = await api.get<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.GET(id)
  );
  return response.data.data!;
};

/**
 * Create application
 */
export const createApplication = async (
  data: Partial<LicenseApplication>
): Promise<LicenseApplication> => {
  const response = await api.post<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Update application
 */
export const updateApplication = async (
  id: string,
  data: Partial<LicenseApplication>
): Promise<LicenseApplication> => {
  const response = await api.put<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.UPDATE(id),
    data
  );
  return response.data.data!;
};

/**
 * Submit application
 */
export const submitApplication = async (id: string): Promise<LicenseApplication> => {
  const response = await api.post<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.SUBMIT(id)
  );
  return response.data.data!;
};

/**
 * Approve application
 */
export const approveApplication = async (
  id: string,
  data: { licenseNumber: string; notes?: string }
): Promise<LicenseApplication> => {
  const response = await api.post<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.APPROVE(id),
    data
  );
  return response.data.data!;
};

/**
 * Reject application
 */
export const rejectApplication = async (
  id: string,
  data: { reason: string }
): Promise<LicenseApplication> => {
  const response = await api.post<ApiResponse<LicenseApplication>>(
    API_ENDPOINTS.APPLICATIONS.REJECT(id),
    data
  );
  return response.data.data!;
};

/**
 * Upload document for application
 */
export const uploadApplicationDocument = async (
  id: string,
  file: File,
  type: string
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  await api.post(API_ENDPOINTS.APPLICATIONS.UPLOAD_DOCUMENT(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ==================== Statistics & Reports ====================

/**
 * Get license statistics
 */
export const getLicenseStatistics = async (): Promise<LicenseStatistics> => {
  const response = await api.get<ApiResponse<LicenseStatistics>>(
    API_ENDPOINTS.LICENSES.STATISTICS
  );
  return response.data.data!;
};

/**
 * Export licenses to CSV/Excel
 */
export const exportLicenses = async (params?: {
  format?: 'csv' | 'excel';
  filters?: Record<string, any>;
}): Promise<Blob> => {
  const url = buildUrl(API_ENDPOINTS.LICENSES.EXPORT, params);
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response.data;
};

// Export all functions
export const licenseApi = {
  // CRUD
  getLicenses,
  getLicenseById,
  getLicenseByNumber,
  createLicense,
  updateLicense,
  deleteLicense,
  searchLicenses,

  // Actions
  renewLicense,
  replaceLicense,
  upgradeLicense,
  suspendLicense,
  restoreLicense,
  revokeLicense,

  // History
  getLicenseHistory,

  // Applications
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  submitApplication,
  approveApplication,
  rejectApplication,
  uploadApplicationDocument,

  // Statistics
  getLicenseStatistics,
  exportLicenses,
};

export default licenseApi;
