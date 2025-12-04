// Authority API endpoints with mock responses

import type {
  Authority,
  GetAuthoritiesParams,
  GetAuthoritiesResponse,
  GetAuthorityByIdParams,
  GetAuthorityByIdResponse,
  CreateAuthorityBody,
  CreateAuthorityResponse,
  UpdateAuthorityBody,
  UpdateAuthorityResponse,
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

// Mock authorities data
const mockAuthorities: Authority[] = [
  {
    id: 'auth_1',
    name: 'Công an Thành phố Hà Nội',
    code: 'CA-HN-001',
    city: 'Hà Nội',
    address: 'Số 89 Láng Hạ, Ba Đình, Hà Nội',
    phone: '024-3826-5555',
    email: 'cahanoi@police.gov.vn',
    type: 'police',
    status: 'active',
    walletAddress: '0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'auth_2',
    name: 'Công an Tỉnh Thái Nguyên',
    code: 'CA-TN-001',
    city: 'Thái Nguyên',
    address: 'Đường Hoàng Văn Thụ, TP. Thái Nguyên',
    phone: '0280-3852-222',
    email: 'cathainguyen@police.gov.vn',
    type: 'police',
    status: 'active',
    walletAddress: '0xF2438715BBF8C01d4355690cfbC66558a22dEC11',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'auth_3',
    name: 'Trung tâm Đăng kiểm 29-01S',
    code: 'DK-HN-001',
    city: 'Hà Nội',
    address: 'Km 14, Quốc lộ 1A, Hà Đông, Hà Nội',
    phone: '024-3386-5555',
    email: 'dk2901s@registry.gov.vn',
    type: 'inspection',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'auth_4',
    name: 'Trung tâm Đăng kiểm 29-02V',
    code: 'DK-HN-002',
    city: 'Hà Nội',
    address: 'Số 234 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    phone: '024-3557-8888',
    email: 'dk2902v@registry.gov.vn',
    type: 'inspection',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'auth_5',
    name: 'Phòng CSGT Hà Nội',
    code: 'CSGT-HN-001',
    city: 'Hà Nội',
    address: 'Số 12 Láng Hạ, Ba Đình, Hà Nội',
    phone: '024-3826-5566',
    email: 'csgthanoi@police.gov.vn',
    type: 'police',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

/**
 * GET /api/authorities
 * Get list of authorities with filters and pagination
 */
export const getAuthorities = async (params: GetAuthoritiesParams = {}): Promise<GetAuthoritiesResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      search,
      status,
      city,
      type
    } = params;

    // Filter authorities
    let filtered = [...mockAuthorities];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.code.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower) ||
        a.phone.includes(searchLower)
      );
    }

    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    if (city) {
      filtered = filtered.filter(a => a.city === city);
    }

    if (type) {
      filtered = filtered.filter(a => a.type === type);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
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
    return createError('GET_AUTHORITIES_ERROR', 'Failed to fetch authorities', error.message);
  }
};

/**
 * GET /api/authorities/:id
 * Get authority detail by ID
 */
export const getAuthorityById = async (params: GetAuthorityByIdParams): Promise<GetAuthorityByIdResponse | ApiError> => {
  try {
    const { id } = params;
    
    const authority = mockAuthorities.find(a => a.id === id);
    
    if (!authority) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with id ${id} not found`);
    }

    return createResponse(authority);
  } catch (error: any) {
    return createError('GET_AUTHORITY_ERROR', 'Failed to fetch authority', error.message);
  }
};

/**
 * POST /api/authorities
 * Create new authority
 */
export const createAuthority = async (body: CreateAuthorityBody): Promise<CreateAuthorityResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.name || !body.code || !body.city || !body.address || !body.phone || !body.email || !body.type) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Check if code already exists
    if (mockAuthorities.find(a => a.code === body.code)) {
      return createError('DUPLICATE_CODE', 'Authority with this code already exists');
    }

    // Create new authority
    const newAuthority: Authority = {
      id: `auth_${Date.now()}`,
      name: body.name,
      code: body.code,
      city: body.city,
      address: body.address,
      phone: body.phone,
      email: body.email,
      type: body.type,
      status: 'active',
      walletAddress: body.walletAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In real app, save to database
    mockAuthorities.push(newAuthority);

    return createResponse(newAuthority, 'Authority created successfully');
  } catch (error: any) {
    return createError('CREATE_AUTHORITY_ERROR', 'Failed to create authority', error.message);
  }
};

/**
 * PUT /api/authorities/:id
 * Update authority
 */
export const updateAuthority = async (id: string, body: UpdateAuthorityBody): Promise<UpdateAuthorityResponse | ApiError> => {
  try {
    const authorityIndex = mockAuthorities.findIndex(a => a.id === id);
    
    if (authorityIndex === -1) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with id ${id} not found`);
    }

    // Update authority
    const updatedAuthority: Authority = {
      ...mockAuthorities[authorityIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    mockAuthorities[authorityIndex] = updatedAuthority;

    return createResponse(updatedAuthority, 'Authority updated successfully');
  } catch (error: any) {
    return createError('UPDATE_AUTHORITY_ERROR', 'Failed to update authority', error.message);
  }
};

