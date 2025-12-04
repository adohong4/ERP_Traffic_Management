// Violation API endpoints with mock responses

import { violations, licenses, vehicles } from '../lib/mockData';
import type {
  GetViolationsParams,
  GetViolationsResponse,
  GetViolationByIdParams,
  GetViolationByIdResponse,
  CreateViolationBody,
  CreateViolationResponse,
  UpdateViolationBody,
  UpdateViolationResponse,
  PayViolationBody,
  PayViolationResponse,
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

/**
 * GET /api/violations
 * Get list of violations with filters and pagination
 */
export const getViolations = async (params: GetViolationsParams = {}): Promise<GetViolationsResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      search,
      status,
      city,
      violationType,
      licenseNumber,
      plateNumber,
      minFine,
      maxFine,
      dateFrom,
      dateTo
    } = params;

    // Filter violations
    let filtered = [...violations];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(v => 
        v.violatorName.toLowerCase().includes(searchLower) ||
        v.licenseNumber.toLowerCase().includes(searchLower) ||
        v.plateNumber.toLowerCase().includes(searchLower) ||
        v.location.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      filtered = filtered.filter(v => v.status === status);
    }

    if (city) {
      filtered = filtered.filter(v => v.city === city);
    }

    if (violationType) {
      filtered = filtered.filter(v => v.violationType === violationType);
    }

    if (licenseNumber) {
      filtered = filtered.filter(v => v.licenseNumber === licenseNumber);
    }

    if (plateNumber) {
      filtered = filtered.filter(v => v.plateNumber === plateNumber);
    }

    if (minFine !== undefined) {
      filtered = filtered.filter(v => v.fine >= minFine);
    }

    if (maxFine !== undefined) {
      filtered = filtered.filter(v => v.fine <= maxFine);
    }

    if (dateFrom) {
      filtered = filtered.filter(v => new Date(v.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(v => new Date(v.date) <= new Date(dateTo));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'date' || sortBy === 'paymentDate') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
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
    return createError('GET_VIOLATIONS_ERROR', 'Failed to fetch violations', error.message);
  }
};

/**
 * GET /api/violations/:id
 * Get violation detail with related license and vehicle info
 */
export const getViolationById = async (params: GetViolationByIdParams): Promise<GetViolationByIdResponse | ApiError> => {
  try {
    const { id } = params;
    
    const violation = violations.find(v => v.id === id);
    
    if (!violation) {
      return createError('VIOLATION_NOT_FOUND', `Violation with id ${id} not found`);
    }

    // Get related license
    const license = licenses.find(l => l.licenseNumber === violation.licenseNumber);

    // Get related vehicle
    const vehicle = vehicles.find(v => v.plateNumber === violation.plateNumber);

    return createResponse({
      violation,
      license,
      vehicle
    });
  } catch (error: any) {
    return createError('GET_VIOLATION_ERROR', 'Failed to fetch violation', error.message);
  }
};

/**
 * POST /api/violations
 * Create new violation
 */
export const createViolation = async (body: CreateViolationBody): Promise<CreateViolationResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.violatorName || !body.licenseNumber || !body.plateNumber || !body.violationType || !body.location || !body.fine || !body.officer) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Verify license exists
    const license = licenses.find(l => l.licenseNumber === body.licenseNumber);
    if (!license) {
      return createError('LICENSE_NOT_FOUND', 'License number not found');
    }

    // Verify vehicle exists
    const vehicle = vehicles.find(v => v.plateNumber === body.plateNumber);
    if (!vehicle) {
      return createError('VEHICLE_NOT_FOUND', 'Plate number not found');
    }

    // Create new violation
    const newViolation = {
      id: `vio_${Date.now()}`,
      violatorName: body.violatorName,
      licenseNumber: body.licenseNumber,
      plateNumber: body.plateNumber,
      violationType: body.violationType,
      location: body.location,
      city: body.city,
      date: new Date().toISOString().split('T')[0],
      fine: body.fine,
      status: 'pending' as const,
      points: body.points,
      officer: body.officer,
      description: body.description,
      images: body.images
    };

    // In real app, save to database
    violations.push(newViolation);

    // Update license violation count
    const licenseIndex = licenses.findIndex(l => l.licenseNumber === body.licenseNumber);
    if (licenseIndex !== -1) {
      licenses[licenseIndex].violations += 1;
    }

    return createResponse(newViolation, 'Violation recorded successfully');
  } catch (error: any) {
    return createError('CREATE_VIOLATION_ERROR', 'Failed to create violation', error.message);
  }
};

/**
 * PUT /api/violations/:id
 * Update violation
 */
export const updateViolation = async (id: string, body: UpdateViolationBody): Promise<UpdateViolationResponse | ApiError> => {
  try {
    const violationIndex = violations.findIndex(v => v.id === id);
    
    if (violationIndex === -1) {
      return createError('VIOLATION_NOT_FOUND', `Violation with id ${id} not found`);
    }

    // Update violation
    const updatedViolation = {
      ...violations[violationIndex],
      ...body
    };

    violations[violationIndex] = updatedViolation;

    return createResponse(updatedViolation, 'Violation updated successfully');
  } catch (error: any) {
    return createError('UPDATE_VIOLATION_ERROR', 'Failed to update violation', error.message);
  }
};

