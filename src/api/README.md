# ERP GPLX API Documentation

Hệ thống API đầy đủ cho ERP quản lý GPLX và đăng kiểm Bộ Công an Việt Nam.

## 📁 Cấu trúc

```
/api
├── types.ts           # TypeScript types cho tất cả APIs
├── licenses.ts        # API quản lý GPLX
├── vehicles.ts        # API quản lý xe
├── violations.ts      # API quản lý vi phạm
├── news.ts           # API quản lý tin tức
├── notifications.ts   # API quản lý thông báo
├── authorities.ts     # API quản lý cơ quan
├── dashboard.ts       # API dashboard & thống kê
├── reports.ts         # API báo cáo & phân tích
├── index.ts          # Export tất cả APIs
└── README.md         # Tài liệu này
```

## 🚀 Sử dụng

### Cách 1: Import trực tiếp

```typescript
import { getLicenses, createLicense } from '@/api/licenses';
import { getVehicles } from '@/api/vehicles';
import { getDashboardStats } from '@/api/dashboard';

// Get licenses with filters
const response = await getLicenses({
  page: 1,
  limit: 10,
  status: 'active',
  city: 'Hà Nội'
});

// Create new license
const newLicense = await createLicense({
  holderName: 'Nguyễn Văn A',
  idCard: '001234567890',
  licenseType: 'B2',
  city: 'Hà Nội',
  issuePlace: 'Sở GTVT Hà Nội'
});
```

### Cách 2: Sử dụng API Client

```typescript
import { api } from '@/api';

// Licenses
const licenses = await api.licenses.list({ page: 1, limit: 10 });
const license = await api.licenses.get('lic_123');
const created = await api.licenses.create({ ... });

// Vehicles
const vehicles = await api.vehicles.list({ status: 'valid' });
const inspectionsDue = await api.vehicles.inspectionsDue(30, 'Hà Nội');

// Dashboard
const stats = await api.dashboard.stats('Hà Nội');
const alerts = await api.dashboard.alerts();
```

## 📚 API Endpoints

### 1. License APIs (`/api/licenses.ts`)

#### `getLicenses(params)`
Lấy danh sách GPLX với phân trang và filters.

**Params:**
```typescript
{
  page?: number;           // Trang hiện tại (default: 1)
  limit?: number;          // Số items/trang (default: 10)
  sortBy?: string;         // Sắp xếp theo field (default: 'issueDate')
  sortOrder?: 'asc' | 'desc'; // Thứ tự (default: 'desc')
  search?: string;         // Tìm kiếm (tên, số GPLX, CMND)
  status?: string;         // Filter theo status
  city?: string;           // Filter theo thành phố
  licenseType?: string;    // Filter theo loại GPLX
  onBlockchain?: boolean;  // Filter theo blockchain status
  violations?: number;     // Filter theo số vi phạm
  dateFrom?: string;       // Từ ngày
  dateTo?: string;         // Đến ngày
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    items: License[],
    pagination: {
      page: 1,
      limit: 10,
      total: 150,
      totalPages: 15
    }
  },
  timestamp: "2024-12-04T..."
}
```

#### `getLicenseById(params)`
Lấy chi tiết GPLX kèm lịch sử và vi phạm.

#### `createLicense(body)`
Tạo GPLX mới.

#### `updateLicense(id, body)`
Cập nhật thông tin GPLX.

#### `deleteLicense(id)`
Xóa GPLX (chuyển vào thùng rác).

#### `renewLicense(id)`
Gia hạn GPLX đã hết hạn.

#### `suspendLicense(id, reason)`
Tạm dừng GPLX.

#### `revokeLicense(id, reason)`
Thu hồi GPLX.

#### `getLicenseStats(city?)`
Thống kê GPLX theo thành phố.

---

### 2. Vehicle APIs (`/api/vehicles.ts`)

#### `getVehicles(params)`
Lấy danh sách xe với filters.

#### `getVehicleById(params)`
Chi tiết xe kèm lịch sử đăng kiểm và vi phạm.

#### `createVehicle(body)`
Đăng ký xe mới.

#### `updateVehicle(id, body)`
Cập nhật thông tin xe.

#### `deleteVehicle(id)`
Xóa xe.

#### `inspectVehicle(id, body)`
Ghi nhận kết quả đăng kiểm.

