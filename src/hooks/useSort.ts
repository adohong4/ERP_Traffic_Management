import { useState, useMemo } from 'react';
import { sortItems } from '@/lib/helpers';

export interface UseSortReturn<T> {
  sortedData: T[];
  sortField: keyof T | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof T) => void;
  resetSort: () => void;
}

/**
 * Custom hook for sorting data
 */
export const useSort = <T extends Record<string, any>>(
  data: T[],
  initialField: keyof T | null = null,
  initialDirection: 'asc' | 'desc' = 'asc',
): UseSortReturn<T> => {
  const [sortField, setSortField] = useState<keyof T | null>(initialField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return sortItems(data, sortField, sortDirection);
  }, [data, sortField, sortDirection]);

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetSort = () => {
    setSortField(initialField);
    setSortDirection(initialDirection);
  };

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
    resetSort,
  };
};
