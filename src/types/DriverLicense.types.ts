// Driver License related types

export interface DriverLicense {
  id: string;
  licenseNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  province: string;
  class: LicenseClass;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: LicenseStatus;
  violations?: number;
  points?: number;
  avatar?: string;
  idNumber: string;
  phone?: string;
  email?: string;
  bloodType?: string;
  organDonor?: boolean;
  restrictions?: string[];
  endorsements?: string[];
  onBlockchain?: boolean; // Đã lưu trữ vào blockchain chưa
  blockchainTxHash?: string; // Transaction hash nếu đã lưu
  createdAt?: string;
  updatedAt?: string;
}

export type LicenseClass = 
  | 'A1' // Xe mô tô hai bánh có dung tích xi-lanh từ 50 cm³ đến dưới 175 cm³
  | 'A2' // Xe mô tô hai bánh có dung tích xi-lanh từ 175 cm³ trở lên và các loại xe quy định cho hạng A1
  | 'A3' // Xe mô tô ba bánh
  | 'A4' // Máy kéo có trọng tải đến 1.000 kg
  | 'B1' // Xe ô tô chở người đến 9 chỗ ngồi
  | 'B2' // Xe ô tô chở người trên 9 chỗ ngồi, xe ô tô chở hàng có trọng tải dưới 3.500 kg
  | 'C' // Xe ô tô chở hàng có trọng tải từ 3.500 kg trở lên
  | 'D' // Xe ô tô chở người từ 10 đến 30 chỗ ngồi
  | 'E' // Xe ô tô chở người trên 30 chỗ ngồi
  | 'FB2' // Lái xe ô tô chở người trên 9 chỗ ngồi có kéo rơ moóc
  | 'FC' // Lái xe ô tô chở hàng có trọng tải từ 3.500 kg trở lên có kéo rơ moóc
  | 'FD' // Lái xe ô tô chở người từ 10 đến 30 chỗ ngồi có kéo rơ moóc
  | 'FE'; // Lái xe ô tô chở người trên 30 chỗ ngồi có kéo rơ moóc

export type LicenseStatus = 
  | 'active' // Còn hiệu lực
  | 'expired' // Hết hạn
  | 'suspended' // Tạm thu
  | 'revoked' // Thu hồi
  | 'pending' // Chờ cấp
  | 'lost' // Mất
  | 'damaged'; // Hỏng

export interface LicenseApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  type: LicenseApplicationType;
  class: LicenseClass;
  currentLicenseNumber?: string;
  applicationDate: string;
  appointmentDate?: string;
  status: ApplicationStatus;
  documents: ApplicationDocument[];
  medicalCertificate?: MedicalCertificate;
  drivingTest?: DrivingTest;
  processingOfficer?: string;
  notes?: string;
  rejectionReason?: string;
  approvalDate?: string;
  issuedLicenseNumber?: string;
}

export type LicenseApplicationType = 
  | 'new' // Cấp mới
  | 'renewal' // Gia hạn
  | 'replacement' // Đổi (do hỏng, mất)
  | 'upgrade' // Nâng hạng
  | 'additional' // Cấp thêm hạng
  | 'international'; // Cấp giấy phép lái xe quốc tế

export type ApplicationStatus = 
  | 'draft' // Nháp
  | 'submitted' // Đã nộp
  | 'under_review' // Đang xem xét
  | 'approved' // Đã phê duyệt
  | 'rejected' // Từ chối
  | 'completed' // Hoàn thành
  | 'cancelled'; // Hủy

export interface ApplicationDocument {
  id: string;
  type: DocumentType;
  name: string;
  url?: string;
  uploadDate: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export type DocumentType = 
  | 'id_card' // CMND/CCCD
  | 'photo' // Ảnh 3x4
  | 'medical_cert' // Giấy khám sức khỏe
  | 'current_license' // GPLX hiện tại (nếu có)
  | 'training_cert' // Giấy chứng nhận học lái xe
  | 'residence_cert' // Giấy chứng nhận cư trú
  | 'other'; // Khác

export interface MedicalCertificate {
  id: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingHospital: string;
  doctor: string;
  height: number;
  weight: number;
  bloodPressure: string;
  vision: {
    left: string;
    right: string;
    colorBlind: boolean;
  };
  hearing: 'normal' | 'impaired';
  mental: 'normal' | 'impaired';
  physical: 'normal' | 'impaired';
  result: 'passed' | 'failed';
  restrictions?: string[];
  notes?: string;
}

export interface DrivingTest {
  id: string;
  applicationId: string;
  testDate: string;
  testCenter: string;
  theoryTest: TestResult;
  practiceTest: TestResult;
  overallResult: 'passed' | 'failed' | 'pending';
  examiner?: string;
  notes?: string;
  retakeDate?: string;
  retakeCount?: number;
}

export interface TestResult {
  score: number;
  maxScore: number;
  passed: boolean;
  date: string;
  examiner?: string;
  notes?: string;
}

export interface LicenseHistory {
  id: string;
  licenseId: string;
  action: LicenseAction;
  date: string;
  reason?: string;
  performedBy: string;
  details?: string;
  previousStatus?: LicenseStatus;
  newStatus?: LicenseStatus;
}

export type LicenseAction = 
  | 'issued' // Cấp mới
  | 'renewed' // Gia hạn
  | 'replaced' // Thay thế
  | 'upgraded' // Nâng hạng
  | 'suspended' // Tạm thu
  | 'revoked' // Thu hồi
  | 'restored' // Khôi phục
  | 'updated'; // Cập nhật thông tin

export interface LicenseStatistics {
  total: number;
  active: number;
  expired: number;
  suspended: number;
  revoked: number;
  pending: number;
  byClass: Record<LicenseClass, number>;
  byProvince: Record<string, number>;
  newThisMonth: number;
  expiringThisMonth: number;
  renewalRate: number;
}