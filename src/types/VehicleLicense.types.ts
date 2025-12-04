// Vehicle License and Registration types

export interface Vehicle {
  id: string;
  plateNumber: string;
  registrationNumber: string;
  owner: VehicleOwner;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  modelYear: number;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  engineCapacity?: number; // cc
  seats?: number;
  weight?: number; // kg
  payload?: number; // kg
  fuelType: FuelType;
  registrationDate: string;
  expiryDate: string;
  status: VehicleStatus;
  inspectionStatus: InspectionStatus;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  insuranceExpiry?: string;
  province: string;
  registrationAuthority: string;
  notes?: string;
  images?: VehicleImage[];
  onBlockchain?: boolean; // Đã lưu trữ vào blockchain chưa
  blockchainTxHash?: string; // Transaction hash nếu đã lưu
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleOwner {
  id: string;
  name: string;
  type: 'individual' | 'organization';
  idNumber?: string; // CMND/CCCD for individual
  taxNumber?: string; // Mã số thuế for organization
  address: string;
  phone: string;
  email?: string;
}

export type VehicleType = 
  | 'motorcycle' // Xe mô tô
  | 'scooter' // Xe tay ga
  | 'electric_bike' // Xe máy điện
  | 'car' // Ô tô con
  | 'sedan' // Sedan
  | 'suv' // SUV
  | 'pickup' // Bán tải
  | 'van' // Xe van
  | 'truck' // Xe tải
  | 'bus' // Xe khách
  | 'minibus' // Xe khách nhỏ
  | 'trailer' // Rơ moóc
  | 'special'; // Xe chuyên dụng

export type FuelType = 
  | 'gasoline' // Xăng
  | 'diesel' // Dầu diesel
  | 'electric' // Điện
  | 'hybrid' // Hybrid
  | 'lpg' // Khí gas
  | 'cng'; // Khí nén

export type VehicleStatus = 
  | 'active' // Đang hoạt động
  | 'inactive' // Ngừng hoạt động
  | 'suspended' // Tạm ngừng
  | 'stolen' // Bị đánh cắp
  | 'scrapped' // Đã thanh lý
  | 'exported'; // Đã xuất khẩu

export type InspectionStatus = 
  | 'valid' // Còn hạn
  | 'expired' // Hết hạn
  | 'pending' // Chờ kiểm định
  | 'failed' // Không đạt
  | 'not_required'; // Chưa cần kiểm định

export interface VehicleImage {
  id: string;
  type: 'front' | 'back' | 'left' | 'right' | 'interior' | 'documents' | 'other';
  url: string;
  uploadDate: string;
  description?: string;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  plateNumber: string;
  inspectionDate: string;
  nextInspectionDate: string;
  inspectionCenter: string;
  inspectionCenterAddress: string;
  inspector: string;
  certificateNumber: string;
  result: InspectionResult;
  findings: InspectionFinding[];
  overallStatus: 'passed' | 'conditional' | 'failed';
  fee: number;
  notes?: string;
  reportUrl?: string;
  certificateUrl?: string;
  sticker?: {
    number: string;
    issueDate: string;
    expiryDate: string;
  };
}

export type InspectionResult = 
  | 'passed' // Đạt
  | 'conditional' // Đạt có điều kiện
  | 'failed'; // Không đạt

export interface InspectionFinding {
  category: InspectionCategory;
  item: string;
  status: 'pass' | 'warning' | 'fail';
  description?: string;
  requiresRepair: boolean;
  repairDeadline?: string;
}

export type InspectionCategory = 
  | 'brakes' // Phanh
  | 'lights' // Đèn
  | 'steering' // Lái
  | 'suspension' // Giảm xóc
  | 'tires' // Lốp
  | 'emissions' // Khí thải
  | 'body' // Thân xe
  | 'engine' // Động cơ
  | 'electrical' // Điện
  | 'safety' // An toàn
  | 'documents'; // Giấy tờ

export interface VehicleRegistration {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'individual' | 'organization';
  type: RegistrationType;
  vehicleInfo: {
    brand: string;
    model: string;
    modelYear: number;
    color: string;
    engineNumber: string;
    chassisNumber: string;
    vehicleType: VehicleType;
  };
  applicationDate: string;
  status: RegistrationStatus;
  documents: RegistrationDocument[];
  assignedPlateNumber?: string;
  registrationFee: number;
  plateFee?: number;
  totalFee: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentDate?: string;
  approvalDate?: string;
  completionDate?: string;
  processingOfficer?: string;
  notes?: string;
}

export type RegistrationType = 
  | 'new' // Đăng ký mới
  | 'transfer' // Sang tên
  | 'change_plate' // Đổi biển
  | 'reregistration' // Đăng ký lại
  | 'temporary' // Đăng ký tạm thời
  | 'export'; // Xuất khẩu

export type RegistrationStatus = 
  | 'draft' // Nháp
  | 'submitted' // Đã nộp
  | 'document_check' // Kiểm tra hồ sơ
  | 'inspection_scheduled' // Đã hẹn kiểm tra
  | 'inspection_passed' // Đã qua kiểm tra
  | 'inspection_failed' // Không qua kiểm tra
  | 'payment_pending' // Chờ thanh toán
  | 'approved' // Đã phê duyệt
  | 'completed' // Hoàn thành
  | 'rejected' // Từ chối
  | 'cancelled'; // Hủy

export interface RegistrationDocument {
  id: string;
  type: RegistrationDocumentType;
  name: string;
  url?: string;
  uploadDate: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export type RegistrationDocumentType = 
  | 'invoice' // Hóa đơn mua xe
  | 'certificate_of_origin' // Giấy chứng nhận xuất xứ
  | 'customs_declaration' // Tờ khai hải quan
  | 'owner_id' // CMND/CCCD chủ xe
  | 'business_license' // Giấy phép kinh doanh (tổ chức)
  | 'previous_registration' // Giấy đăng ký cũ (nếu có)
  | 'transfer_agreement' // Hợp đồng sang tên
  | 'inspection_cert' // Giấy kiểm định
  | 'insurance' // Bảo hiểm
  | 'other'; // Khác

export interface PlateNumberSeries {
  id: string;
  province: string;
  provinceCode: string; // e.g., "29" for Hà Nội
  series: string; // e.g., "A", "B", "C"
  vehicleType: VehicleType;
  startNumber: number;
  endNumber: number;
  currentNumber: number;
  status: 'active' | 'depleted' | 'reserved';
  notes?: string;
}

export interface VehicleHistory {
  id: string;
  vehicleId: string;
  action: VehicleAction;
  date: string;
  performedBy: string;
  details?: string;
  previousOwner?: string;
  newOwner?: string;
  previousStatus?: VehicleStatus;
  newStatus?: VehicleStatus;
  documents?: string[];
}

export type VehicleAction = 
  | 'registered' // Đăng ký
  | 'transferred' // Sang tên
  | 'updated' // Cập nhật
  | 'inspected' // Kiểm định
  | 'suspended' // Tạm ngừng
  | 'reactivated' // Kích hoạt lại
  | 'exported' // Xuất khẩu
  | 'scrapped' // Thanh lý
  | 'stolen' // Báo mất cắp
  | 'recovered'; // Tìm lại

export interface VehicleStatistics {
  total: number;
  active: number;
  inactive: number;
  byType: Record<VehicleType, number>;
  byProvince: Record<string, number>;
  byFuelType: Record<FuelType, number>;
  newRegistrationsThisMonth: number;
  pendingInspections: number;
  expiredInspections: number;
  averageAge: number;
}