import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isHome?: boolean;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  resetBreadcrumbs: () => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);

  const setBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbsState(items);
  }, []);

  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbsState([]);
  }, []);

  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    setBreadcrumbsState(prev => [...prev, item]);
  }, []);

  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs, resetBreadcrumbs, addBreadcrumb }),
    [breadcrumbs, setBreadcrumbs, resetBreadcrumbs, addBreadcrumb]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
