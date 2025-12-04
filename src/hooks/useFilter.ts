import { useState, useMemo } from 'react';
import { filterBySearch } from '@/lib/helpers';

export interface UseFilterOptions<T> {
  searchFields: (keyof T)[];
  initialFilters?: Record<string, string>;
}

export interface UseFilterReturn<T> {
  filteredData: T[];
  filters: Record<string, string>;
  searchQuery: string;
  setFilter: (key: string, value: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for filtering data
 */
export const useFilter = <T extends Record<string, any>>(
  data: T[],
  options: UseFilterOptions<T>,
): UseFilterReturn<T> => {
  const { searchFields, initialFilters = {} } = options;

  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search query
    if (searchQuery.trim()) {
      result = filterBySearch(result, searchQuery, searchFields);
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((item) => {
          const itemValue = item[key as keyof T];
          return itemValue?.toString().toLowerCase() === value.toLowerCase();
        });
      }
    });

    return result;
  }, [data, searchQuery, filters, searchFields]);

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  return {
    filteredData,
    filters,
    searchQuery,
    setFilter,
    setSearchQuery,
    resetFilters,
  };
};
