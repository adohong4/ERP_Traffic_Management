import { violationApi } from '@/api';
import { mockViolations } from '@/lib/mockData';
import type { TrafficViolation } from '@/types';

/**
 * Violation Service
 * 
 * Business logic layer for traffic violation management
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Get all violations with optional filters
 */
export const getAllViolations = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  province?: string;
}): Promise<TrafficViolation[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockViolations];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (violation) =>
          violation.violatorInfo.name.toLowerCase().includes(search) ||
          violation.violationNumber.toLowerCase().includes(search) ||
          violation.violatorInfo.licenseNumber?.toLowerCase().includes(search) ||
          violation.vehicleInfo?.plateNumber.toLowerCase().includes(search)
      );
    }

    if (filters?.status) {
      data = data.filter((violation) => violation.status === filters.status);
    }

    if (filters?.type) {
      data = data.filter((violation) => violation.violationType === filters.type);
    }

    if (filters?.province) {
      data = data.filter((violation) => violation.location.province === filters.province);
    }

    if (filters?.dateFrom) {
      data = data.filter((violation) => violation.violationDate >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      data = data.filter((violation) => violation.violationDate <= filters.dateTo!);
    }

    return data;
  }

  const response = await violationApi.getViolations(filters);
  return response.data;
};

/**
 * Get violation by ID
 */
export const getViolationById = async (id: string): Promise<TrafficViolation | undefined> => {
  if (USE_MOCK_DATA) {
    return mockViolations.find((violation) => violation.id === id);
  }

  return await violationApi.getViolationById(id);
};

/**
 * Get violations by license number
 */
export const getViolationsByLicense = async (
  licenseNumber: string
): Promise<TrafficViolation[]> => {
  if (USE_MOCK_DATA) {
    return mockViolations.filter(
      (violation) => violation.violatorInfo.licenseNumber === licenseNumber
    );
  }

  return await violationApi.getViolationsByLicense(licenseNumber);
};

/**
 * Get violations by plate number
 */
export const getViolationsByPlate = async (plateNumber: string): Promise<TrafficViolation[]> => {
  if (USE_MOCK_DATA) {
    return mockViolations.filter(
      (violation) => violation.vehicleInfo?.plateNumber === plateNumber
    );
  }

  return await violationApi.getViolationsByVehicle(plateNumber);
};

/**
 * Create new violation
 */
export const createViolation = async (
  data: Partial<TrafficViolation>
): Promise<TrafficViolation> => {
  validateViolationData(data);

  if (USE_MOCK_DATA) {
    const newViolation: TrafficViolation = {
      id: `${Date.now()}`,
      violationCode: data.violationCode || `VL${Date.now()}`,
      violationNumber: data.violationNumber || `BB${new Date().getFullYear()}${mockViolations.length + 1}`,
      violatorInfo: data.violatorInfo!,
      vehicleInfo: data.vehicleInfo,
      violationType: data.violationType!,
      violationDate: data.violationDate || new Date().toISOString().split('T')[0],
      violationTime: data.violationTime || new Date().toTimeString().split(' ')[0],
      location: data.location!,
      officer: data.officer!,
      description: data.description!,
      fine: data.fine || 0,
      pointsDeducted: data.pointsDeducted || 0,
      status: 'pending',
      evidence: data.evidence || [],
      createdAt: new Date().toISOString(),
    };

    mockViolations.push(newViolation);
    return newViolation;
  }

  return await violationApi.createViolation(data);
};

/**
 * Update violation
 */
export const updateViolation = async (
  id: string,
  data: Partial<TrafficViolation>
): Promise<TrafficViolation> => {
  if (USE_MOCK_DATA) {
    const index = mockViolations.findIndex((violation) => violation.id === id);
    if (index === -1) {
      throw new Error('Violation not found');
    }

    mockViolations[index] = {
      ...mockViolations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockViolations[index];
  }

  return await violationApi.updateViolation(id, data);
};

/**
 * Delete violation
 */
export const deleteViolation = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    const index = mockViolations.findIndex((violation) => violation.id === id);
    if (index !== -1) {
      mockViolations.splice(index, 1);
    }
    return;
  }

  await violationApi.deleteViolation(id);
};

