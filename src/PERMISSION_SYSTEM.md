# Hệ thống Phân quyền dựa trên Blockchain Wallet

## Tổng quan

Hệ thống ERP GPLX sử dụng địa chỉ ví blockchain (wallet address) để xác định vai trò và phạm vi quyền hạn của người dùng. Mỗi địa chỉ wallet được cấu hình với:
- **Role (Vai trò)**: Xác định quyền truy cập các chức năng
- **Location Scope (Phạm vi địa điểm)**: Xác định dữ liệu có thể xem và quản lý

## Cấu hình Người dùng

### 1. Super Admin - Quản trị viên Toàn hệ thống
**Địa chỉ wallet:** `0x335145400C12958600C0542F9180e03B917F7BbB`

**Quyền hạn:**
- ✅ Xem và quản lý **TẤT CẢ** dữ liệu trên toàn quốc
- ✅ Truy cập đầy đủ mọi chức năng hệ thống:
  - Dashboard
  - Quản lý GPLX
  - Quản lý phương tiện
  - Quản lý vi phạm
  - Báo cáo & phân tích
  - **Quản lý cơ quan giao thông** (chỉ admin)
  - Đăng tin tức
  - Quản lý thông báo
  - Thùng rác
  - Cài đặt
- ✅ Quyền thêm/sửa/xóa trên tất cả module
- ✅ Phân quyền cho các cơ quan địa phương

**Tổ chức:** Bộ Công an - Cục CSGT

---

### 2. Regional Admin - Công an TP. Hà Nội
**Địa chỉ wallet:** `0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04`

**Quyền hạn:**
- ✅ Xem và quản lý dữ liệu **CHỈ THUỘC HÀ NỘI**
- ✅ Truy cập các chức năng:
  - Dashboard (với data Hà Nội)
  - Quản lý GPLX (Hà Nội)
  - Quản lý phương tiện (Hà Nội)
  - Quản lý vi phạm (Hà Nội)
  - Báo cáo & phân tích (Hà Nội)
  - Đăng tin tức
  - Quản lý thông báo
  - Thùng rác
  - Cài đặt
- ❌ KHÔNG có quyền truy cập **Quản lý cơ quan giao thông**
- ✅ Quyền thêm/sửa/xóa dữ liệu Hà Nội

**Tổ chức:** Công an TP. Hà Nội

**Lọc dữ liệu:**
- Licenses: Chỉ hiển thị GPLX có `province = "Hà Nội"`
- Vehicles: Chỉ hiển thị phương tiện có `province = "Hà Nội"`
- Violations: Chỉ hiển thị vi phạm có `location.province = "Hà Nội"`

---

### 3. Regional Admin - Công an tỉnh Thái Nguyên
**Địa chỉ wallet:** `0xF2438715BBF8C01d4355690cfbC66558a22dEC11`

**Quyền hạn:**
- ✅ Xem và quản lý dữ liệu **CHỈ THUỘC THÁI NGUYÊN**
- ✅ Truy cập các chức năng:
  - Dashboard (với data Thái Nguyên)
  - Quản lý GPLX (Thái Nguyên)
  - Quản lý phương tiện (Thái Nguyên)
  - Quản lý vi phạm (Thái Nguyên)
  - Báo cáo & phân tích (Thái Nguyên)
  - Đăng tin tức
  - Quản lý thông báo
  - Thùng rác
  - Cài đặt
- ❌ KHÔNG có quyền truy cập **Quản lý cơ quan giao thông**
- ✅ Quyền thêm/sửa/xóa dữ liệu Thái Nguyên

**Tổ chức:** Công an tỉnh Thái Nguyên

**Lọc dữ liệu:**
- Licenses: Chỉ hiển thị GPLX có `province = "Thái Nguyên"`
- Vehicles: Chỉ hiển thị phương tiện có `province = "Thái Nguyên"`
- Violations: Chỉ hiển thị vi phạm có `location.province = "Thái Nguyên"`

---

## Kiến trúc Hệ thống

### 1. PermissionsContext
Location: `/context/PermissionsContext.tsx`

**Chức năng:**
- Quản lý permissions dựa trên wallet address
- Cung cấp role và location scope
- Filter menu items
- Filter data theo địa điểm

**API:**
```typescript
const {
  permissions,        // Permission object với tất cả quyền
  userConfig,        // Thông tin user (name, organization, etc.)
  canAccessMenuItem, // Function check quyền menu
  filterDataByLocation, // Function filter data
} = usePermissions();
```

### 2. usePermissionFilter Hook
Location: `/hooks/usePermissionFilter.ts`

**Sử dụng:**
```typescript
import { usePermissionFilter } from '@/hooks';

const filteredLicenses = usePermissionFilter(allLicenses);
const filteredVehicles = usePermissionFilter(allVehicles);
const filteredViolations = usePermissionFilter(allViolations);
```

### 3. PermissionBadge Component
Location: `/components/PermissionBadge.tsx`

**Chức năng:** Hiển thị badges cho role, location và organization của user

---

## Mock Data

### Hà Nội Data:
- **Licenses**: ID 1-10 (10 records)
  - Ví dụ: Nguyễn Văn An, Trần Thị Bình, Lê Văn Cường...
