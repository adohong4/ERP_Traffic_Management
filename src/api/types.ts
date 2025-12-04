// Central API Types for ERP GPLX System

import { License, Vehicle, Violation, News, Student, LicenseHistory } from '../lib/mockData';

// ============= COMMON TYPES =============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  search?: string;
  status?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============= LICENSE APIs =============

export interface GetLicensesParams extends PaginationParams, FilterParams {
  licenseType?: string;
  onBlockchain?: boolean;
  violations?: number; // Filter by violations count
}

export interface GetLicensesResponse extends ApiResponse<PaginatedResponse<License>> {}

export interface GetLicenseByIdParams {
  id: string;
}

export interface GetLicenseByIdResponse extends ApiResponse<{
  license: License;
  history: LicenseHistory[];
  violations: Violation[];
}> {}

export interface CreateLicenseBody {
  holderName: string;
  idCard: string;
  licenseType: string;
  city: string;
  issuePlace: string;
  walletAddress?: string;
}

export interface CreateLicenseResponse extends ApiResponse<License> {}

export interface UpdateLicenseBody {
  holderName?: string;
  licenseType?: string;
  status?: 'active' | 'expired' | 'revoked' | 'suspended';
  expiryDate?: string;
  city?: string;
  issuePlace?: string;
}

export interface UpdateLicenseResponse extends ApiResponse<License> {}

export interface DeleteLicenseParams {
  id: string;
}

export interface DeleteLicenseResponse extends ApiResponse<{ deleted: boolean }> {}

// ============= VEHICLE APIs =============

export interface GetVehiclesParams extends PaginationParams, FilterParams {
  vehicleType?: string;
  brand?: string;
  inspectionStatus?: 'valid' | 'expired' | 'pending';
}

export interface GetVehiclesResponse extends ApiResponse<PaginatedResponse<Vehicle>> {}

export interface GetVehicleByIdParams {
  id: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  inspectionDate: string;
  nextInspection: string;
  result: 'passed' | 'failed' | 'pending';
  inspector: string;
  center: string;
  notes?: string;
}

export interface GetVehicleByIdResponse extends ApiResponse<{
  vehicle: Vehicle;
  inspections: VehicleInspection[];
  violations: Violation[];
}> {}

export interface CreateVehicleBody {
  plateNumber: string;
  owner: string;
  ownerPhone: string;
  vehicleType: string;
  brand: string;
  model: string;
  color: string;
  city: string;
}

export interface CreateVehicleResponse extends ApiResponse<Vehicle> {}

export interface UpdateVehicleBody {
  owner?: string;
  ownerPhone?: string;
  vehicleType?: string;
  brand?: string;
  model?: string;
  color?: string;
  status?: 'valid' | 'expired' | 'pending';
}

export interface UpdateVehicleResponse extends ApiResponse<Vehicle> {}

// ============= VIOLATION APIs =============

export interface GetViolationsParams extends PaginationParams, FilterParams {
  violationType?: string;
  paymentStatus?: 'pending' | 'paid' | 'overdue';
  licenseNumber?: string;
  plateNumber?: string;
  minFine?: number;
  maxFine?: number;
}

export interface GetViolationsResponse extends ApiResponse<PaginatedResponse<Violation>> {}

export interface GetViolationByIdParams {
  id: string;
}

export interface GetViolationByIdResponse extends ApiResponse<{
  violation: Violation;
  license?: License;
  vehicle?: Vehicle;
}> {}

export interface CreateViolationBody {
  violatorName: string;
  licenseNumber: string;
  plateNumber: string;
  violationType: string;
  location: string;
  city: string;
  fine: number;
  points: number;
  officer: string;
  description?: string;
  images?: string[];
}

export interface CreateViolationResponse extends ApiResponse<Violation> {}

export interface UpdateViolationBody {
  status?: 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
  paymentMethod?: string;
  description?: string;
  images?: string[];
}

export interface UpdateViolationResponse extends ApiResponse<Violation> {}

export interface PayViolationBody {
  paymentMethod: 'cash' | 'bank' | 'wallet' | 'card';
  transactionId?: string;
}

export interface PayViolationResponse extends ApiResponse<{
  violation: Violation;
  receipt: {
    id: string;
    amount: number;
    date: string;
    method: string;
  };
}> {}

// ============= NEWS APIs =============

export interface GetNewsParams extends PaginationParams, FilterParams {
  category?: 'traffic-law' | 'announcement' | 'guide' | 'news';
  featured?: boolean;
  tags?: string[];
}

export interface GetNewsResponse extends ApiResponse<PaginatedResponse<News>> {}

export interface GetNewsByIdParams {
  id: string;
}

export interface GetNewsBySlugParams {
  slug: string;
}

export interface GetNewsByIdResponse extends ApiResponse<{
  news: News;
  related: News[];
}> {}

export interface CreateNewsBody {
  title: string;
  summary: string;
  content: string;
  category: 'traffic-law' | 'announcement' | 'guide' | 'news';
  author: string;
  tags: string[];
  thumbnail?: string;
  featured?: boolean;
}

export interface CreateNewsResponse extends ApiResponse<News> {}

export interface UpdateNewsBody {
  title?: string;
  summary?: string;
  content?: string;
  category?: 'traffic-law' | 'announcement' | 'guide' | 'news';
  status?: 'published' | 'draft' | 'archived';
  tags?: string[];
  thumbnail?: string;
  featured?: boolean;
}

