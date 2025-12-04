// Vehicle API endpoints with mock responses

import { vehicles, violations } from '../lib/mockData';
import type {
  GetVehiclesParams,
  GetVehiclesResponse,
  GetVehicleByIdParams,
  GetVehicleByIdResponse,
  CreateVehicleBody,
  CreateVehicleResponse,
  UpdateVehicleBody,
  UpdateVehicleResponse,
  VehicleInspection,
  ApiError
} from './types';

// Helper functions
const createResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

const createError = (code: string, message: string, details?: any): ApiError => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date().toISOString()
});

const paginate = <T>(items: T[], page: number = 1, limit: number = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    items: paginatedItems,
    pagination: { page, limit, total, totalPages }
  };
};

// Mock inspection data
const mockInspections: VehicleInspection[] = [
  {
    id: 'insp_1',
    vehicleId: '1',
    inspectionDate: '2024-01-15',
    nextInspection: '2025-01-15',
    result: 'passed',
    inspector: 'Nguyễn Văn A',
    center: 'Trung tâm Đăng kiểm 29-01S',
    notes: 'Xe đạt tiêu chuẩn an toàn'
  }
];

/**
 * GET /api/vehicles
 * Get list of vehicles with filters and pagination
 */
export const getVehicles = async (params: GetVehiclesParams = {}): Promise<GetVehiclesResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'registrationDate',
      sortOrder = 'desc',
      search,
      status,
      city,
      vehicleType,
      brand,
      inspectionStatus,
      dateFrom,
      dateTo
    } = params;

    // Filter vehicles
    let filtered = [...vehicles];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(v => 
        v.plateNumber.toLowerCase().includes(searchLower) ||
        v.owner.toLowerCase().includes(searchLower) ||
        v.ownerPhone.includes(searchLower)
      );
    }

    if (status) {
      filtered = filtered.filter(v => v.status === status);
    }

    if (city) {
      filtered = filtered.filter(v => v.city === city);
    }

    if (vehicleType) {
      filtered = filtered.filter(v => v.vehicleType === vehicleType);
    }

    if (brand) {
      filtered = filtered.filter(v => v.brand === brand);
    }

    if (inspectionStatus) {
      filtered = filtered.filter(v => v.status === inspectionStatus);
    }

    if (dateFrom) {
      filtered = filtered.filter(v => new Date(v.registrationDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(v => new Date(v.registrationDate) <= new Date(dateTo));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'registrationDate' || sortBy === 'lastInspection' || sortBy === 'nextInspection') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Paginate
    const paginatedData = paginate(filtered, page, limit);

    return createResponse(paginatedData);
  } catch (error: any) {
    return createError('GET_VEHICLES_ERROR', 'Failed to fetch vehicles', error.message);
  }
};

/**
 * GET /api/vehicles/:id
 * Get vehicle detail with inspection history and violations
 */
export const getVehicleById = async (params: GetVehicleByIdParams): Promise<GetVehicleByIdResponse | ApiError> => {
  try {
    const { id } = params;
    
    const vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return createError('VEHICLE_NOT_FOUND', `Vehicle with id ${id} not found`);
    }

    // Get inspection history
    const inspections = mockInspections.filter(i => i.vehicleId === id);

    // Get violations for this vehicle
    const vehicleViolations = violations.filter(v => v.plateNumber === vehicle.plateNumber);

    return createResponse({
      vehicle,
      inspections,
      violations: vehicleViolations
    });
  } catch (error: any) {
    return createError('GET_VEHICLE_ERROR', 'Failed to fetch vehicle', error.message);
  }
};

/**
 * POST /api/vehicles
 * Create new vehicle
 */
export const createVehicle = async (body: CreateVehicleBody): Promise<CreateVehicleResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.plateNumber || !body.owner || !body.ownerPhone || !body.vehicleType || !body.brand || !body.city) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Check if plate number already exists
    if (vehicles.find(v => v.plateNumber === body.plateNumber)) {
      return createError('DUPLICATE_PLATE', 'Vehicle with this plate number already exists');
    }

    // Create new vehicle
    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const newVehicle = {
      id: `veh_${Date.now()}`,
      plateNumber: body.plateNumber,
      owner: body.owner,
      ownerPhone: body.ownerPhone,
      vehicleType: body.vehicleType,
      brand: body.brand,
      model: body.model,
      color: body.color,
      registrationDate: now.toISOString().split('T')[0],
      lastInspection: now.toISOString().split('T')[0],
      nextInspection: nextYear.toISOString().split('T')[0],
      status: 'valid' as const,
      city: body.city,
      onBlockchain: false
    };

    // In real app, save to database
    vehicles.push(newVehicle);

    return createResponse(newVehicle, 'Vehicle registered successfully');
  } catch (error: any) {
    return createError('CREATE_VEHICLE_ERROR', 'Failed to create vehicle', error.message);
  }
};

