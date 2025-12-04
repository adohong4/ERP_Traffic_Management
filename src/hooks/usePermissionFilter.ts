import { useMemo } from 'react';
import { usePermissions } from '../context/PermissionsContext';

/**
 * Hook để filter data dựa trên location permission của user
 * Có thể sử dụng cho licenses, vehicles, violations, etc.
 */
export function usePermissionFilter<T extends { province?: string; city?: string }>(data: T[]): T[] {
  const { permissions } = usePermissions();

  return useMemo(() => {
    // Super admin sees all data
    if (permissions.locationScope === 'all') {
      return data;
    }

    // Map location scope to province/city names
    const locationMap: Record<string, string[]> = {
      hanoi: ['Hà Nội', 'Hanoi', 'Ha Noi'],
      'thai-nguyen': ['Thái Nguyên', 'Thai Nguyen'],
    };

    const allowedLocations = locationMap[permissions.locationScope] || [];
    
    // Filter data based on province or city field
    return data.filter((item) => {
      const location = item.province || item.city || '';
      if (!location) return false;
      
      return allowedLocations.some(loc => 
        location.toLowerCase().includes(loc.toLowerCase())
      );
    });
  }, [data, permissions.locationScope]);
}