export interface UpdateNewsResponse extends ApiResponse<News> {}

// ============= NOTIFICATION APIs =============

export interface Notification {
  id: string;
  userId: string;
  walletAddress: string;
  title: string;
  message: string;
  type: 'license_expiry' | 'inspection_due' | 'violation' | 'payment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: string;
  relatedId?: string; // ID of related entity (license, vehicle, violation)
  relatedType?: 'license' | 'vehicle' | 'violation';
  actionUrl?: string;
}

export interface GetNotificationsParams extends PaginationParams {
  walletAddress?: string;
  type?: string;
  priority?: string;
  read?: boolean;
}

export interface GetNotificationsResponse extends ApiResponse<PaginatedResponse<Notification>> {}

export interface MarkNotificationReadBody {
  id: string;
}

export interface MarkNotificationReadResponse extends ApiResponse<{ success: boolean }> {}

export interface CreateNotificationBody {
  walletAddress: string;
  title: string;
  message: string;
  type: 'license_expiry' | 'inspection_due' | 'violation' | 'payment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedId?: string;
  relatedType?: 'license' | 'vehicle' | 'violation';
  actionUrl?: string;
}

export interface CreateNotificationResponse extends ApiResponse<Notification> {}

// ============= AUTHORITY APIs =============

export interface Authority {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  type: 'police' | 'inspection' | 'registry';
  status: 'active' | 'inactive';
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAuthoritiesParams extends PaginationParams, FilterParams {
  type?: 'police' | 'inspection' | 'registry';
}

export interface GetAuthoritiesResponse extends ApiResponse<PaginatedResponse<Authority>> {}

export interface GetAuthorityByIdParams {
  id: string;
}

export interface GetAuthorityByIdResponse extends ApiResponse<Authority> {}

export interface CreateAuthorityBody {
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  type: 'police' | 'inspection' | 'registry';
  walletAddress?: string;
}

export interface CreateAuthorityResponse extends ApiResponse<Authority> {}

export interface UpdateAuthorityBody {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
  walletAddress?: string;
}

export interface UpdateAuthorityResponse extends ApiResponse<Authority> {}

// ============= REPORTS APIs =============

export interface DashboardStats {
  licenses: {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    revoked: number;
    byType: Record<string, number>;
    byCity: Record<string, number>;
    recentCount: number; // Last 30 days
  };
  vehicles: {
    total: number;
    valid: number;
    expired: number;
    pending: number;
    byType: Record<string, number>;
    byCity: Record<string, number>;
    inspectionsDue: number; // Due in next 30 days
  };
  violations: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    totalFines: number;
    collectedFines: number;
    byType: Record<string, number>;
    byCity: Record<string, number>;
    recentCount: number; // Last 30 days
  };
  authorities: {
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
  };
}

export interface GetDashboardStatsResponse extends ApiResponse<DashboardStats> {}

export interface GetReportsParams {
  reportType: 'license' | 'vehicle' | 'violation' | 'revenue' | 'inspection';
  dateFrom: string;
  dateTo: string;
  city?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface ReportData {
  reportType: string;
  period: {
    from: string;
    to: string;
  };
  summary: Record<string, any>;
  data: Array<{
    date: string;
    value: number;
    breakdown?: Record<string, number>;
  }>;
  charts: {
    timeSeries: any[];
    distribution: any[];
    comparison: any[];
  };
}

export interface GetReportsResponse extends ApiResponse<ReportData> {}

export interface ExportReportParams extends GetReportsParams {
  format: 'csv' | 'xlsx' | 'pdf';
}

export interface ExportReportResponse extends ApiResponse<{
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}> {}

// ============= TRASH APIs =============

export interface TrashItem {
  id: string;
  type: 'license' | 'vehicle' | 'violation' | 'news' | 'authority';
  originalId: string;
  data: any;
  deletedAt: string;
  deletedBy: string;
  canRestore: boolean;
  permanentDeleteAt: string; // Auto-delete after 30 days
}

export interface GetTrashParams extends PaginationParams {
  type?: 'license' | 'vehicle' | 'violation' | 'news' | 'authority';
  deletedBy?: string;
}

export interface GetTrashResponse extends ApiResponse<PaginatedResponse<TrashItem>> {}

export interface RestoreItemBody {
  id: string;
}

export interface RestoreItemResponse extends ApiResponse<{ restored: boolean }> {}

export interface PermanentDeleteBody {
  id: string;
}

export interface PermanentDeleteResponse extends ApiResponse<{ deleted: boolean }> {}

// ============= BLOCKCHAIN APIs =============

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  entityType: 'license' | 'vehicle' | 'violation';
  entityId: string;
}

export interface GetBlockchainTxParams {
  txHash?: string;
  entityType?: string;
  entityId?: string;
  walletAddress?: string;
}

export interface GetBlockchainTxResponse extends ApiResponse<BlockchainTransaction[]> {}

export interface CreateBlockchainTxBody {
  entityType: 'license' | 'vehicle' | 'violation';
  entityId: string;
  walletAddress: string;
  action: 'create' | 'update' | 'delete' | 'verify';
}

export interface CreateBlockchainTxResponse extends ApiResponse<BlockchainTransaction> {}