/**
 * DELETE /api/violations/:id
 * Delete violation (move to trash)
 */
export const deleteViolation = async (id: string) => {
  try {
    const violation = violations.find(v => v.id === id);
    
    if (!violation) {
      return createError('VIOLATION_NOT_FOUND', `Violation with id ${id} not found`);
    }

    // In real app, move to trash
    const index = violations.findIndex(v => v.id === id);
    violations.splice(index, 1);

    // Update license violation count
    const license = licenses.find(l => l.licenseNumber === violation.licenseNumber);
    if (license && license.violations > 0) {
      license.violations -= 1;
    }

    return createResponse({ deleted: true }, 'Violation moved to trash');
  } catch (error: any) {
    return createError('DELETE_VIOLATION_ERROR', 'Failed to delete violation', error.message);
  }
};

/**
 * POST /api/violations/:id/pay
 * Pay violation fine
 */
export const payViolation = async (id: string, body: PayViolationBody): Promise<PayViolationResponse | ApiError> => {
  try {
    const violationIndex = violations.findIndex(v => v.id === id);
    
    if (violationIndex === -1) {
      return createError('VIOLATION_NOT_FOUND', `Violation with id ${id} not found`);
    }

    const violation = violations[violationIndex];

    if (violation.status === 'paid') {
      return createError('ALREADY_PAID', 'This violation has already been paid');
    }

    // Update violation
    const now = new Date();
    const updatedViolation = {
      ...violation,
      status: 'paid' as const,
      paymentDate: now.toISOString().split('T')[0],
      paymentMethod: body.paymentMethod
    };

    violations[violationIndex] = updatedViolation;

    // Generate receipt
    const receipt = {
      id: `receipt_${Date.now()}`,
      amount: violation.fine,
      date: now.toISOString(),
      method: body.paymentMethod,
      transactionId: body.transactionId || `TXN${Date.now()}`
    };

    return createResponse({
      violation: updatedViolation,
      receipt
    }, 'Payment processed successfully');
  } catch (error: any) {
    return createError('PAY_VIOLATION_ERROR', 'Failed to process payment', error.message);
  }
};

/**
 * GET /api/violations/stats
 * Get violation statistics
 */
export const getViolationStats = async (city?: string) => {
  try {
    let filtered = city ? violations.filter(v => v.city === city) : violations;

    const stats = {
      total: filtered.length,
      pending: filtered.filter(v => v.status === 'pending').length,
      paid: filtered.filter(v => v.status === 'paid').length,
      overdue: filtered.filter(v => v.status === 'overdue').length,
      totalFines: filtered.reduce((sum, v) => sum + v.fine, 0),
      collectedFines: filtered.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.fine, 0),
      pendingFines: filtered.filter(v => v.status !== 'paid').reduce((sum, v) => sum + v.fine, 0),
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      byOfficer: {} as Record<string, number>,
      avgFine: filtered.length > 0 ? Math.round(filtered.reduce((sum, v) => sum + v.fine, 0) / filtered.length) : 0
    };

    // Group by type
    filtered.forEach(v => {
      stats.byType[v.violationType] = (stats.byType[v.violationType] || 0) + 1;
    });

    // Group by city
    filtered.forEach(v => {
      stats.byCity[v.city] = (stats.byCity[v.city] || 0) + 1;
    });

    // Group by officer
    filtered.forEach(v => {
      stats.byOfficer[v.officer] = (stats.byOfficer[v.officer] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_STATS_ERROR', 'Failed to get violation statistics', error.message);
  }
};

/**
 * GET /api/violations/by-license/:licenseNumber
 * Get all violations for a license
 */
export const getViolationsByLicense = async (licenseNumber: string) => {
  try {
    const licenseViolations = violations.filter(v => v.licenseNumber === licenseNumber);
    
    const stats = {
      total: licenseViolations.length,
      pending: licenseViolations.filter(v => v.status === 'pending').length,
      paid: licenseViolations.filter(v => v.status === 'paid').length,
      totalFines: licenseViolations.reduce((sum, v) => sum + v.fine, 0),
      totalPoints: licenseViolations.reduce((sum, v) => sum + v.points, 0),
      violations: licenseViolations
    };

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_LICENSE_VIOLATIONS_ERROR', 'Failed to get license violations', error.message);
  }
};

/**
 * GET /api/violations/by-vehicle/:plateNumber
 * Get all violations for a vehicle
 */
export const getViolationsByVehicle = async (plateNumber: string) => {
  try {
    const vehicleViolations = violations.filter(v => v.plateNumber === plateNumber);
    
    const stats = {
      total: vehicleViolations.length,
      pending: vehicleViolations.filter(v => v.status === 'pending').length,
      paid: vehicleViolations.filter(v => v.status === 'paid').length,
      totalFines: vehicleViolations.reduce((sum, v) => sum + v.fine, 0),
      violations: vehicleViolations
    };

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_VEHICLE_VIOLATIONS_ERROR', 'Failed to get vehicle violations', error.message);
  }
};