**Body:**
```typescript
{
  result: 'passed' | 'failed' | 'pending';
  inspector: string;
  center: string;
  notes?: string;
}
```

#### `getVehicleStats(city?)`
Thống kê xe.

#### `getInspectionsDue(days?, city?)`
Danh sách xe cần đăng kiểm trong X ngày tới.

---

### 3. Violation APIs (`/api/violations.ts`)

#### `getViolations(params)`
Danh sách vi phạm với filters.

**Params thêm:**
```typescript
{
  violationType?: string;
  licenseNumber?: string;
  plateNumber?: string;
  minFine?: number;
  maxFine?: number;
}
```

#### `getViolationById(params)`
Chi tiết vi phạm kèm thông tin GPLX và xe.

#### `createViolation(body)`
Ghi nhận vi phạm mới.

#### `updateViolation(id, body)`
Cập nhật vi phạm.

#### `deleteViolation(id)`
Xóa vi phạm.

#### `payViolation(id, body)`
Thanh toán phạt vi phạm.

**Body:**
```typescript
{
  paymentMethod: 'cash' | 'bank' | 'wallet' | 'card';
  transactionId?: string;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    violation: Violation;
    receipt: {
      id: string;
      amount: number;
      date: string;
      method: string;
    }
  }
}
```

#### `getViolationStats(city?)`
Thống kê vi phạm.

#### `getViolationsByLicense(licenseNumber)`
Vi phạm theo số GPLX.

#### `getViolationsByVehicle(plateNumber)`
Vi phạm theo biển số xe.

---

### 4. News APIs (`/api/news.ts`)

#### `getNews(params)`
Danh sách tin tức.

**Params thêm:**
```typescript
{
  category?: 'traffic-law' | 'announcement' | 'guide' | 'news';
  featured?: boolean;
  tags?: string[];
}
```

#### `getNewsById(params)` / `getNewsBySlug(params)`
Chi tiết bài viết kèm bài liên quan.

#### `createNews(body)`
Tạo bài viết mới.

#### `updateNews(id, body)`
Cập nhật bài viết.

#### `deleteNews(id)`
Xóa bài viết.

#### `publishNews(id)`
Xuất bản bài draft.

#### `archiveNews(id)`
Lưu trữ bài viết.

#### `getFeaturedNews(limit?)`
Lấy tin nổi bật.

#### `getNewsStats()`
Thống kê tin tức.

---

### 5. Notification APIs (`/api/notifications.ts`)

#### `getNotifications(params)`
Danh sách thông báo.

**Params thêm:**
```typescript
{
  walletAddress?: string;
  type?: 'license_expiry' | 'inspection_due' | 'violation' | 'payment' | 'system';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  read?: boolean;
}
```

#### `markNotificationRead(body)`
Đánh dấu đã đọc.

#### `markAllNotificationsRead(walletAddress)`
Đánh dấu tất cả đã đọc.

#### `createNotification(body)`
Tạo thông báo mới.

#### `deleteNotification(id)`
Xóa thông báo.

#### `clearReadNotifications(walletAddress)`
Xóa tất cả thông báo đã đọc.

#### `getNotificationStats(walletAddress)`
Thống kê thông báo của user.

#### `sendBatchNotifications(body)`
Gửi thông báo hàng loạt.

---

### 6. Authority APIs (`/api/authorities.ts`)

#### `getAuthorities(params)`
Danh sách cơ quan.

**Params thêm:**
```typescript
{
  type?: 'police' | 'inspection' | 'registry';
}
```

#### `getAuthorityById(params)`
Chi tiết cơ quan.

#### `createAuthority(body)`
Tạo cơ quan mới.

#### `updateAuthority(id, body)`
Cập nhật cơ quan.

#### `deleteAuthority(id)`
Xóa cơ quan.

#### `activateAuthority(id)` / `deactivateAuthority(id)`
Kích hoạt / vô hiệu hóa.

#### `getAuthorityStats()`
Thống kê cơ quan.

#### `getAuthorityByWallet(walletAddress)`
Lấy cơ quan theo wallet address.

#### `getAuthoritiesByCity(city)`
Danh sách cơ quan theo thành phố.

---

### 7. Dashboard APIs (`/api/dashboard.ts`)

