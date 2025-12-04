// Traffic Violation types

export interface TrafficViolation {
  id: string;
  violationCode: string;
  violationNumber: string; // Số biên bản
  violatorInfo: ViolatorInfo;
  vehicleInfo?: VehicleInfo;
  violationType: ViolationType;
  violationDate: string;
  violationTime: string;
  location: ViolationLocation;
  officer: OfficerInfo;
  description: string;
  fine: number;
  pointsDeducted?: number;
  status: ViolationStatus;
  paymentInfo?: PaymentInfo;
  appeal?: Appeal;
  evidence: Evidence[];
  witnesses?: Witness[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ViolatorInfo {
  name: string;
  idNumber?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface VehicleInfo {
  plateNumber: string;
  type: string;
  brand?: string;
  model?: string;
  color?: string;
  owner?: string;
}

export interface ViolationLocation {
  address: string;
  province: string;
  district?: string;
  ward?: string;
  street?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  landmark?: string;
}

export interface OfficerInfo {
  id: string;
  name: string;
  badgeNumber: string;
  unit: string;
  rank?: string;
  signature?: string;
}

export type ViolationType = 
  // Lỗi tốc độ
  | 'speed_limit_5_20' // Vượt quá tốc độ từ 5-20 km/h
  | 'speed_limit_20_35' // Vượt quá tốc độ từ 20-35 km/h
  | 'speed_limit_above_35' // Vượt quá tốc độ trên 35 km/h
  
  // Lỗi nồng độ cồn
  | 'alcohol_level_1' // Nồng độ cồn dưới 50mg/100ml máu hoặc 0.25mg/lít khí thở
  | 'alcohol_level_2' // Nồng độ cồn từ 50-80mg/100ml máu hoặc 0.25-0.4mg/lít khí thở
  | 'alcohol_level_3' // Nồng độ cồn trên 80mg/100ml máu hoặc 0.4mg/lít khí thở
  | 'alcohol_refuse_test' // Từ chối kiểm tra nồng độ cồn
  
  // Lỗi tín hiệu đèn
  | 'red_light' // Vượt đèn đỏ
  | 'yellow_light' // Không dừng khi đèn vàng
  | 'no_stop_sign' // Không dừng tại biển báo dừng
  
  // Lỗi giấy tờ
  | 'no_license' // Không có GPLX
  | 'invalid_license' // GPLX không hợp lệ
  | 'wrong_license_class' // Không đúng hạng GPLX
  | 'no_registration' // Không có giấy đăng ký xe
  | 'no_insurance' // Không có bảo hiểm
  | 'expired_inspection' // Hết hạn đăng kiểm
  
  // Lỗi thiết bị an toàn
  | 'no_helmet' // Không đội mũ bảo hiểm
  | 'no_seatbelt' // Không thắt dây an toàn
  | 'phone_while_driving' // Sử dụng điện thoại khi lái xe
  | 'no_child_seat' // Không có ghế trẻ em
  
  // Lỗi luồng giao thông
  | 'wrong_lane' // Đi sai làn đường
  | 'illegal_turn' // Rẽ không đúng quy định
  | 'wrong_way' // Đi ngược chiều
  | 'illegal_parking' // Đỗ xe sai quy định
  | 'sidewalk_driving' // Lưu thông trên vỉa hè
  
  // Lỗi vượt xe
  | 'illegal_overtaking' // Vượt xe không đúng quy định
  | 'overtaking_prohibited_area' // Vượt xe ở nơi cấm
  
  // Lỗi tải trọng
  | 'overload_10_20' // Quá tải từ 10-20%
  | 'overload_20_50' // Quá tải từ 20-50%
  | 'overload_above_50' // Quá tải trên 50%
  
  // Lỗi khác
  | 'reckless_driving' // Lái xe nguy hiểm
  | 'racing' // Đua xe trái phép
  | 'modified_vehicle' // Cải tạo xe không phép
  | 'no_lights' // Không bật đèn khi bắt buộc
  | 'honking_prohibited_area' // Bấm còi nơi cấm
  | 'hit_and_run' // Gây tai nạn bỏ chạy
  | 'other'; // Vi phạm khác

export type ViolationStatus = 
  | 'pending' // Chờ xử lý
  | 'confirmed' // Đã xác nhận
  | 'unpaid' // Chưa nộp phạt
  | 'paid' // Đã nộp phạt
  | 'appealed' // Đang khiếu nại
  | 'appeal_approved' // Khiếu nại được chấp nhận
  | 'appeal_rejected' // Khiếu nại bị từ chối
  | 'cancelled' // Đã hủy
  | 'expired'; // Hết hạn xử phạt

export interface PaymentInfo {
  paymentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  paymentDate: string;
  transactionNumber?: string;
  receiptNumber?: string;
  paymentLocation?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  refundReason?: string;
  refundDate?: string;
}

export type PaymentMethod = 
  | 'cash' // Tiền mặt
  | 'bank_transfer' // Chuyển khoản
  | 'credit_card' // Thẻ tín dụng
  | 'e_wallet' // Ví điện tử
  | 'online' // Thanh toán online
  | 'other'; // Khác

export interface Appeal {
  id: string;
  violationId: string;
  appellant: string;
  appealDate: string;
  reason: string;
  evidence: Evidence[];
  reviewedBy?: string;
  reviewDate?: string;
  decision?: 'approved' | 'rejected' | 'partial';
  decisionReason?: string;
  newFine?: number;
  status: 'submitted' | 'under_review' | 'completed';
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  description: string;
  url?: string;
  captureDate?: string;
  capturedBy?: string;
  location?: string;
  verified: boolean;
}

export type EvidenceType = 
  | 'photo' // Ảnh
  | 'video' // Video
  | 'camera' // Camera giám sát
  | 'radar' // Radar đo tốc độ
  | 'breathalyzer' // Máy đo nồng độ cồn
  | 'witness_statement' // Lời khai nhân chứng
  | 'document' // Tài liệu
  | 'other'; // Khác

export interface Witness {
  id: string;
  name: string;
  idNumber?: string;
  phone?: string;
  address?: string;
  statement: string;
  statementDate: string;
  signature?: string;
}

export interface ViolationTemplate {
  code: string;
  type: ViolationType;
  description: string;
  legalBasis: string; // Căn cứ pháp lý
  minFine: number;
  maxFine: number;
  pointsDeducted?: number;
  additionalPenalties?: string[]; // Thu giữ GPLX, tạm giữ xe, etc.
  vehicleTypes?: string[]; // Áp dụng cho loại xe nào
  notes?: string;
}

export interface BlacklistEntry {
  id: string;
  type: 'driver' | 'vehicle';
  subjectId: string; // License number or plate number
  subjectName: string;
  reason: string;
  addedDate: string;
  addedBy: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'removed';
  violations: string[]; // List of violation IDs
  notes?: string;
}

export interface ViolationReport {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: {
    from: string;
    to: string;
  };
  generatedBy: string;
  generatedDate: string;
  statistics: {
    totalViolations: number;
    totalFines: number;
    paidFines: number;
    unpaidFines: number;
    byType: Record<ViolationType, number>;
    byLocation: Record<string, number>;
    byOfficer: Record<string, number>;
    topViolations: Array<{
      type: ViolationType;
      count: number;
      totalFine: number;
    }>;
  };
  charts?: {
    type: string;
    data: any;
  }[];
  exportUrl?: string;
}

export interface ViolationStatistics {
  total: number;
  pending: number;
  unpaid: number;
  paid: number;
  appealed: number;
  totalFines: number;
  collectedFines: number;
  outstandingFines: number;
  byType: Record<ViolationType, number>;
  byProvince: Record<string, number>;
  byMonth: Array<{
    month: string;
    count: number;
    fines: number;
  }>;
  topViolators: Array<{
    name: string;
    licenseNumber: string;
    violationCount: number;
    totalFines: number;
  }>;
}

export interface ViolationNotification {
  id: string;
  violationId: string;
  recipientType: 'violator' | 'vehicle_owner';
  recipientName: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  sentDate?: string;
  sentMethod: 'sms' | 'email' | 'postal' | 'app';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  deliveryDate?: string;
  readDate?: string;
  content: string;
  attachments?: string[];
}
