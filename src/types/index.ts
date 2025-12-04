// Main types export file

// Export all type modules
export * from './Common.types';
export * from './DriverLicense.types';
export * from './VehicleLicense.types';
export * from './Violation.types';

// Re-export commonly used types for convenience
export type {
  User,
  UserRole,
  Authority,
  Notification,
  NewsArticle,
  DashboardStats,
  PaginationState,
  FilterState,
  SortState,
  TableColumn,
  BreadcrumbItem,
  ApiResponse,
  FormField,
  SelectOption,
} from './Common.types';

export type {
  DriverLicense,
  LicenseClass,
  LicenseStatus,
  LicenseApplication,
  LicenseApplicationType,
} from './DriverLicense.types';

export type {
  Vehicle,
  VehicleType,
  VehicleStatus,
  VehicleInspection,
  InspectionStatus,
  VehicleRegistration,
} from './VehicleLicense.types';

export type {
  TrafficViolation,
  ViolationType,
  ViolationStatus,
  PaymentInfo,
  Appeal,
} from './Violation.types';
