import { api } from '../base/apiClient';
import { API_ENDPOINTS, buildUrl } from '../base/endpoints';
import type {
  TrafficViolation,
  PaymentInfo,
  Appeal,
  ViolationStatistics,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * Violation API Module
 * 
 * Handles all API calls related to traffic violations
 */

// ==================== Violation CRUD ====================

/**
 * Get all violations with pagination and filters
 */
export const getViolations = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  province?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedResponse<TrafficViolation>> => {
  const url = buildUrl(API_ENDPOINTS.VIOLATIONS.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<TrafficViolation>>>(url);
  return response.data.data!;
};

/**
 * Get violation by ID
 */
export const getViolationById = async (id: string): Promise<TrafficViolation> => {
  const response = await api.get<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.GET(id)
  );
  return response.data.data!;
};

/**
 * Get violations by license number
 */
export const getViolationsByLicense = async (
  licenseNumber: string
): Promise<TrafficViolation[]> => {
  const response = await api.get<ApiResponse<TrafficViolation[]>>(
    API_ENDPOINTS.VIOLATIONS.BY_LICENSE(licenseNumber)
  );
  return response.data.data!;
};

/**
 * Get violations by vehicle plate number
 */
export const getViolationsByVehicle = async (
  plateNumber: string
): Promise<TrafficViolation[]> => {
  const response = await api.get<ApiResponse<TrafficViolation[]>>(
    API_ENDPOINTS.VIOLATIONS.BY_VEHICLE(plateNumber)
  );
  return response.data.data!;
};

/**
 * Create new violation
 */
export const createViolation = async (
  data: Partial<TrafficViolation>
): Promise<TrafficViolation> => {
  const response = await api.post<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Update violation
 */
export const updateViolation = async (
  id: string,
  data: Partial<TrafficViolation>
): Promise<TrafficViolation> => {
  const response = await api.put<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.UPDATE(id),
    data
  );
  return response.data.data!;
};

/**
 * Delete violation
 */
export const deleteViolation = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.VIOLATIONS.DELETE(id));
};

/**
 * Search violations
 */
export const searchViolations = async (query: string): Promise<TrafficViolation[]> => {
  const response = await api.get<ApiResponse<TrafficViolation[]>>(
    buildUrl(API_ENDPOINTS.VIOLATIONS.SEARCH, { q: query })
  );
  return response.data.data!;
};

// ==================== Payment ====================

/**
 * Pay violation fine
 */
export const payViolation = async (
  id: string,
  data: {
    paymentMethod: string;
    amount: number;
    transactionNumber?: string;
    notes?: string;
  }
): Promise<TrafficViolation> => {
  const response = await api.post<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.PAY(id),
    data
  );
  return response.data.data!;
};

/**
 * Get unpaid violations
 */
export const getUnpaidViolations = async (params?: {
  licenseNumber?: string;
  plateNumber?: string;
}): Promise<TrafficViolation[]> => {
  const url = buildUrl(API_ENDPOINTS.VIOLATIONS.UNPAID, params);
  const response = await api.get<ApiResponse<TrafficViolation[]>>(url);
  return response.data.data!;
};

/**
 * Get overdue violations
 */
export const getOverdueViolations = async (): Promise<TrafficViolation[]> => {
  const response = await api.get<ApiResponse<TrafficViolation[]>>(
    API_ENDPOINTS.VIOLATIONS.OVERDUE
  );
  return response.data.data!;
};

// ==================== Appeals ====================

/**
 * Submit appeal for violation
 */
export const appealViolation = async (
  id: string,
  data: {
    appellant: string;
    reason: string;
    evidence?: Array<{
      type: string;
      description: string;
      url?: string;
    }>;
  }
): Promise<TrafficViolation> => {
  const response = await api.post<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.APPEAL(id),
    data
  );
  return response.data.data!;
};

/**
 * Review appeal
 */
export const reviewAppeal = async (
  id: string,
  data: {
    decision: 'approved' | 'rejected' | 'partial';
    decisionReason: string;
    newFine?: number;
  }
): Promise<TrafficViolation> => {
  const response = await api.post<ApiResponse<TrafficViolation>>(
    API_ENDPOINTS.VIOLATIONS.REVIEW_APPEAL(id),
    data
  );
  return response.data.data!;
};

// ==================== Evidence ====================

/**
 * Upload evidence for violation
 */
export const uploadEvidence = async (
  id: string,
  file: File,
  data: {
    type: string;
    description: string;
  }
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', data.type);
  formData.append('description', data.description);

  await api.post(API_ENDPOINTS.VIOLATIONS.UPLOAD_EVIDENCE(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ==================== Statistics ====================

/**
 * Get violation statistics
 */
export const getViolationStatistics = async (params?: {
  dateFrom?: string;
  dateTo?: string;
  province?: string;
  type?: string;
}): Promise<ViolationStatistics> => {
  const url = buildUrl(API_ENDPOINTS.VIOLATIONS.STATISTICS, params);
  const response = await api.get<ApiResponse<ViolationStatistics>>(url);
  return response.data.data!;
};

/**
 * Export violations to CSV/Excel
 */
export const exportViolations = async (params?: {
  format?: 'csv' | 'excel';
  filters?: Record<string, any>;
}): Promise<Blob> => {
  const url = buildUrl(API_ENDPOINTS.VIOLATIONS.EXPORT, params);
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response.data;
};

// Export all functions
export const violationApi = {
  // CRUD
  getViolations,
  getViolationById,
  getViolationsByLicense,
  getViolationsByVehicle,
  createViolation,
  updateViolation,
  deleteViolation,
  searchViolations,

  // Payment
  payViolation,
  getUnpaidViolations,
  getOverdueViolations,

  // Appeals
  appealViolation,
  reviewAppeal,

  // Evidence
  uploadEvidence,

  // Statistics
  getViolationStatistics,
  exportViolations,
};

export default violationApi;