- **Vehicles**: ID 1-6 (6 records)
  - Ví dụ: 29A-12345, 30H-67890, 29C-11111...
- **Violations**: ID 1-6 (6 records)
  - Ví dụ: VL001, VL002, VL003...

### Thái Nguyên Data:
- **Licenses**: ID 11-15 (5 records)
  - Ví dụ: Nguyễn Văn Tuấn, Trần Thị Mai, Lê Văn Hùng...
- **Vehicles**: ID 7-9 (3 records)
  - Ví dụ: 20A-11111, 20B-22222, 20C-33333...
- **Violations**: ID 7-9 (3 records)
  - Ví dụ: VL007, VL008, VL009...

---

## Testing Instructions

### 1. Test Super Admin (Toàn quyền)
```
1. Connect wallet: 0x335145400C12958600C0542F9180e03B917F7BbB
2. Kiểm tra:
   - ✅ Thấy TẤT CẢ menu items (kể cả "Cơ quan giao thông")
   - ✅ Dashboard hiển thị data cả Hà Nội và Thái Nguyên
   - ✅ License list có 15 records (10 HN + 5 TN)
   - ✅ Vehicle list có 9 records (6 HN + 3 TN)
   - ✅ Violation list có 9 records (6 HN + 3 TN)
   - ✅ Header hiển thị badges: "Quản trị viên hệ thống" + "Toàn quốc"
```

### 2. Test Hà Nội Regional Admin
```
1. Connect wallet: 0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04
2. Kiểm tra:
   - ✅ KHÔNG thấy menu "Cơ quan giao thông"
   - ✅ Dashboard CHỈ hiển thị data Hà Nội
   - ✅ License list CHỈ có 10 records Hà Nội
   - ✅ Vehicle list CHỈ có 6 records Hà Nội
   - ✅ Violation list CHỈ có 6 records Hà Nội
   - ✅ Header hiển thị badges: "Quản trị viên khu vực" + "Hà Nội"
   - ❌ KHÔNG thấy data Thái Nguyên
```

### 3. Test Thái Nguyên Regional Admin
```
1. Connect wallet: 0xF2438715BBF8C01d4355690cfbC66558a22dEC11
2. Kiểm tra:
   - ✅ KHÔNG thấy menu "Cơ quan giao thông"
   - ✅ Dashboard CHỈ hiển thị data Thái Nguyên
   - ✅ License list CHỈ có 5 records Thái Nguyên
   - ✅ Vehicle list CHỈ có 3 records Thái Nguyên
   - ✅ Violation list CHỈ có 3 records Thái Nguyên
   - ✅ Header hiển thị badges: "Quản trị viên khu vực" + "Thái Nguyên"
   - ❌ KHÔNG thấy data Hà Nội
```

---

## Thêm User/Location mới

### Bước 1: Cập nhật PermissionsContext
File: `/context/PermissionsContext.tsx`

```typescript
const USER_CONFIGS: Record<string, UserConfig> = {
  // ... existing configs ...
  
  // Thêm user mới
  '0xNEW_WALLET_ADDRESS': {
    address: '0xNEW_WALLET_ADDRESS',
    role: 'regional-admin',
    locationScope: 'new-location', // hoặc 'hanoi', 'thai-nguyen', 'all'
    name: 'Tên người dùng',
    organization: 'Công an Tỉnh XXX',
  },
};
```

### Bước 2: Thêm Location Scope mới
```typescript
// Trong filterDataByLocation function
const cityMap: Record<string, string[]> = {
  hanoi: ['Hà Nội', 'Hanoi'],
  'thai-nguyen': ['Thái Nguyên', 'Thai Nguyên'],
  'new-location': ['Tên Tỉnh', 'Ten Tinh'], // Thêm tỉnh mới
};
```

### Bước 3: Thêm Mock Data
Thêm data với `province` tương ứng trong:
- `/lib/mockData/licenseData.ts`
- `/lib/mockData/vehicleData.ts`
- `/lib/mockData/violationData.ts`

---

## Security Notes

⚠️ **Quan trọng:**
- Hệ thống phân quyền hiện tại chỉ hoạt động ở frontend
- Đây là demo/prototype với mock data
- Trong production thực tế, cần implement:
  - Smart contracts để quản lý permissions on-chain
  - Backend API với role-based access control
  - Signature verification cho mọi request
  - Audit logging cho mọi thao tác

---

## UI Components

### Permission Badge
Hiển thị ở header khi có userConfig:
- **Role Badge**: Shield icon + role name (cyan/blue gradient)
- **Location Badge**: MapPin icon + location name (teal/green gradient)
- **Organization Badge**: Building icon + org name (blue/indigo gradient)

---

## Future Enhancements

1. **More Roles:**
   - Viewer (chỉ xem)
   - Manager (quản lý nhưng không phân quyền)
   - Officer (cán bộ thực thi)

2. **Granular Permissions:**
   - Permission cho từng action (create, read, update, delete)
   - Permission cho từng module riêng

3. **Smart Contract Integration:**
   - On-chain role management
   - Permission changes logged on blockchain
   - Multi-signature for critical operations

4. **Audit Trail:**
   - Log mọi thao tác với timestamp
   - Export audit reports
   - Real-time monitoring dashboard