/**
 * Pay violation fine
 */
export const payViolation = async (
  id: string,
  paymentData: {
    paymentMethod: string;
    amount: number;
    transactionNumber?: string;
  }
): Promise<TrafficViolation> => {
  if (USE_MOCK_DATA) {
    const violation = await getViolationById(id);
    if (!violation) {
      throw new Error('Violation not found');
    }

    return await updateViolation(id, {
      status: 'paid',
      paymentInfo: {
        paymentId: `PAY${Date.now()}`,
        paymentMethod: paymentData.paymentMethod as any,
        amount: paymentData.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        transactionNumber: paymentData.transactionNumber,
        receiptNumber: `RCP${Date.now()}`,
        status: 'completed',
      },
    });
  }

  return await violationApi.payViolation(id, paymentData);
};

/**
 * Get unpaid violations
 */
export const getUnpaidViolations = async (filters?: {
  licenseNumber?: string;
  plateNumber?: string;
}): Promise<TrafficViolation[]> => {
  if (USE_MOCK_DATA) {
    let data = mockViolations.filter((v) => v.status === 'unpaid' || v.status === 'pending');

    if (filters?.licenseNumber) {
      data = data.filter((v) => v.violatorInfo.licenseNumber === filters.licenseNumber);
    }

    if (filters?.plateNumber) {
      data = data.filter((v) => v.vehicleInfo?.plateNumber === filters.plateNumber);
    }

    return data;
  }

  return await violationApi.getUnpaidViolations(filters);
};

/**
 * Calculate total fines for violations
 */
export const calculateTotalFines = (violations: TrafficViolation[]): number => {
  return violations.reduce((total, violation) => total + violation.fine, 0);
};

/**
 * Calculate unpaid fines
 */
export const calculateUnpaidFines = (violations: TrafficViolation[]): number => {
  return violations
    .filter((v) => v.status === 'unpaid' || v.status === 'pending')
    .reduce((total, violation) => total + violation.fine, 0);
};

/**
 * Calculate total points deducted
 */
export const calculateTotalPoints = (violations: TrafficViolation[]): number => {
  return violations.reduce((total, violation) => total + (violation.pointsDeducted || 0), 0);
};

/**
 * Get violation severity level
 */
export const getViolationSeverity = (violation: TrafficViolation): 'low' | 'medium' | 'high' => {
  if (violation.fine >= 10000000) return 'high';
  if (violation.fine >= 5000000) return 'medium';
  return 'low';
};

/**
 * Check if violation is overdue (unpaid for more than 30 days)
 */
export const isViolationOverdue = (violation: TrafficViolation): boolean => {
  if (violation.status !== 'unpaid' && violation.status !== 'pending') {
    return false;
  }

  const violationDate = new Date(violation.violationDate);
  const today = new Date();
  const daysSinceViolation = Math.floor(
    (today.getTime() - violationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceViolation > 30;
};

// ==================== Helper Functions ====================

/**
 * Validate violation data
 */
function validateViolationData(data: Partial<TrafficViolation>): void => {
  if (!data.violatorInfo) {
    throw new Error('Violator information is required');
  }

  if (!data.violatorInfo.name) {
    throw new Error('Violator name is required');
  }

  if (!data.violationType) {
    throw new Error('Violation type is required');
  }

  if (!data.location) {
    throw new Error('Violation location is required');
  }

  if (!data.officer) {
    throw new Error('Officer information is required');
  }

  if (!data.description) {
    throw new Error('Violation description is required');
  }
}

// Export service
export const violationService = {
  getAllViolations,
  getViolationById,
  getViolationsByLicense,
  getViolationsByPlate,
  createViolation,
  updateViolation,
  deleteViolation,
  payViolation,
  getUnpaidViolations,
  calculateTotalFines,
  calculateUnpaidFines,
  calculateTotalPoints,
  getViolationSeverity,
  isViolationOverdue,
};

export default violationService;
