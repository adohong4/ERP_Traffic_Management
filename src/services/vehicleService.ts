import { vehicleApi } from '@/api';
import { mockVehicles, mockInspections, mockVehicleRegistrations } from '@/lib/mockData';
import type { Vehicle, VehicleInspection, VehicleRegistration } from '@/types';

/**
 * Vehicle Service
 * 
 * Business logic layer for vehicle management
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Get all vehicles with optional filters
 */
export const getAllVehicles = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  province?: string;
  inspectionStatus?: string;
}): Promise<Vehicle[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockVehicles];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (vehicle) =>
          vehicle.plateNumber.toLowerCase().includes(search) ||
          vehicle.owner.name.toLowerCase().includes(search) ||
          vehicle.brand.toLowerCase().includes(search) ||
          vehicle.model.toLowerCase().includes(search)
      );
    }

    if (filters?.status) {
      data = data.filter((vehicle) => vehicle.status === filters.status);
    }

    if (filters?.type) {
      data = data.filter((vehicle) => vehicle.vehicleType === filters.type);
    }

    if (filters?.province) {
      data = data.filter((vehicle) => vehicle.province === filters.province);
    }

    if (filters?.inspectionStatus) {
      data = data.filter((vehicle) => vehicle.inspectionStatus === filters.inspectionStatus);
    }

    return data;
  }

  const response = await vehicleApi.getVehicles(filters);
  return response.data;
};

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (id: string): Promise<Vehicle | undefined> => {
  if (USE_MOCK_DATA) {
    return mockVehicles.find((vehicle) => vehicle.id === id);
  }

  return await vehicleApi.getVehicleById(id);
};

/**
 * Get vehicle by plate number
 */
export const getVehicleByPlate = async (plateNumber: string): Promise<Vehicle | undefined> => {
  if (USE_MOCK_DATA) {
    return mockVehicles.find((vehicle) => vehicle.plateNumber === plateNumber);
  }

  return await vehicleApi.getVehicleByPlate(plateNumber);
};

/**
 * Create new vehicle
 */
export const createVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  validateVehicleData(data);

  if (USE_MOCK_DATA) {
    const newVehicle: Vehicle = {
      id: `MOCK_${Date.now()}`,
      plateNumber: data.plateNumber!,
      registrationNumber: data.registrationNumber || `REG${Date.now()}`,
      owner: data.owner!,
      vehicleType: data.vehicleType!,
      brand: data.brand!,
      model: data.model!,
      modelYear: data.modelYear!,
      color: data.color!,
      engineNumber: data.engineNumber!,
      chassisNumber: data.chassisNumber!,
      fuelType: data.fuelType!,
      registrationDate: data.registrationDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || calculateRegistrationExpiry(),
      status: 'active',
      inspectionStatus: 'not_required',
      province: data.province!,
      registrationAuthority: data.registrationAuthority!,
      createdAt: new Date().toISOString(),
    };

    mockVehicles.push(newVehicle);
    return newVehicle;
  }

  return await vehicleApi.createVehicle(data);
};

/**
 * Update vehicle
 */
export const updateVehicle = async (
  id: string,
  data: Partial<Vehicle>
): Promise<Vehicle> => {
  if (USE_MOCK_DATA) {
    const index = mockVehicles.findIndex((vehicle) => vehicle.id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }

    mockVehicles[index] = {
      ...mockVehicles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockVehicles[index];
  }

  return await vehicleApi.updateVehicle(id, data);
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    const index = mockVehicles.findIndex((vehicle) => vehicle.id === id);
    if (index !== -1) {
      mockVehicles.splice(index, 1);
    }
    return;
  }

  await vehicleApi.deleteVehicle(id);
};

/**
 * Check if inspection is due
 */
export const isInspectionDue = (vehicle: Vehicle): boolean => {
  if (!vehicle.nextInspectionDate) {
    return false;
  }

  const nextInspection = new Date(vehicle.nextInspectionDate);
  const today = new Date();
  return nextInspection <= today;
};

/**
 * Check if inspection is due soon (within 30 days)
 */