/**
 * PUT /api/vehicles/:id
 * Update vehicle
 */
export const updateVehicle = async (id: string, body: UpdateVehicleBody): Promise<UpdateVehicleResponse | ApiError> => {
  try {
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return createError('VEHICLE_NOT_FOUND', `Vehicle with id ${id} not found`);
    }

    // Update vehicle
    const updatedVehicle = {
      ...vehicles[vehicleIndex],
      ...body
    };

    vehicles[vehicleIndex] = updatedVehicle;

    return createResponse(updatedVehicle, 'Vehicle updated successfully');
  } catch (error: any) {
    return createError('UPDATE_VEHICLE_ERROR', 'Failed to update vehicle', error.message);
  }
};

/**
 * DELETE /api/vehicles/:id
 * Delete vehicle (move to trash)
 */
export const deleteVehicle = async (id: string) => {
  try {
    const vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return createError('VEHICLE_NOT_FOUND', `Vehicle with id ${id} not found`);
    }

    // In real app, move to trash
    const index = vehicles.findIndex(v => v.id === id);
    vehicles.splice(index, 1);

    return createResponse({ deleted: true }, 'Vehicle moved to trash');
  } catch (error: any) {
    return createError('DELETE_VEHICLE_ERROR', 'Failed to delete vehicle', error.message);
  }
};

/**
 * POST /api/vehicles/:id/inspect
 * Record new inspection
 */
export const inspectVehicle = async (
  id: string,
  body: {
    result: 'passed' | 'failed' | 'pending';
    inspector: string;
    center: string;
    notes?: string;
  }
) => {
  try {
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return createError('VEHICLE_NOT_FOUND', `Vehicle with id ${id} not found`);
    }

    const vehicle = vehicles[vehicleIndex];
    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    // Create inspection record
    const newInspection: VehicleInspection = {
      id: `insp_${Date.now()}`,
      vehicleId: id,
      inspectionDate: now.toISOString().split('T')[0],
      nextInspection: nextYear.toISOString().split('T')[0],
      result: body.result,
      inspector: body.inspector,
      center: body.center,
      notes: body.notes
    };

    mockInspections.push(newInspection);

    // Update vehicle
    if (body.result === 'passed') {
      const updatedVehicle = {
        ...vehicle,
        lastInspection: now.toISOString().split('T')[0],
        nextInspection: nextYear.toISOString().split('T')[0],
        status: 'valid' as const
      };
      vehicles[vehicleIndex] = updatedVehicle;
    }

    return createResponse(newInspection, 'Inspection recorded successfully');
  } catch (error: any) {
    return createError('INSPECT_VEHICLE_ERROR', 'Failed to record inspection', error.message);
  }
};

/**
 * GET /api/vehicles/stats
 * Get vehicle statistics
 */
export const getVehicleStats = async (city?: string) => {
  try {
    let filtered = city ? vehicles.filter(v => v.city === city) : vehicles;

    const stats = {
      total: filtered.length,
      valid: filtered.filter(v => v.status === 'valid').length,
      expired: filtered.filter(v => v.status === 'expired').length,
      pending: filtered.filter(v => v.status === 'pending').length,
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byBrand: {} as Record<string, number>,
      onBlockchain: filtered.filter(v => v.onBlockchain).length,
      inspectionsDue: filtered.filter(v => {
        const daysUntilInspection = Math.ceil((new Date(v.nextInspection).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilInspection <= 30 && daysUntilInspection >= 0;
      }).length
    };

    // Group by type
    filtered.forEach(v => {
      stats.byType[v.vehicleType] = (stats.byType[v.vehicleType] || 0) + 1;
    });

    // Group by city
    filtered.forEach(v => {
      stats.byCity[v.city] = (stats.byCity[v.city] || 0) + 1;
    });

    // Group by brand
    filtered.forEach(v => {
      stats.byBrand[v.brand] = (stats.byBrand[v.brand] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_STATS_ERROR', 'Failed to get vehicle statistics', error.message);
  }
};

/**
 * GET /api/vehicles/inspections-due
 * Get vehicles with inspections due soon
 */
export const getInspectionsDue = async (days: number = 30, city?: string) => {
  try {
    let filtered = city ? vehicles.filter(v => v.city === city) : vehicles;

    const inspectionsDue = filtered.filter(v => {
      const daysUntilInspection = Math.ceil((new Date(v.nextInspection).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilInspection <= days && daysUntilInspection >= 0;
    }).map(v => ({
      ...v,
      daysUntilInspection: Math.ceil((new Date(v.nextInspection).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    })).sort((a, b) => a.daysUntilInspection - b.daysUntilInspection);

    return createResponse(inspectionsDue);
  } catch (error: any) {
    return createError('GET_INSPECTIONS_DUE_ERROR', 'Failed to get inspections due', error.message);
  }
};
