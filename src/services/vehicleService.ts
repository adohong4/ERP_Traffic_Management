import vehicleApi from '@/api/modules/vehicle.api';
import type { VehicleRegistration, VehicleRegistrationList, CountItem } from '@/types';

export const getAllVehicles = async (page: number = 1, size: number = 20) => {
  return await vehicleApi.getVehicles({ page, size });
};

export const getVehicleById = async (id: string): Promise<VehicleRegistration> => {
  return await vehicleApi.getVehicleById(id);
};

export const searchVehicles = async (
  plate: string,
  params?: { page?: number; size?: number }
): Promise<VehicleRegistrationList> => {
  return await vehicleApi.searchVehicles(plate, params);
};

export const createVehicleRegistration = async (
  data: Partial<VehicleRegistration>
): Promise<VehicleRegistration> => {
  return await vehicleApi.createVehicle(data);
};

export const updateVehicleRegistration = async (
  id: string,
  data: Partial<VehicleRegistration>
): Promise<VehicleRegistration> => {
  return await vehicleApi.updateVehicle(id, data);
};

export const deleteVehicleRegistration = async (id: string): Promise<void> => {
  return await vehicleApi.deleteVehicle(id);
};

export const confirmVehicleOnBlockchain = async (
  id: string,
  txHash: string
): Promise<VehicleRegistration> => {
  return await vehicleApi.confirmBlockchain(id, txHash);
};

export const getVehicleStats = async () => {
  const [type, brand, status] = await Promise.all([
    vehicleApi.getStatsByType(),
    vehicleApi.getStatsByBrand(),
    vehicleApi.getStatsByStatus(),
  ]);
  return { type, brand, status };
};

export const vehicleService = {
  getAllVehicles,
  getVehicleById,
  searchVehicles,
  createVehicleRegistration,
  updateVehicleRegistration,
  deleteVehicleRegistration,
  confirmVehicleOnBlockchain,
  getVehicleStats,
};

export default vehicleService;