#### `getDashboardStats(city?)`
Thống kê tổng quan hệ thống.

**Response:**
```typescript
{
  licenses: {
    total: number;
    active: number;
    expired: number;
    suspended: number;
    revoked: number;
    byType: Record<string, number>;
    byCity: Record<string, number>;
    recentCount: number; // Last 30 days
  },
  vehicles: { ... },
  violations: { ... },
  authorities: { ... }
}
```

#### `getRecentActivities(limit?, city?)`
Hoạt động gần đây.

#### `getSystemAlerts(city?)`
Cảnh báo hệ thống (GPLX hết hạn, xe cần đăng kiểm, etc.).

#### `getTrends(days?, city?)`
Dữ liệu xu hướng cho biểu đồ.

---

### 8. Report APIs (`/api/reports.ts`)

#### `getReports(params)`
Tạo báo cáo phân tích.

**Params:**
```typescript
{
  reportType: 'license' | 'vehicle' | 'violation' | 'revenue' | 'inspection';
  dateFrom: string;
  dateTo: string;
  city?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}
```

**Response:**
```typescript
{
  reportType: string;
  period: { from: string; to: string };
  summary: Record<string, any>;
  data: Array<{ date: string; value: number; ... }>;
  charts: {
    timeSeries: any[];
    distribution: any[];
    comparison: any[];
  }
}
```

#### `exportReport(params)`
Export báo cáo ra file.

**Params thêm:**
```typescript
{
  format: 'csv' | 'xlsx' | 'pdf';
}
```

**Response:**
```typescript
{
  downloadUrl: string;
  filename: string;
  expiresAt: string; // Link expires in 24 hours
}
```

---

## 🔒 Error Handling

Tất cả APIs đều trả về error theo format:

```typescript
{
  success: false,
  error: {
    code: string;      // Error code (VD: 'LICENSE_NOT_FOUND')
    message: string;   // Human readable message
    details?: any;     // Optional error details
  },
  timestamp: string
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Missing or invalid parameters
- `NOT_FOUND` - Entity not found (LICENSE_NOT_FOUND, VEHICLE_NOT_FOUND, etc.)
- `DUPLICATE_*` - Duplicate entry
- `UNAUTHORIZED` - Not authorized
- `INTERNAL_ERROR` - Server error

---

## 📊 Pagination & Filtering

Tất cả list APIs hỗ trợ:

**Pagination:**
- `page` - Trang hiện tại (default: 1)
- `limit` - Số items/trang (default: 10)

**Sorting:**
- `sortBy` - Field để sort
- `sortOrder` - 'asc' hoặc 'desc'

**Filtering:**
- `search` - Full-text search
- `status` - Filter by status
- `city` - Filter by city
- `dateFrom` / `dateTo` - Date range

---

## 🎯 Best Practices

1. **Always check response.success**
```typescript
const response = await getLicenses({ ... });
if (response.success) {
  const licenses = response.data.items;
} else {
  console.error(response.error.message);
}
```

2. **Use TypeScript types**
```typescript
import type { License, GetLicensesParams } from '@/api/types';

const params: GetLicensesParams = { ... };
const response = await getLicenses(params);
```

3. **Handle errors gracefully**
```typescript
try {
  const response = await createLicense(data);
  if (!response.success) {
    toast.error(response.error.message);
    return;
  }
  toast.success('GPLX created successfully');
} catch (error) {
  toast.error('Network error');
}
```

4. **Use city filtering for regional authorities**
```typescript
// Hà Nội authority only sees Hà Nội data
const stats = await getDashboardStats('Hà Nội');
const licenses = await getLicenses({ city: 'Hà Nội' });
```

---

## 🔄 Mock Data

Hiện tại tất cả APIs đang sử dụng mock data từ `/lib/mockData.ts`. Khi backend thật được implement:

1. Thay thế import mock data bằng HTTP calls
2. Giữ nguyên function signatures và types
3. Components không cần thay đổi code

---

## 📝 TODO

- [ ] Integrate với backend API thật
- [ ] Thêm authentication middleware
- [ ] Implement rate limiting
- [ ] Add request caching
- [ ] WebSocket cho real-time notifications
- [ ] File upload for images/documents
- [ ] Blockchain integration APIs

---

## 📞 Support

Nếu có vấn đề về API, vui lòng liên hệ team development.
