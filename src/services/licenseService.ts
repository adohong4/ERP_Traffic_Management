import licenseApi from '@/api/modules/license.api';
import type { DriverLicense } from '@/types';

export const licenseService = {
  getAllLicenses: async (page: number = 1, size: number = 20) => {
    return await licenseApi.getLicenses({ page, size });
  },

  getLicenseById: async (id: string): Promise<DriverLicense> => {
    return await licenseApi.getLicenseById(id);
  },

  getLicenseByWalletAddress: async (address: string): Promise<DriverLicense> => {
    return await licenseApi.getLicenseByWalletAddress(address);
  },

  createLicense: async (data: Partial<DriverLicense>): Promise<DriverLicense> => {
    return await licenseApi.createLicense(data);
  },

  updateLicense: async (
    id: string,
    data: Partial<DriverLicense>
  ): Promise<DriverLicense> => {
    return await licenseApi.updateLicense(id, data);
  },

  deleteLicense: async (id: string): Promise<void> => {
    await licenseApi.deleteLicense(id);
  },

  searchLicenses: async (
    licenseNo: string,
    page: number = 1,
    size: number = 20
  ) => {
    return await licenseApi.searchLicenses(licenseNo, { page, size });
  },

  confirmBlockchainStorage: async (id: string, txHash: string) => {
    return await licenseApi.confirmBlockchainStorage(id, txHash);
  },

  addWalletAddress: async (id: string, walletAddress: string) => {
    return await licenseApi.addWalletAddress(id, walletAddress);
  },

  // Statistics
  getStatusStats: async () => await licenseApi.getStatusStats(),
  getLicenseTypeStats: async () => await licenseApi.getLicenseTypeStats(),
  getLicenseTypeDetailStats: async () => await licenseApi.getLicenseTypeDetailStats(),
  getCityDetailStats: async () => await licenseApi.getCityDetailStats(),

  // Helpers
  isLicenseExpired: (license: DriverLicense): boolean => {
    if (!license.expiry_date) return false;
    return new Date(license.expiry_date) < new Date();
  },

  getDaysUntilExpiry: (license: DriverLicense): number => {
    if (!license.expiry_date) return Infinity;
    const diff = new Date(license.expiry_date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },
};

export default licenseService;