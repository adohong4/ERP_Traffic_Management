// License API endpoints with mock responses

import { licenses, licenseHistory, violations } from '../lib/mockData';
import type {
  GetLicensesParams,
  GetLicensesResponse,
  GetLicenseByIdParams,
  GetLicenseByIdResponse,
  CreateLicenseBody,
  CreateLicenseResponse,
  UpdateLicenseBody,
  UpdateLicenseResponse,
  DeleteLicenseResponse,
  ApiError
} from './types';

// Helper to create success response
const createResponse = <T>(data: T, message?: string): { success: boolean; data: T; message?: string; timestamp: string } => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

// Helper to create error response
const createError = (code: string, message: string, details?: any): ApiError => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date().toISOString()
});

// Helper for pagination
const paginate = <T>(items: T[], page: number = 1, limit: number = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

/**
 * GET /api/licenses
 * Get list of licenses with filters and pagination
 */
export const getLicenses = async (params: GetLicensesParams = {}): Promise<GetLicensesResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'issueDate',
      sortOrder = 'desc',
      search,
      status,
      city,
      licenseType,
      onBlockchain,
      violations: violationCount,
      dateFrom,
      dateTo
    } = params;

    // Filter licenses
    let filtered = [...licenses];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.holderName.toLowerCase().includes(searchLower) ||
        l.licenseNumber.toLowerCase().includes(searchLower) ||
        l.idCard.includes(searchLower)
      );
    }

    if (status) {
      filtered = filtered.filter(l => l.status === status);
    }

    if (city) {
      filtered = filtered.filter(l => l.city === city);
    }

    if (licenseType) {
      filtered = filtered.filter(l => l.licenseType === licenseType);
    }

    if (onBlockchain !== undefined) {
      filtered = filtered.filter(l => l.onBlockchain === onBlockchain);
    }

    if (violationCount !== undefined) {
      filtered = filtered.filter(l => l.violations >= violationCount);
    }

    if (dateFrom) {
      filtered = filtered.filter(l => new Date(l.issueDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(l => new Date(l.issueDate) <= new Date(dateTo));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];

      if (sortBy === 'issueDate' || sortBy === 'expiryDate') {
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
    return createError('GET_LICENSES_ERROR', 'Failed to fetch licenses', error.message);
  }
};

/**
 * GET /api/licenses/:id
 * Get license detail with history and violations
 */
export const getLicenseById = async (params: GetLicenseByIdParams): Promise<GetLicenseByIdResponse | ApiError> => {
  try {
    const { id } = params;

    const license = licenses.find(l => l.id === id);

    if (!license) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    // Get license history
    const history = licenseHistory.filter(h => h.licenseId === id);

    // Get violations for this license
    const licenseViolations = violations.filter(v => v.licenseNumber === license.licenseNumber);

    return createResponse({
      license,
      history,
      violations: licenseViolations
    });
  } catch (error: any) {
    return createError('GET_LICENSE_ERROR', 'Failed to fetch license', error.message);
  }
};

/**
 * POST /api/licenses
 * Create new license
 */
export const createLicense = async (body: CreateLicenseBody): Promise<CreateLicenseResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.holderName || !body.idCard || !body.licenseType || !body.city || !body.issuePlace) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Generate license number
    const licenseNumber = `GPLX${Date.now().toString().slice(-8)}`;

    // Create new license
    const newLicense = {
      id: `lic_${Date.now()}`,
      licenseNumber,
      holderName: body.holderName,
      idCard: body.idCard,
      licenseType: body.licenseType,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 years
      status: 'active' as const,
      violations: 0,
      city: body.city,
      issuePlace: body.issuePlace,
      walletAddress: body.walletAddress,
      onBlockchain: false
    };

    // In real app, save to database
    licenses.push(newLicense);

    return createResponse(newLicense, 'License created successfully');
  } catch (error: any) {
    return createError('CREATE_LICENSE_ERROR', 'Failed to create license', error.message);
  }
};

/**
 * PUT /api/licenses/:id
 * Update license
 */
