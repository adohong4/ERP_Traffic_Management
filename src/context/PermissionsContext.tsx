import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';

// Định nghĩa roles và permissions
export type UserRole = 'super-admin' | 'regional-admin' | 'viewer';

export type LocationScope = 'all' | 'hanoi' | 'thai-nguyen';

export interface Permission {
  canViewDashboard: boolean;
  canViewLicenses: boolean;
  canEditLicenses: boolean;
  canViewVehicles: boolean;
  canEditVehicles: boolean;
  canViewViolations: boolean;
  canEditViolations: boolean;
  canViewReports: boolean;
  canViewAuthorities: boolean;
  canEditAuthorities: boolean;
  canViewNews: boolean;
  canEditNews: boolean;
  canViewNotifications: boolean;
  canEditNotifications: boolean;
  canViewTrash: boolean;
  canViewSettings: boolean;
  locationScope: LocationScope;
  role: UserRole;
}

interface UserConfig {
  address: string;
  role: UserRole;
  locationScope: LocationScope;
  name: string;
  organization: string;
}

// Cấu hình người dùng dựa trên địa chỉ wallet
const USER_CONFIGS: Record<string, UserConfig> = {
  // Super Admin - Full access
  '0x335145400C12958600C0542F9180e03B917F7BbB': {
    address: '0x335145400C12958600C0542F9180e03B917F7BbB',
    role: 'super-admin',
    locationScope: 'all',
    name: 'Quản trị viên hệ thống',
    organization: 'Bộ Công an - Cục CSGT',
  },
  // Hà Nội Regional Admin
  '0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04': {
    address: '0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04',
    role: 'regional-admin',
    locationScope: 'hanoi',
    name: 'Quản trị viên Hà Nội',
    organization: 'Công an TP. Hà Nội',
  },
  // Thái Nguyên Regional Admin
  '0xF2438715BBF8C01d4355690cfbC66558a22dEC11': {
    address: '0xF2438715BBF8C01d4355690cfbC66558a22dEC11',
    role: 'regional-admin',
    locationScope: 'thai-nguyen',
    name: 'Quản trị viên Thái Nguyên',
    organization: 'Công an tỉnh Thái Nguyên',
  },
};

// Get permissions based on role
function getPermissionsForRole(role: UserRole, locationScope: LocationScope): Permission {
  switch (role) {
    case 'super-admin':
      return {
        canViewDashboard: true,
        canViewLicenses: true,
        canEditLicenses: true,
        canViewVehicles: true,
        canEditVehicles: true,
        canViewViolations: true,
        canEditViolations: true,
        canViewReports: true,
        canViewAuthorities: true,
        canEditAuthorities: true,
        canViewNews: true,
        canEditNews: true,
        canViewNotifications: true,
        canEditNotifications: true,
        canViewTrash: true,
        canViewSettings: true,
        locationScope,
        role,
      };
    
    case 'regional-admin':
      return {
        canViewDashboard: true,
        canViewLicenses: true,
        canEditLicenses: true,
        canViewVehicles: true,
        canEditVehicles: true,
        canViewViolations: true,
        canEditViolations: true,
        canViewReports: true,
        canViewAuthorities: false, // Không có quyền quản lý cơ quan giao thông
        canEditAuthorities: false,
        canViewNews: true,
        canEditNews: true,
        canViewNotifications: true,
        canEditNotifications: true,
        canViewTrash: true,
        canViewSettings: true,
        locationScope,
        role,
      };
    
    case 'viewer':
    default:
      return {
        canViewDashboard: true,
        canViewLicenses: true,
        canEditLicenses: false,
        canViewVehicles: true,
        canEditVehicles: false,
        canViewViolations: true,
        canEditViolations: false,
        canViewReports: true,
        canViewAuthorities: false,
        canEditAuthorities: false,
        canViewNews: true,
        canEditNews: false,
        canViewNotifications: true,
        canEditNotifications: false,
        canViewTrash: false,
        canViewSettings: true,
        locationScope,
        role,
      };
  }
}

interface PermissionsContextValue {
  permissions: Permission;
  userConfig: UserConfig | null;
  isLoading: boolean;
  canAccessMenuItem: (menuId: string) => boolean;
  filterDataByLocation: <T extends { city?: string }>(data: T[]) => T[];
}

const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();

  const { permissions, userConfig, isLoading } = useMemo(() => {
    // If not connected, return default viewer permissions
    if (!isConnected || !address) {
      return {
        permissions: getPermissionsForRole('viewer', 'all'),
        userConfig: null,
        isLoading: false,
      };
    }

    // Normalize address to lowercase for comparison
    const normalizedAddress = address.toLowerCase();
    
    // Find user config by address (case-insensitive)
    const config = Object.values(USER_CONFIGS).find(
      (cfg) => cfg.address.toLowerCase() === normalizedAddress
    );

    if (config) {
      return {
        permissions: getPermissionsForRole(config.role, config.locationScope),
        userConfig: config,
        isLoading: false,
      };
    }

    // If address not found in configs, treat as viewer with all locations
    return {
      permissions: getPermissionsForRole('viewer', 'all'),
      userConfig: null,
      isLoading: false,
    };
  }, [address, isConnected]);

  // Check if user can access specific menu item
  const canAccessMenuItem = (menuId: string): boolean => {
    switch (menuId) {
      case 'dashboard':
        return permissions.canViewDashboard;
      case 'licenses':
        return permissions.canViewLicenses;
      case 'vehicles':
        return permissions.canViewVehicles;
      case 'violations':
        return permissions.canViewViolations;
      case 'reports':
        return permissions.canViewReports;
      case 'authorities':
        return permissions.canViewAuthorities;
      case 'news':
        return permissions.canViewNews;
      case 'notifications-mgmt':
        return permissions.canViewNotifications;
      case 'trash':
        return permissions.canViewTrash;
      case 'settings':
        return permissions.canViewSettings;
      default:
        return false;
    }
  };

  // Filter data by user's location scope
  const filterDataByLocation = <T extends { city?: string }>(data: T[]): T[] => {
    if (permissions.locationScope === 'all') {
      return data;
    }

    // Map location scope to city names
    const cityMap: Record<string, string[]> = {
      hanoi: ['Hà Nội', 'Hanoi'],
      'thai-nguyen': ['Thái Nguyên', 'Thai Nguyen'],
    };

    const allowedCities = cityMap[permissions.locationScope] || [];
    
    return data.filter((item) => {
      if (!item.city) return false;
      return allowedCities.some(city => 
        item.city?.toLowerCase().includes(city.toLowerCase())
      );
    });
  };

  const value: PermissionsContextValue = {
    permissions,
    userConfig,
    isLoading,
    canAccessMenuItem,
    filterDataByLocation,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}

// Helper function to get location display name
export function getLocationDisplayName(scope: LocationScope): string {
  switch (scope) {
    case 'all':
      return 'Toàn quốc';
    case 'hanoi':
      return 'Hà Nội';
    case 'thai-nguyen':
      return 'Thái Nguyên';
    default:
      return 'Không xác định';
  }
}

// Helper function to get role display name
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'super-admin':
      return 'Quản trị viên hệ thống';
    case 'regional-admin':
      return 'Quản trị viên khu vực';
    case 'viewer':
      return 'Người xem';
    default:
      return 'Không xác định';
  }
}