/**
 * DELETE /api/authorities/:id
 * Delete authority (move to trash)
 */
export const deleteAuthority = async (id: string) => {
  try {
    const authority = mockAuthorities.find(a => a.id === id);
    
    if (!authority) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with id ${id} not found`);
    }

    // In real app, move to trash or set status to inactive
    const index = mockAuthorities.findIndex(a => a.id === id);
    mockAuthorities.splice(index, 1);

    return createResponse({ deleted: true }, 'Authority moved to trash');
  } catch (error: any) {
    return createError('DELETE_AUTHORITY_ERROR', 'Failed to delete authority', error.message);
  }
};

/**
 * POST /api/authorities/:id/activate
 * Activate authority
 */
export const activateAuthority = async (id: string) => {
  try {
    const authorityIndex = mockAuthorities.findIndex(a => a.id === id);
    
    if (authorityIndex === -1) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with id ${id} not found`);
    }

    const updatedAuthority: Authority = {
      ...mockAuthorities[authorityIndex],
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    mockAuthorities[authorityIndex] = updatedAuthority;

    return createResponse(updatedAuthority, 'Authority activated successfully');
  } catch (error: any) {
    return createError('ACTIVATE_AUTHORITY_ERROR', 'Failed to activate authority', error.message);
  }
};

/**
 * POST /api/authorities/:id/deactivate
 * Deactivate authority
 */
export const deactivateAuthority = async (id: string) => {
  try {
    const authorityIndex = mockAuthorities.findIndex(a => a.id === id);
    
    if (authorityIndex === -1) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with id ${id} not found`);
    }

    const updatedAuthority: Authority = {
      ...mockAuthorities[authorityIndex],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };

    mockAuthorities[authorityIndex] = updatedAuthority;

    return createResponse(updatedAuthority, 'Authority deactivated successfully');
  } catch (error: any) {
    return createError('DEACTIVATE_AUTHORITY_ERROR', 'Failed to deactivate authority', error.message);
  }
};

/**
 * GET /api/authorities/stats
 * Get authority statistics
 */
export const getAuthorityStats = async () => {
  try {
    const stats = {
      total: mockAuthorities.length,
      active: mockAuthorities.filter(a => a.status === 'active').length,
      inactive: mockAuthorities.filter(a => a.status === 'inactive').length,
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      withWallet: mockAuthorities.filter(a => a.walletAddress).length
    };

    // Group by type
    mockAuthorities.forEach(a => {
      stats.byType[a.type] = (stats.byType[a.type] || 0) + 1;
    });

    // Group by city
    mockAuthorities.forEach(a => {
      stats.byCity[a.city] = (stats.byCity[a.city] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_STATS_ERROR', 'Failed to get authority statistics', error.message);
  }
};

/**
 * GET /api/authorities/by-wallet/:walletAddress
 * Get authority by wallet address
 */
export const getAuthorityByWallet = async (walletAddress: string) => {
  try {
    const authority = mockAuthorities.find(
      a => a.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!authority) {
      return createError('AUTHORITY_NOT_FOUND', `Authority with wallet ${walletAddress} not found`);
    }

    return createResponse(authority);
  } catch (error: any) {
    return createError('GET_AUTHORITY_BY_WALLET_ERROR', 'Failed to get authority by wallet', error.message);
  }
};

/**
 * GET /api/authorities/by-city/:city
 * Get all authorities in a city
 */
export const getAuthoritiesByCity = async (city: string) => {
  try {
    const cityAuthorities = mockAuthorities.filter(a => a.city === city);
    
    return createResponse(cityAuthorities);
  } catch (error: any) {
    return createError('GET_AUTHORITIES_BY_CITY_ERROR', 'Failed to get authorities by city', error.message);
  }
};

// Export mock data for use in other modules
export { mockAuthorities };
