import { api } from '../base/apiClient';
import { API_ENDPOINTS, buildUrl } from '../base/endpoints';
import type {
  DriverLicense,
  PaginatedResponse,
  StatusDistribution,
  LicenseTypeDistribution,
  LicenseTypeDetailDistribution,
  CityDetailDistribution,
  ApiResponse,
} from '@/types';

export const licenseApi = {
  getLicenses: async (params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<DriverLicense>> => {
    const url = buildUrl(API_ENDPOINTS.LICENSES.LIST, params);
    const response = await api.get<PaginatedResponse<DriverLicense>>(url);
    return response.data;
  },

  getLicenseById: async (id: string): Promise<DriverLicense> => {
    const response = await api.get<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.GET(id)
    );
    return response.data.data!;
  },

  getLicenseByWalletAddress: async (address: string): Promise<DriverLicense> => {
    const response = await api.get<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.BY_WALLET(address)
    );
    return response.data.data!;
  },

  createLicense: async (data: Partial<DriverLicense>): Promise<DriverLicense> => {
    const response = await api.post<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.CREATE,
      data
    );
    return response.data.data!;
  },

  updateLicense: async (
    id: string,
    data: Partial<DriverLicense>
  ): Promise<DriverLicense> => {
    const response = await api.put<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.UPDATE(id),
      data
    );
    return response.data.data!;
  },

  deleteLicense: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.LICENSES.DELETE(id));
  },

  searchLicenses: async (
    licenseNo: string,
    params?: { page?: number; size?: number }
  ): Promise<PaginatedResponse<DriverLicense>> => {
    const url = buildUrl(API_ENDPOINTS.LICENSES.SEARCH, {
      license_no: licenseNo,
      ...params,
    });
    const response = await api.get<ApiResponse<PaginatedResponse<DriverLicense>>>(url);
    return response.data.data!;
  },

  // ==================== Blockchain Actions ====================
  confirmBlockchainStorage: async (
    id: string,
    blockchainTxHash: string
  ): Promise<DriverLicense> => {
    const response = await api.put<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.CONFIRM_BLOCKCHAIN(id),
      { blockchain_txhash: blockchainTxHash }
    );
    return response.data.data!;
  },

  addWalletAddress: async (
    id: string,
    walletAddress: string
  ): Promise<DriverLicense> => {
    const response = await api.put<ApiResponse<DriverLicense>>(
      API_ENDPOINTS.LICENSES.ADD_WALLET(id),
      { wallet_address: walletAddress }
    );
    return response.data.data!;
  },

  // ==================== Statistics ====================
  getStatusStats: async (): Promise<StatusDistribution> => {
    const response = await api.get<ApiResponse<StatusDistribution>>(
      API_ENDPOINTS.LICENSES.STATS.STATUS
    );
    return response.data.data!;
  },

  getLicenseTypeStats: async (): Promise<LicenseTypeDistribution> => {
    const response = await api.get<ApiResponse<LicenseTypeDistribution>>(
      API_ENDPOINTS.LICENSES.STATS.LICENSE_TYPE
    );
    return response.data.data!;
  },

  getLicenseTypeDetailStats: async (): Promise<LicenseTypeDetailDistribution> => {
    const response = await api.get<ApiResponse<LicenseTypeDetailDistribution>>(
      API_ENDPOINTS.LICENSES.STATS.LICENSE_TYPE_DETAIL
    );
    return response.data.data!;
  },

  getCityDetailStats: async (): Promise<CityDetailDistribution> => {
    const response = await api.get<ApiResponse<CityDetailDistribution>>(
      API_ENDPOINTS.LICENSES.STATS.CITY_DETAIL
    );
    return response.data.data!;
  },
};

export default licenseApi;