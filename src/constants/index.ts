// Application constants - Re-export from config
export * from '@/config/constants';

// Additional UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: '280px',
  SIDEBAR_COLLAPSED_WIDTH: '80px',
  HEADER_HEIGHT: '64px',
  FOOTER_HEIGHT: '60px',
  CONTENT_MAX_WIDTH: '1600px',
} as const;

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// License classes
export const LICENSE_CLASSES = [
  { value: 'A1', label: 'A1 - Xe mô tô hai bánh' },
  { value: 'A2', label: 'A2 - Xe mô tô ba bánh' },
  { value: 'B1', label: 'B1 - Xe ô tô đến 9 chỗ' },
  { value: 'B2', label: 'B2 - Xe ô tô trên 9 chỗ' },
  { value: 'C', label: 'C - Xe ô tô tải' },
  { value: 'D', label: 'D - Xe ô tô khách' },
  { value: 'E', label: 'E - Xe có rơ moóc' },
  { value: 'F', label: 'F - Xe máy chuyên dụng' },
] as const;

// License statuses
export const LICENSE_STATUSES = [
  { value: 'active', label: 'Còn hiệu lực', variant: 'success' },
  { value: 'expired', label: 'Hết hạn', variant: 'destructive' },
  { value: 'suspended', label: 'Tạm thu', variant: 'destructive' },
  { value: 'pending', label: 'Chờ cấp', variant: 'warning' },
] as const;

// Vehicle types
export const VEHICLE_TYPES = [
  { value: 'motorcycle', label: 'Xe máy' },
  { value: 'car', label: 'Ô tô con' },
  { value: 'truck', label: 'Xe tải' },
  { value: 'bus', label: 'Xe khách' },
  { value: 'special', label: 'Xe chuyên dụng' },
] as const;

// Violation types
export const VIOLATION_TYPES = [
  { value: 'speed', label: 'Vượt quá tốc độ', fine: 2000000 },
  { value: 'alcohol', label: 'Nồng độ cồn', fine: 8000000 },
  { value: 'red_light', label: 'Vượt đèn đỏ', fine: 5000000 },
  { value: 'no_license', label: 'Không có GPLX', fine: 6000000 },
  { value: 'no_helmet', label: 'Không đội mũ bảo hiểm', fine: 400000 },
  { value: 'wrong_lane', label: 'Đi sai làn đường', fine: 1500000 },
  { value: 'phone', label: 'Sử dụng điện thoại', fine: 800000 },
  { value: 'other', label: 'Vi phạm khác', fine: 1000000 },
] as const;

// Violation statuses
export const VIOLATION_STATUSES = [
  { value: 'unpaid', label: 'Chưa nộp phạt', variant: 'warning' },
  { value: 'paid', label: 'Đã nộp phạt', variant: 'success' },
  { value: 'appealed', label: 'Đang khiếu nại', variant: 'default' },
  { value: 'cancelled', label: 'Đã hủy', variant: 'destructive' },
] as const;

// Authority types
export const AUTHORITY_TYPES = [
  { value: 'police', label: 'Công an' },
  { value: 'inspection', label: 'Trung tâm đăng kiểm' },
  { value: 'traffic', label: 'CSGT' },
] as const;

// Vietnamese provinces
export const PROVINCES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
] as const;

// News categories
export const NEWS_CATEGORIES = [
  { value: 'announcement', label: 'Thông báo', icon: '📢' },
  { value: 'regulation', label: 'Quy định mới', icon: '📋' },
  { value: 'event', label: 'Sự kiện', icon: '🎉' },
  { value: 'other', label: 'Khác', icon: '📰' },
] as const;

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Quản trị viên', color: 'red' },
  { value: 'officer', label: 'Cán bộ', color: 'blue' },
  { value: 'user', label: 'Người dùng', color: 'green' },
] as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#06b6d4', // cyan-500
  secondary: '#0ea5e9', // blue-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  info: '#3b82f6', // blue-500
  purple: '#a855f7', // purple-500
  pink: '#ec4899', // pink-500
  teal: '#14b8a6', // teal-500
  gray: '#6b7280', // gray-500
} as const;

// Table row limits
export const TABLE_PAGE_SIZES = [5, 10, 20, 50, 100] as const;

// Date range presets
export const DATE_RANGE_PRESETS = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày qua', value: '7days' },
  { label: '30 ngày qua', value: '30days' },
  { label: 'Tháng này', value: 'thisMonth' },
  { label: 'Tháng trước', value: 'lastMonth' },
  { label: 'Năm nay', value: 'thisYear' },
] as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  LICENSES: '/api/licenses',
  VEHICLES: '/api/vehicles',
  VIOLATIONS: '/api/violations',
  NEWS: '/api/news',
  NOTIFICATIONS: '/api/notifications',
  AUTHORITIES: '/api/authorities',
  INSPECTIONS: '/api/inspections',
  USERS: '/api/users',
  STATS: '/api/statistics',
} as const;
