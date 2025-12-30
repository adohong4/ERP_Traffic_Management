import { PaginatedResponse } from '@/types/VehicleLicense.types';
import { api } from '../base/apiClient';
import { API_ENDPOINTS, buildUrl } from '../base/endpoints';
import type {
  VehicleRegistration,
  VehicleRegistrationList,
  CountItem,
} from '@/types';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ==================== Vehicle Registration API ====================

export const getVehicles = async (params?: {
  page?: number;
  size?: number;
}): Promise<PaginatedResponse<VehicleRegistration>> => {
  const url = buildUrl(API_ENDPOINTS.VEHICLE.LIST, params);
  const response = await api.get<PaginatedResponse<VehicleRegistration>>(url);
  return response.data;
};

export const getVehicleById = async (id: string): Promise<VehicleRegistration> => {
  const response = await api.get<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.VEHICLE.GET(id)
  );
  return response.data.data!;
};

export const createVehicle = async (data: Partial<VehicleRegistration>): Promise<VehicleRegistration> => {
  const response = await api.post<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.VEHICLE.CREATE,
    data
  );
  return response.data.data!;
};

export const updateVehicle = async (
  id: string,
  data: Partial<VehicleRegistration>
): Promise<VehicleRegistration> => {
  const response = await api.put<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.VEHICLE.UPDATE(id),
    data
  );
  return response.data.data!;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(API_ENDPOINTS.VEHICLE.DELETE(id));
};

export const searchVehicles = async (
  vehicle_no: string,
  params?: { page?: number; size?: number }
): Promise<VehicleRegistrationList> => {
  const url = buildUrl(API_ENDPOINTS.VEHICLE.SEARCH, { vehicle_no, ...params });
  const response = await api.get<ApiResponse<VehicleRegistrationList>>(url);
  return response.data.data!;
};

export const confirmBlockchain = async (
  id: string,
  blockchain_txhash: string
): Promise<VehicleRegistration> => {
  const response = await api.put<ApiResponse<VehicleRegistration>>(
    API_ENDPOINTS.VEHICLE.CONFIRM_BLOCKCHAIN(id),
    { blockchain_txhash, on_blockchain: true }
  );
  return response.data.data!;
};

// Statistics
export const getStatsByType = async (): Promise<CountItem[]> => {
  const response = await api.get<CountItem[]>(
    API_ENDPOINTS.VEHICLE.STATS_TYPE
  );
  return response.data;
};

export const getStatsByBrand = async (): Promise<CountItem[]> => {
  const response = await api.get<CountItem[]>(
    API_ENDPOINTS.VEHICLE.STATS_BRAND
  );
  return response.data;
};

export const getStatsByStatus = async (): Promise<CountItem[]> => {
  const response = await api.get<CountItem[]>(
    API_ENDPOINTS.VEHICLE.STATS_STATUS
  );
  return response.data;
};

export const vehicleApi = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  confirmBlockchain,
  getStatsByType,
  getStatsByBrand,
  getStatsByStatus,
};

export default vehicleApi;