export const updateLicense = async (id: string, body: UpdateLicenseBody): Promise<UpdateLicenseResponse | ApiError> => {
  try {
    const licenseIndex = licenses.findIndex(l => l.id === id);

    if (licenseIndex === -1) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    // Update license
    const updatedLicense = {
      ...licenses[licenseIndex],
      ...body
    };

    licenses[licenseIndex] = updatedLicense;

    return createResponse(updatedLicense, 'License updated successfully');
  } catch (error: any) {
    return createError('UPDATE_LICENSE_ERROR', 'Failed to update license', error.message);
  }
};

/**
 * DELETE /api/licenses/:id
 * Delete license (move to trash)
 */
export const deleteLicense = async (id: string): Promise<DeleteLicenseResponse | ApiError> => {
  try {
    const license = licenses.find(l => l.id === id);

    if (!license) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    // In real app, move to trash instead of permanent delete
    const index = licenses.findIndex(l => l.id === id);
    licenses.splice(index, 1);

    return createResponse({ deleted: true }, 'License moved to trash');
  } catch (error: any) {
    return createError('DELETE_LICENSE_ERROR', 'Failed to delete license', error.message);
  }
};

/**
 * POST /api/licenses/:id/renew
 * Renew expired license
 */
export const renewLicense = async (id: string): Promise<UpdateLicenseResponse | ApiError> => {
  try {
    const licenseIndex = licenses.findIndex(l => l.id === id);

    if (licenseIndex === -1) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    const license = licenses[licenseIndex];

    // Update expiry date
    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 10);

    const updatedLicense = {
      ...license,
      status: 'active' as const,
      expiryDate: newExpiryDate.toISOString().split('T')[0]
    };

    licenses[licenseIndex] = updatedLicense;

    return createResponse(updatedLicense, 'License renewed successfully');
  } catch (error: any) {
    return createError('RENEW_LICENSE_ERROR', 'Failed to renew license', error.message);
  }
};

/**
 * POST /api/licenses/:id/suspend
 * Suspend license
 */
export const suspendLicense = async (id: string, reason: string): Promise<UpdateLicenseResponse | ApiError> => {
  try {
    const licenseIndex = licenses.findIndex(l => l.id === id);

    if (licenseIndex === -1) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    const updatedLicense = {
      ...licenses[licenseIndex],
      status: 'suspended' as const
    };

    licenses[licenseIndex] = updatedLicense;

    return createResponse(updatedLicense, `License suspended: ${reason}`);
  } catch (error: any) {
    return createError('SUSPEND_LICENSE_ERROR', 'Failed to suspend license', error.message);
  }
};

/**
 * POST /api/licenses/:id/revoke
 * Revoke license
 */
export const revokeLicense = async (id: string, reason: string): Promise<UpdateLicenseResponse | ApiError> => {
  try {
    const licenseIndex = licenses.findIndex(l => l.id === id);

    if (licenseIndex === -1) {
      return createError('LICENSE_NOT_FOUND', `License with id ${id} not found`);
    }

    const updatedLicense = {
      ...licenses[licenseIndex],
      status: 'revoked' as const
    };

    licenses[licenseIndex] = updatedLicense;

    return createResponse(updatedLicense, `License revoked: ${reason}`);
  } catch (error: any) {
    return createError('REVOKE_LICENSE_ERROR', 'Failed to revoke license', error.message);
  }
};

/**
 * GET /api/licenses/stats
 * Get license statistics
 */
export const getLicenseStats = async (city?: string) => {
  try {
    let filtered = city ? licenses.filter(l => l.city === city) : licenses;

    const stats = {
      total: filtered.length,
      active: filtered.filter(l => l.status === 'active').length,
      expired: filtered.filter(l => l.status === 'expired').length,
      suspended: filtered.filter(l => l.status === 'suspended').length,
      revoked: filtered.filter(l => l.status === 'revoked').length,
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      onBlockchain: filtered.filter(l => l.onBlockchain).length,
      withViolations: filtered.filter(l => l.violations > 0).length
    };

    // Group by type
    filtered.forEach(l => {
      stats.byType[l.licenseType] = (stats.byType[l.licenseType] || 0) + 1;
    });

    // Group by city
    filtered.forEach(l => {
      stats.byCity[l.city] = (stats.byCity[l.city] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_STATS_ERROR', 'Failed to get license statistics', error.message);
  }
};
