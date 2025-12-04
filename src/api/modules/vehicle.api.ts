import { api } from '../base/apiClient';
import { API_ENDPOINTS, buildUrl } from '../base/endpoints';
import type {
  Vehicle,
  VehicleInspection,
  VehicleRegistration,
  VehicleHistory,
  VehicleStatistics,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * Vehicle API Module
 * 
 * Handles all API calls related to vehicles, inspections, and registrations
 */

// ==================== Vehicle CRUD ====================

/**
 * Get all vehicles with pagination and filters
 */
export const getVehicles = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
  province?: string;
  inspectionStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Vehicle>> => {
  const url = buildUrl(API_ENDPOINTS.VEHICLES.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>(url);
  return response.data.data!;
};

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.GET(id)
  );
  return response.data.data!;
};

/**
 * Get vehicle by plate number
 */
export const getVehicleByPlate = async (plateNumber: string): Promise<Vehicle> => {
  const response = await api.get<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.BY_PLATE(plateNumber)
  );
  return response.data.data!;
};

/**
 * Create new vehicle
 */
export const createVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await api.post<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Update vehicle
 */
export const updateVehicle = async (
  id: string,
  data: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await api.put<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.UPDATE(id),
    data
  );
  return response.data.data!;
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.VEHICLES.DELETE(id));
};

/**
 * Search vehicles
 */
export const searchVehicles = async (query: string): Promise<Vehicle[]> => {
  const response = await api.get<ApiResponse<Vehicle[]>>(
    buildUrl(API_ENDPOINTS.VEHICLES.SEARCH, { q: query })
  );
  return response.data.data!;
};

// ==================== Vehicle Actions ====================

/**
 * Transfer vehicle ownership
 */
export const transferVehicle = async (
  id: string,
  data: {
    newOwnerId: string;
    newOwnerName: string;
    transferDate: string;
    notes?: string;
  }
): Promise<Vehicle> => {
  const response = await api.post<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.TRANSFER(id),
    data
  );
  return response.data.data!;
};

/**
 * Update vehicle status
 */
export const updateVehicleStatus = async (
  id: string,
  status: string,
  reason?: string
): Promise<Vehicle> => {
  const response = await api.patch<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.UPDATE_STATUS(id),
    { status, reason }
  );
  return response.data.data!;
};

/**
 * Report vehicle as stolen
 */
export const reportVehicleStolen = async (
  id: string,
  data: {
    reportDate: string;
    reportingAuthority: string;
    description: string;
  }
): Promise<Vehicle> => {
  const response = await api.post<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.REPORT_STOLEN(id),
    data
  );
  return response.data.data!;
};

/**
 * Scrap vehicle
 */
export const scrapVehicle = async (
  id: string,
  data: {
    scrapDate: string;
    scrapAuthority: string;
    certificateNumber?: string;
  }
): Promise<Vehicle> => {
  const response = await api.post<ApiResponse<Vehicle>>(
    API_ENDPOINTS.VEHICLES.SCRAP(id),
    data
  );
  return response.data.data!;
};

// ==================== Vehicle History ====================

/**
 * Get vehicle history
 */
export const getVehicleHistory = async (id: string): Promise<VehicleHistory[]> => {
  const response = await api.get<ApiResponse<VehicleHistory[]>>(
    API_ENDPOINTS.VEHICLES.HISTORY(id)
  );
  return response.data.data!;
};

// ==================== Vehicle Inspections ====================

/**
 * Get all inspections
 */
