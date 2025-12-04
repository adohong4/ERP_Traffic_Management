// Export all contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { BreadcrumbProvider, useBreadcrumb } from '../components/BreadcrumbContext';
export { PermissionsProvider, usePermissions, getLocationDisplayName, getRoleDisplayName } from './PermissionsContext';