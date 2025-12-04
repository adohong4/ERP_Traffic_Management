// Common types shared across the application

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  walletAddress?: string;
  department?: string;
  position?: string;
  permissions?: Permission[];
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 
  | 'admin' // Quản trị viên
  | 'manager' // Quản lý
  | 'officer' // Cán bộ
  | 'inspector' // Thanh tra
  | 'support' // Hỗ trợ
  | 'viewer'; // Người xem

export type UserStatus = 
  | 'active' // Đang hoạt động
  | 'inactive' // Ngừng hoạt động
  | 'suspended' // Tạm khóa
  | 'locked'; // Khóa

export type Permission = 
  | 'view_licenses' // Xem GPLX
  | 'create_licenses' // Tạo GPLX
  | 'edit_licenses' // Sửa GPLX
  | 'delete_licenses' // Xóa GPLX
  | 'view_vehicles' // Xem xe
  | 'register_vehicles' // Đăng ký xe
  | 'edit_vehicles' // Sửa xe
  | 'delete_vehicles' // Xóa xe
  | 'view_violations' // Xem vi phạm
  | 'create_violations' // Tạo vi phạm
  | 'edit_violations' // Sửa vi phạm
  | 'delete_violations' // Xóa vi phạm
  | 'view_reports' // Xem báo cáo
  | 'export_data' // Xuất dữ liệu
  | 'manage_users' // Quản lý người dùng
  | 'manage_authorities' // Quản lý cơ quan
  | 'system_settings'; // Cài đặt hệ thống

// Authority types
export interface Authority {
  id: string;
  name: string;
  code: string;
  type: AuthorityType;
  province: string;
  district?: string;
  ward?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  director?: string;
  status: 'active' | 'inactive';
  officerCount?: number;
  establishedDate?: string;
  licenseIssuingCapacity?: number;
  vehicleInspectionCapacity?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type AuthorityType = 
  | 'police_headquarters' // Công an cấp tỉnh
  | 'police_district' // Công an cấp huyện
  | 'traffic_police' // Cảnh sát giao thông
  | 'inspection_center' // Trung tâm đăng kiểm
  | 'driver_training' // Trung tâm đào tạo lái xe
  | 'vehicle_registry'; // Đăng ký xe

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  targetType: 'user' | 'role' | 'all' | 'custom';
  targetId?: string;
  read: boolean;
  readDate?: string;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export type NotificationType = 
  | 'info' // Thông tin
  | 'success' // Thành công
  | 'warning' // Cảnh báo
  | 'error' // Lỗi
  | 'reminder' // Nhắc nhở
  | 'alert'; // Cảnh báo khẩn

export type NotificationPriority = 
  | 'low' // Thấp
  | 'normal' // Bình thường
  | 'high' // Cao
  | 'urgent'; // Khẩn cấp

// News & Announcements
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: NewsCategory;
  tags?: string[];
  author: string;
  authorId: string;
  publishDate: string;
  lastModified?: string;
  status: NewsStatus;
  featured: boolean;
  views: number;
  thumbnail?: string;
  images?: string[];
  attachments?: Attachment[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type NewsCategory = 
  | 'announcement' // Thông báo
  | 'regulation' // Quy định mới
  | 'event' // Sự kiện
  | 'guide' // Hướng dẫn
  | 'faq' // Câu hỏi thường gặp
  | 'update' // Cập nhật hệ thống
  | 'other'; // Khác

export type NewsStatus = 
  | 'draft' // Nháp
  | 'pending' // Chờ duyệt
  | 'published' // Đã xuất bản
  | 'archived'; // Lưu trữ

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
}

// Statistics & Analytics
export interface DashboardStats {
  licenses: {
    total: number;
    active: number;
    expired: number;
    expiringSoon: number;
    newThisMonth: number;
    trend: number; // % change from last period
  };
  vehicles: {
    total: number;
    registered: number;
    pendingInspection: number;
    expiredInspection: number;
    newThisMonth: number;
    trend: number;
  };
  violations: {
    total: number;
    pending: number;
    unpaid: number;
    paid: number;
    totalFines: number;
    collectedFines: number;
    trend: number;
  };
  applications: {
    licenseApplications: number;
    vehicleRegistrations: number;
    pending: number;
    approved: number;
  };
}

// Pagination
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationState;
}

// Filter & Sort
export interface FilterState {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  [key: string]: string | undefined;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// Table
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

// Wallet
export interface WalletInfo {
  address: string;
  chainId: number;
  chainName: string;
  balance?: string;
  ensName?: string;
  connected: boolean;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

// Form
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: any;
  helpText?: string;
  defaultValue?: any;
}

export type FormFieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'file'
  | 'checkbox'
  | 'radio'
  | 'switch';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

// Modal
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

// Toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Chart Data
export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  [key: string]: string | number;
}

// Action types
export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'restore'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import';

// Status variants for UI
export type StatusVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info';

// File upload
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
  uploadedBy: string;
}

// Address
export interface Address {
  street?: string;
  ward?: string;
  district?: string;
  province: string;
  country?: string;
  postalCode?: string;
  fullAddress?: string;
}

// Contact
export interface ContactInfo {
  phone?: string;
  email?: string;
  fax?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: Action;
  entityType: string;
  entityId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}