export const isInspectionDueSoon = (vehicle: Vehicle): boolean => {
  if (!vehicle.nextInspectionDate) {
    return false;
  }

  const nextInspection = new Date(vehicle.nextInspectionDate);
  const today = new Date();
  const daysUntilInspection = Math.floor(
    (nextInspection.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilInspection <= 30 && daysUntilInspection > 0;
};

/**
 * Get days until inspection
 */
export const getDaysUntilInspection = (vehicle: Vehicle): number | null => {
  if (!vehicle.nextInspectionDate) {
    return null;
  }

  const nextInspection = new Date(vehicle.nextInspectionDate);
  const today = new Date();
  return Math.floor((nextInspection.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// ==================== Inspections ====================

/**
 * Get all inspections
 */
export const getAllInspections = async (filters?: {
  vehicleId?: string;
  status?: string;
}): Promise<VehicleInspection[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockInspections];

    if (filters?.vehicleId) {
      data = data.filter((inspection) => inspection.vehicleId === filters.vehicleId);
    }

    return data;
  }

  const response = await vehicleApi.getInspections(filters);
  return response.data;
};

/**
 * Get inspections by vehicle ID
 */
export const getInspectionsByVehicle = async (
  vehicleId: string
): Promise<VehicleInspection[]> => {
  if (USE_MOCK_DATA) {
    return mockInspections.filter((inspection) => inspection.vehicleId === vehicleId);
  }

  return await vehicleApi.getInspectionsByVehicle(vehicleId);
};

/**
 * Schedule inspection
 */
export const scheduleInspection = async (data: {
  vehicleId: string;
  inspectionDate: string;
  inspectionCenter: string;
}): Promise<VehicleInspection> => {
  if (USE_MOCK_DATA) {
    const vehicle = await getVehicleById(data.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    const newInspection: VehicleInspection = {
      id: `INS${Date.now()}`,
      vehicleId: data.vehicleId,
      plateNumber: vehicle.plateNumber,
      inspectionDate: data.inspectionDate,
      nextInspectionDate: calculateNextInspection(data.inspectionDate),
      inspectionCenter: data.inspectionCenter,
      inspectionCenterAddress: '',
      inspector: '',
      certificateNumber: '',
      result: 'passed',
      findings: [],
      overallStatus: 'pending',
      fee: 340000,
    };

    mockInspections.push(newInspection);
    return newInspection;
  }

  return await vehicleApi.scheduleInspection(data);
};

// ==================== Registrations ====================

/**
 * Get all registrations
 */
export const getAllRegistrations = async (filters?: {
  status?: string;
  type?: string;
}): Promise<VehicleRegistration[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockVehicleRegistrations];

    if (filters?.status) {
      data = data.filter((reg) => reg.status === filters.status);
    }

    if (filters?.type) {
      data = data.filter((reg) => reg.type === filters.type);
    }

    return data;
  }

  const response = await vehicleApi.getRegistrations(filters);
  return response.data;
};

/**
 * Create registration
 */
export const createRegistration = async (
  data: Partial<VehicleRegistration>
): Promise<VehicleRegistration> => {
  if (USE_MOCK_DATA) {
    const newRegistration: VehicleRegistration = {
      id: `VREG${Date.now()}`,
      applicantId: data.applicantId!,
      applicantName: data.applicantName!,
      applicantType: data.applicantType!,
      type: data.type!,
      vehicleInfo: data.vehicleInfo!,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      documents: data.documents || [],
      registrationFee: data.registrationFee || 2000000,
      plateFee: data.plateFee || 500000,
      totalFee: (data.registrationFee || 2000000) + (data.plateFee || 500000),
      paymentStatus: 'unpaid',
    };

    mockVehicleRegistrations.push(newRegistration);
    return newRegistration;
  }

  return await vehicleApi.createRegistration(data);
};

// ==================== Helper Functions ====================

/**
 * Validate vehicle data
 */
function validateVehicleData(data: Partial<Vehicle>): void => {
  if (!data.plateNumber) {
    throw new Error('Plate number is required');
  }

  if (!data.owner) {
    throw new Error('Owner information is required');
  }

  if (!data.vehicleType) {
    throw new Error('Vehicle type is required');
  }

  if (!data.brand || !data.model) {
    throw new Error('Brand and model are required');
  }

  if (!data.engineNumber || !data.chassisNumber) {
    throw new Error('Engine and chassis numbers are required');
  }
}

/**
 * Calculate registration expiry (10 years)
 */
function calculateRegistrationExpiry(): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 10);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate next inspection date (1 year)
 */
function calculateNextInspection(currentDate: string): string => {
  const date = new Date(currentDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

// Export service
export const vehicleService = {
  getAllVehicles,
  getVehicleById,
  getVehicleByPlate,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  isInspectionDue,
  isInspectionDueSoon,
  getDaysUntilInspection,
  getAllInspections,
  getInspectionsByVehicle,
  scheduleInspection,
  getAllRegistrations,
  createRegistration,
};

export default vehicleService;