export const getInspections = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  vehicleId?: string;
}): Promise<PaginatedResponse<VehicleInspection>> => {
  const url = buildUrl(API_ENDPOINTS.INSPECTIONS.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<VehicleInspection>>>(url);
  return response.data.data!;
};

/**
 * Get inspection by ID
 */
export const getInspectionById = async (id: string): Promise<VehicleInspection> => {
  const response = await api.get<ApiResponse<VehicleInspection>>(
    API_ENDPOINTS.INSPECTIONS.GET(id)
  );
  return response.data.data!;
};

/**
 * Get inspections by vehicle ID
 */
export const getInspectionsByVehicle = async (
  vehicleId: string
): Promise<VehicleInspection[]> => {
  const response = await api.get<ApiResponse<VehicleInspection[]>>(
    API_ENDPOINTS.INSPECTIONS.BY_VEHICLE(vehicleId)
  );
  return response.data.data!;
};

/**
 * Create inspection
 */
export const createInspection = async (
  data: Partial<VehicleInspection>
): Promise<VehicleInspection> => {
  const response = await api.post<ApiResponse<VehicleInspection>>(
    API_ENDPOINTS.INSPECTIONS.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Schedule inspection
 */
export const scheduleInspection = async (data: {
  vehicleId: string;
  inspectionDate: string;
  inspectionCenter: string;
  notes?: string;
}): Promise<VehicleInspection> => {
  const response = await api.post<ApiResponse<VehicleInspection>>(
    API_ENDPOINTS.INSPECTIONS.SCHEDULE,
    data
  );
  return response.data.data!;
};

/**
 * Complete inspection
 */
export const completeInspection = async (
  id: string,
  data: {
    result: 'passed' | 'conditional' | 'failed';
    findings: any[];
    certificateNumber?: string;
    notes?: string;
  }
): Promise<VehicleInspection> => {
  const response = await api.post<ApiResponse<VehicleInspection>>(
    API_ENDPOINTS.INSPECTIONS.COMPLETE(id),
    data
  );
  return response.data.data!;
};

/**
 * Get upcoming inspections
 */
export const getUpcomingInspections = async (): Promise<VehicleInspection[]> => {
  const response = await api.get<ApiResponse<VehicleInspection[]>>(
    API_ENDPOINTS.INSPECTIONS.UPCOMING
  );
  return response.data.data!;
};

/**
 * Get overdue inspections
 */
export const getOverdueInspections = async (): Promise<VehicleInspection[]> => {
  const response = await api.get<ApiResponse<VehicleInspection[]>>(
    API_ENDPOINTS.INSPECTIONS.OVERDUE
  );
  return response.data.data!;
};

// ==================== Vehicle Registrations ====================

/**
 * Get all registrations
 */
export const getRegistrations = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
}): Promise<PaginatedResponse<VehicleRegistration>> => {
  const url = buildUrl(API_ENDPOINTS.REGISTRATIONS.LIST, params);
  const response = await api.get<ApiResponse<PaginatedResponse<VehicleRegistration>>>(url);
  return response.data.data!;
};

/**
 * Get registration by ID
 */
export const getRegistrationById = async (id: string): Promise<VehicleRegistration> => {
  const response = await api.get<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.GET(id)
  );
  return response.data.data!;
};

/**
 * Create registration
 */
export const createRegistration = async (
  data: Partial<VehicleRegistration>
): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.CREATE,
    data
  );
  return response.data.data!;
};

/**
 * Approve registration
 */
export const approveRegistration = async (
  id: string,
  data: { notes?: string }
): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.APPROVE(id),
    data
  );
  return response.data.data!;
};

/**
 * Reject registration
 */
export const rejectRegistration = async (
  id: string,
  data: { reason: string }
): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.REJECT(id),
    data
  );
  return response.data.data!;
};

/**
 * Assign plate number to registration
 */
export const assignPlateNumber = async (
  id: string,
  plateNumber: string
): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.ASSIGN_PLATE(id),
    { plateNumber }
  );
  return response.data.data!;
};

/**
 * Complete registration
 */
export const completeRegistration = async (id: string): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.REGISTRATIONS.COMPLETE(id)
  );
  return response.data.data!;
};

// ==================== Statistics ====================

/**
 * Get vehicle statistics
 */
export const getVehicleStatistics = async (): Promise<VehicleStatistics> => {
  const response = await api.get<ApiResponse<VehicleStatistics>>(
    API_ENDPOINTS.VEHICLES.STATISTICS
  );
  return response.data.data!;
};

/**
 * Get inspection statistics
 */
export const getInspectionStatistics = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>(
    API_ENDPOINTS.INSPECTIONS.STATISTICS
  );
  return response.data.data!;
};

/**
 * Get registration statistics
 */
export const getRegistrationStatistics = async (): Promise<any> => {
  const response = await api.get<ApiResponse<any>>(
    API_ENDPOINTS.REGISTRATIONS.STATISTICS
  );
  return response.data.data!;
};

/**
 * Export vehicles to CSV/Excel
 */
export const exportVehicles = async (params?: {
  format?: 'csv' | 'excel';
  filters?: Record<string, any>;
}): Promise<Blob> => {
  const url = buildUrl(API_ENDPOINTS.VEHICLES.EXPORT, params);
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response.data;
};

// Export all functions
export const vehicleApi = {
  // Vehicle CRUD
  getVehicles,
  getVehicleById,
  getVehicleByPlate,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,

  // Vehicle Actions
  transferVehicle,
  updateVehicleStatus,
  reportVehicleStolen,
  scrapVehicle,
  getVehicleHistory,

  // Inspections
  getInspections,
  getInspectionById,
  getInspectionsByVehicle,
  createInspection,
  scheduleInspection,
  completeInspection,
  getUpcomingInspections,
  getOverdueInspections,

  // Registrations
  getRegistrations,
  getRegistrationById,
  createRegistration,
  approveRegistration,
  rejectRegistration,
  assignPlateNumber,
  completeRegistration,

  // Statistics
  getVehicleStatistics,
  getInspectionStatistics,
  getRegistrationStatistics,
  exportVehicles,
};

export default vehicleApi;
