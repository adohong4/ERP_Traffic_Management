import { licenseApi } from '@/api';
import { mockLicenses, mockLicenseApplications } from '@/lib/mockData';
import type { DriverLicense, LicenseApplication } from '@/types';

/**
 * License Service
 * 
 * Business logic layer for license management
 * Handles data transformation, validation, and business rules
 */

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Get all licenses with optional filters
 */
export const getAllLicenses = async (filters?: {
  search?: string;
  status?: string;
  class?: string;
  province?: string;
}): Promise<DriverLicense[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockLicenses];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (license) =>
          license.fullName.toLowerCase().includes(search) ||
          license.licenseNumber.includes(search) ||
          license.idNumber.includes(search)
      );
    }

    if (filters?.status) {
      data = data.filter((license) => license.status === filters.status);
    }

    if (filters?.class) {
      data = data.filter((license) => license.class === filters.class);
    }

    if (filters?.province) {
      data = data.filter((license) => license.province === filters.province);
    }

    return data;
  }

  // Real API call
  const response = await licenseApi.getLicenses(filters);
  return response.data;
};

/**
 * Get license by ID
 */
export const getLicenseById = async (id: string): Promise<DriverLicense | undefined> => {
  if (USE_MOCK_DATA) {
    return mockLicenses.find((license) => license.id === id);
  }

  return await licenseApi.getLicenseById(id);
};

/**
 * Get license by number
 */
export const getLicenseByNumber = async (
  licenseNumber: string
): Promise<DriverLicense | undefined> => {
  if (USE_MOCK_DATA) {
    return mockLicenses.find((license) => license.licenseNumber === licenseNumber);
  }

  return await licenseApi.getLicenseByNumber(licenseNumber);
};

/**
 * Create new license
 */
export const createLicense = async (data: Partial<DriverLicense>): Promise<DriverLicense> => {
  // Validation
  validateLicenseData(data);

  if (USE_MOCK_DATA) {
    const newLicense: DriverLicense = {
      id: `MOCK_${Date.now()}`,
      licenseNumber: data.licenseNumber || generateLicenseNumber(),
      fullName: data.fullName!,
      dateOfBirth: data.dateOfBirth!,
      gender: data.gender!,
      address: data.address!,
      province: data.province!,
      idNumber: data.idNumber!,
      class: data.class!,
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || calculateExpiryDate(data.issueDate),
      issuingAuthority: data.issuingAuthority!,
      status: 'active',
      violations: 0,
      points: 12,
      createdAt: new Date().toISOString(),
    };

    mockLicenses.push(newLicense);
    return newLicense;
  }

  return await licenseApi.createLicense(data);
};

/**
 * Update license
 */
export const updateLicense = async (
  id: string,
  data: Partial<DriverLicense>
): Promise<DriverLicense> => {
  if (USE_MOCK_DATA) {
    const index = mockLicenses.findIndex((license) => license.id === id);
    if (index === -1) {
      throw new Error('License not found');
    }

    mockLicenses[index] = {
      ...mockLicenses[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockLicenses[index];
  }

  return await licenseApi.updateLicense(id, data);
};

/**
 * Delete license
 */
export const deleteLicense = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    const index = mockLicenses.findIndex((license) => license.id === id);
    if (index !== -1) {
      mockLicenses.splice(index, 1);
    }
    return;
  }

  await licenseApi.deleteLicense(id);
};

/**
 * Renew license
 */
export const renewLicense = async (id: string): Promise<DriverLicense> => {
  const license = await getLicenseById(id);
  if (!license) {
    throw new Error('License not found');
  }

  const newExpiryDate = calculateExpiryDate(new Date().toISOString().split('T')[0]);

  return await updateLicense(id, {
    status: 'active',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: newExpiryDate,
  });
};

/**
 * Suspend license
 */
export const suspendLicense = async (id: string, reason: string): Promise<DriverLicense> => {
  return await updateLicense(id, {
    status: 'suspended',
  });
};

/**
 * Restore license
 */
export const restoreLicense = async (id: string): Promise<DriverLicense> => {
  return await updateLicense(id, {
    status: 'active',
  });
};

/**
 * Check if license is expired
 */
export const isLicenseExpired = (license: DriverLicense): boolean => {
  const expiryDate = new Date(license.expiryDate);
  const today = new Date();
  return expiryDate < today;
};

/**
 * Check if license is expiring soon (within 30 days)
 */
export const isLicenseExpiringSoon = (license: DriverLicense): boolean => {
  const expiryDate = new Date(license.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};

/**
 * Get days until license expires
 */
export const getDaysUntilExpiry = (license: DriverLicense): number => {
  const expiryDate = new Date(license.expiryDate);
  const today = new Date();
  return Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Get license applications
 */
export const getLicenseApplications = async (filters?: {
  status?: string;
  type?: string;
}): Promise<LicenseApplication[]> => {
  if (USE_MOCK_DATA) {
    let data = [...mockLicenseApplications];

    if (filters?.status) {
      data = data.filter((app) => app.status === filters.status);
    }

    if (filters?.type) {
      data = data.filter((app) => app.type === filters.type);
    }

    return data;
  }

  const response = await licenseApi.getApplications(filters);
  return response.data;
};

// ==================== Helper Functions ====================

/**
 * Validate license data
 */
function validateLicenseData(data: Partial<DriverLicense>): void {
  if (!data.fullName) {
    throw new Error('Full name is required');
  }

  if (!data.dateOfBirth) {
    throw new Error('Date of birth is required');
  }

  if (!data.idNumber) {
    throw new Error('ID number is required');
  }

  if (!data.class) {
    throw new Error('License class is required');
  }

  if (!data.address) {
    throw new Error('Address is required');
  }

  if (!data.province) {
    throw new Error('Province is required');
  }

  if (!data.issuingAuthority) {
    throw new Error('Issuing authority is required');
  }
}

/**
 * Generate license number
 */
function generateLicenseNumber(): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp.slice(-9)}${random}`;
}

/**
 * Calculate expiry date (10 years from issue date)
 */
function calculateExpiryDate(issueDate?: string): string {
  const date = issueDate ? new Date(issueDate) : new Date();
  date.setFullYear(date.getFullYear() + 10);
  return date.toISOString().split('T')[0];
}

// Export service
export const licenseService = {
  getAllLicenses,
  getLicenseById,
  getLicenseByNumber,
  createLicense,
  updateLicense,
  deleteLicense,
  renewLicense,
  suspendLicense,
  restoreLicense,
  isLicenseExpired,
  isLicenseExpiringSoon,
  getDaysUntilExpiry,
  getLicenseApplications,
};

export default licenseService;
