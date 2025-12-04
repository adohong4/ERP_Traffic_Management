// Mock data for the ERP system

export interface Student {
  id: string;
  fullName: string;
  dateOfBirth: string;
  idCard: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  licenseType: string;
  theoryScore: number;
  practiceScore: number;
  status: 'pending' | 'passed' | 'failed';
  examDate: string;
  examCenter: string;
  healthCheckStatus: 'approved' | 'pending' | 'rejected';
}

export interface License {
  id: string;
  licenseNumber: string;
  holderName: string;
  idCard: string;
  licenseType: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  violations: number;
  city: string;
  issuePlace: string;
  walletAddress?: string; // Wallet address for user login
  onBlockchain?: boolean;
  blockchainTxHash?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  owner: string;
  ownerPhone: string;
  vehicleType: string;
  brand: string;
  model: string;
  color: string;
  registrationDate: string;
  lastInspection: string;
  nextInspection: string;
  status: 'valid' | 'expired' | 'pending';
  city: string;
  onBlockchain?: boolean;
  blockchainTxHash?: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'traffic-law' | 'announcement' | 'guide' | 'news';
  author: string;
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  tags: string[];
  thumbnail: string;
  featured: boolean;
}

export interface Violation {
  id: string;
  violatorName: string;
  licenseNumber: string;
  plateNumber: string;
  violationType: string;
  location: string;
  city: string;
  date: string;
  fine: number;
  status: 'pending' | 'paid' | 'overdue';
  points: number;
  officer: string;
  description?: string;
  images?: string[];
  paymentDate?: string;
  paymentMethod?: string;
}

export interface LicenseHistory {
  id: string;
  licenseId: string;
  changeType: 'issued' | 'renewed' | 'upgraded' | 'suspended' | 'revoked' | 'reactivated';
  changeDate: string;
  reason: string;
  performedBy: string;
  notes?: string;
}

export interface LicenseViolationHistory {
  violationId: string;
  date: string;
  type: string;
  location: string;
  fine: number;
  status: 'pending' | 'paid' | 'overdue';
  points: number;
}

// Generate mock data
const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const middleNames = ['Văn', 'Thị', 'Minh', 'Hoàng', 'Công', 'Thanh', 'Hữu', 'Đức', 'Quốc', 'Anh', 'Tuấn', 'Như'];
const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Đức', 'Giang', 'Hải', 'Hùng', 'Khoa', 'Linh', 'Mai', 'Nam', 'Phương', 'Quân', 'Sơn', 'Tú', 'Việt', 'Yến', 'Long', 'Hòa'];
const cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nghệ An', 'Thanh Hóa', 'Bình Dương', 'Đồng Nai'];
const licenseTypes = ['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F'];
const vehicleTypes = ['Ô tô con', 'Xe máy', 'Ô tô tải', 'Xe khách', 'Xe đầu kéo'];
const vehicleBrands = ['Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai', 'KIA', 'Vinfast', 'Mercedes', 'BMW'];
const colors = ['Trắng', 'Đen', 'Bạc', 'Xám', 'Đỏ', 'Xanh'];
const violationTypes = [
  'Vượt đèn đỏ',
  'Vượt tốc độ cho phép',
  'Nồng độ cồn vượt mức',
  'Không đội mũ bảo hiểm',
  'Dừng đỗ sai quy định',
  'Chuyển làn không xi-nhan',
  'Không có giấy phép lái xe',
  'Sử dụng điện thoại khi lái xe',
  'Lấn làn đường',
  'Chở quá số người quy định'
];

const generateName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middle = middleNames[Math.floor(Math.random() * middleNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${middle} ${last}`;
};

const generateDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generatePhone = () => {
  return `09${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const generatePlateNumber = (city: string) => {
  const codes: any = {
    'Hà Nội': ['29', '30', '31', '32', '33'],
    'TP.HCM': ['50', '51', '52', '53', '54'],
    'Đà Nẵng': ['43'],
    'Hải Phòng': ['15', '16'],
    'Cần Thơ': ['65'],
    'Nghệ An': ['37', '38'],
    'Thanh Hóa': ['36'],
    'Bình Dương': ['61'],
    'Đồng Nai': ['60']
  };
  const code = codes[city][Math.floor(Math.random() * codes[city].length)];
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number = Math.floor(10000 + Math.random() * 90000);
  return `${code}${letter}-${number}`;
};

const generateWalletAddress = () => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate students
export const students: Student[] = Array.from({ length: 120 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const licenseType = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
  const theoryScore = Math.floor(Math.random() * 50);
  const practiceScore = Math.floor(Math.random() * 100);
  const passed = theoryScore >= 32 && practiceScore >= 80;
  const examDate = generateDate(new Date(2024, 0, 1), new Date(2024, 10, 25));
  
  return {
    id: `ST${String(i + 1).padStart(5, '0')}`,
    fullName: generateName(),
    dateOfBirth: generateDate(new Date(1990, 0, 1), new Date(2006, 0, 1)).toISOString().split('T')[0],
    idCard: `0010${String(Math.floor(90000000 + Math.random() * 10000000))}`,
    address: `Số ${Math.floor(1 + Math.random() * 999)}, ${city}`,
    city,
    phone: generatePhone(),
    email: `student${i + 1}@email.com`,
    licenseType,
    theoryScore,
    practiceScore,
    status: passed ? 'passed' : (theoryScore < 20 || practiceScore < 50 ? 'failed' : 'pending'),
    examDate: examDate.toISOString().split('T')[0],
    examCenter: `Trung tâm ${city}`,
    healthCheckStatus: Math.random() > 0.1 ? 'approved' : (Math.random() > 0.5 ? 'pending' : 'rejected')
  };
});

// Generate licenses
export const licenses: License[] = Array.from({ length: 150 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const licenseType = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
  const issueDate = generateDate(new Date(2015, 0, 1), new Date(2024, 10, 1));
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  
  const isExpired = expiryDate < new Date();
  const violations = Math.floor(Math.random() * 15);
  
  let status: 'active' | 'expired' | 'revoked' | 'suspended' = 'active';
  if (isExpired) status = 'expired';
  else if (violations > 10) status = 'suspended';
  else if (Math.random() > 0.95) status = 'revoked';
  
  const cityCode = city === 'TP.HCM' ? 'HCM' : city.split(' ')[0].substring(0, 2).toUpperCase();
  
  return {
    id: `LC${String(i + 1).padStart(5, '0')}`,
    licenseNumber: `${licenseType}-${cityCode}-${String(100000 + i).substring(1)}`,
    holderName: generateName(),
    idCard: `0010${String(Math.floor(90000000 + Math.random() * 10000000))}`,
    licenseType,
    issueDate: issueDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    status,
    violations,
    city,
    issuePlace: `Phòng CSGT ${city}`,
    walletAddress: Math.random() > 0.3 ? generateWalletAddress() : undefined, // 70% có wallet address
    onBlockchain: Math.random() > 0.5,
    blockchainTxHash: Math.random() > 0.5 ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined
  };
});

// Generate vehicles
export const vehicles: Vehicle[] = Array.from({ length: 180 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  const brand = vehicleBrands[Math.floor(Math.random() * vehicleBrands.length)];
  const registrationDate = generateDate(new Date(2010, 0, 1), new Date(2024, 0, 1));
  const lastInspection = generateDate(new Date(2023, 0, 1), new Date(2024, 10, 1));
  const nextInspection = new Date(lastInspection);
  nextInspection.setFullYear(nextInspection.getFullYear() + (vehicleType === 'Xe máy' ? 2 : 1));
  
  let status: 'valid' | 'expired' | 'pending' = 'valid';
  if (nextInspection < new Date()) status = 'expired';
  else if (Math.random() > 0.8) status = 'pending';
  
  return {
    id: `VH${String(i + 1).padStart(5, '0')}`,
    plateNumber: generatePlateNumber(city),
    owner: generateName(),
    ownerPhone: generatePhone(),
    vehicleType,
    brand,
    model: `${brand} ${Math.floor(2010 + Math.random() * 15)}`,
    color: colors[Math.floor(Math.random() * colors.length)],
    registrationDate: registrationDate.toISOString().split('T')[0],
    lastInspection: lastInspection.toISOString().split('T')[0],
    nextInspection: nextInspection.toISOString().split('T')[0],
    status,
    city,
    onBlockchain: Math.random() > 0.5,
    blockchainTxHash: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 18)}` : undefined
  };
});

// Generate violations
export const violations: Violation[] = Array.from({ length: 200 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const violationType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
  const date = generateDate(new Date(2024, 0, 1), new Date());
  
  let fine = 0;
  let points = 0;
  
  switch (violationType) {
    case 'Nồng độ cồn vượt mức':
      fine = Math.floor(30000000 + Math.random() * 10000000);
      points = 6;
      break;
    case 'Vượt tốc độ cho phép':
      fine = Math.floor(4000000 + Math.random() * 4000000);
      points = 4;
      break;
    case 'Vượt đèn đỏ':
      fine = Math.floor(2000000 + Math.random() * 2000000);
      points = 2;
      break;
    case 'Không có giấy phép lái xe':
      fine = Math.floor(8000000 + Math.random() * 4000000);
      points = 5;
      break;
    default:
      fine = Math.floor(200000 + Math.random() * 2000000);
      points = Math.floor(1 + Math.random() * 3);
  }
  
  const daysSince = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  let status: 'pending' | 'paid' | 'overdue' = 'pending';
  if (daysSince > 30) status = 'overdue';
  else if (Math.random() > 0.5) status = 'paid';
  
  // Add images for some violations
  const hasImages = Math.random() > 0.5;
  const images = hasImages ? [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    'https://images.unsplash.com/photo-1486093986320-26c0913e4c88?w=800'
  ] : undefined;
  
  return {
    id: `VL${String(i + 1).padStart(5, '0')}`,
    violatorName: generateName(),
    licenseNumber: `${licenseTypes[Math.floor(Math.random() * licenseTypes.length)]}-${city.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    plateNumber: generatePlateNumber(city),
    violationType,
    location: `${city} - ${['Đường Láng', 'Nguyễn Huệ', 'Lê Lợi', 'Trần Phú', 'Hai Bà Trưng'][Math.floor(Math.random() * 5)]}`,
    city,
    date: date.toISOString(),
    fine,
    status,
    points,
    officer: generateName(),
    description: `Vi phạm ${violationType.toLowerCase()} được phát hiện bởi camera giám sát tại ${city}.`,
    images,
    paymentDate: status === 'paid' ? new Date(date.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN') : undefined,
    paymentMethod: status === 'paid' ? ['Chuyển khoản', 'Tiền mặt', 'Ví điện tử'][Math.floor(Math.random() * 3)] : undefined
  };
});

export const dashboardStats = {
  totalLicenses: licenses.length,
  newLicenses: licenses.filter(l => new Date(l.issueDate) > new Date(2024, 9, 1)).length,
  totalVehicles: vehicles.length,
  pendingInspections: vehicles.filter(v => v.status === 'pending').length,
  totalViolations: violations.length,
  studentsThisMonth: students.filter(s => new Date(s.examDate) > new Date(2024, 9, 1)).length,
  passRate: Math.round((students.filter(s => s.status === 'passed').length / students.length) * 1000) / 10,
  totalFacilities: 45
};

export const chartData = {
  licensesByType: licenseTypes.map(type => ({
    type,
    count: licenses.filter(l => l.licenseType === type).length
  })),
  monthlyExams: Array.from({ length: 10 }, (_, i) => {
    const month = new Date(2024, i, 1);
    const monthStudents = students.filter(s => {
      const examDate = new Date(s.examDate);
      return examDate.getMonth() === i && examDate.getFullYear() === 2024;
    });
    return {
      month: `T${i + 1}`,
      students: monthStudents.length,
      passed: monthStudents.filter(s => s.status === 'passed').length
    };
  }),
  violationsByType: violationTypes.slice(0, 5).map(type => ({
    type,
    count: violations.filter(v => v.violationType === type).length
  })),
  licensesByCity: cities.map(city => ({
    city,
    count: licenses.filter(l => l.city === city).length
  })),
  vehiclesByType: vehicleTypes.map(type => ({
    type,
    count: vehicles.filter(v => v.vehicleType === type).length
  }))
};

export interface InspectionCertificate {
  id: string;
  certificateNumber: string;
  plateNumber: string;
  vehicleType: string;
  owner: string;
  issueDate: string;
  expiryDate: string;
  inspectionCenter: string;
  status: 'valid' | 'expired' | 'pending';
  city: string;
  technician: string;
}

export interface VehicleRegistration {
  id: string;
  registrationNumber: string;
  plateNumber: string;
  owner: string;
  ownerIdCard: string;
  vehicleType: string;
  brand: string;
  model: string;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: string;
  status: 'active' | 'transferred' | 'cancelled';
  city: string;
}

export interface TrafficAuthority {
  id: string;
  name: string;
  code: string;
  type: 'police_department' | 'inspection_center' | 'exam_center' | 'registration_office';
  address: string;
  city: string;
  director: string;
  phone: string;
  email: string;
  employees: number;
  status: 'active' | 'inactive';
  establishedDate: string;
  walletAddresses?: {
    address: string;
    role: 'admin' | 'manager' | 'officer' | 'viewer';
    assignedDate: string;
    assignedBy: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
}

// Generate inspection certificates
export const inspectionCertificates: InspectionCertificate[] = Array.from({ length: 200 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  const issueDate = generateDate(new Date(2023, 0, 1), new Date(2024, 10, 1));
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + (vehicleType === 'Xe máy' ? 2 : 1));
  
  let status: 'valid' | 'expired' | 'pending' = 'valid';
  if (expiryDate < new Date()) status = 'expired';
  else if (Math.random() > 0.85) status = 'pending';
  
  return {
    id: `IC${String(i + 1).padStart(5, '0')}`,
    certificateNumber: `DK-${city.substring(0, 2).toUpperCase()}-${String(100000 + i).substring(1)}`,
    plateNumber: generatePlateNumber(city),
    vehicleType,
    owner: generateName(),
    issueDate: issueDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    inspectionCenter: `Trung tâm đăng kiểm ${city}`,
    status,
    city,
    technician: generateName()
  };
});

// Generate vehicle registrations
export const vehicleRegistrations: VehicleRegistration[] = Array.from({ length: 180 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  const brand = vehicleBrands[Math.floor(Math.random() * vehicleBrands.length)];
  const registrationDate = generateDate(new Date(2010, 0, 1), new Date(2024, 0, 1));
  
  const statuses: ('active' | 'transferred' | 'cancelled')[] = ['active', 'transferred', 'cancelled'];
  const status = statuses[Math.floor(Math.random() * 10) < 8 ? 0 : Math.floor(Math.random() * 3)];
  
  return {
    id: `VR${String(i + 1).padStart(5, '0')}`,
    registrationNumber: `DKX-${city.substring(0, 2).toUpperCase()}-${String(100000 + i).substring(1)}`,
    plateNumber: generatePlateNumber(city),
    owner: generateName(),
    ownerIdCard: `0010${String(Math.floor(90000000 + Math.random() * 10000000))}`,
    vehicleType,
    brand,
    model: `${brand} ${Math.floor(2010 + Math.random() * 15)}`,
    engineNumber: `ENG${String(Math.floor(1000000 + Math.random() * 9000000))}`,
    chassisNumber: `CHS${String(Math.floor(1000000 + Math.random() * 9000000))}`,
    registrationDate: registrationDate.toISOString().split('T')[0],
    status,
    city
  };
});

// Generate traffic authorities
const authorityTypes = [
  { type: 'police_department' as const, name: 'Phòng CSGT' },
  { type: 'inspection_center' as const, name: 'Trung tâm đăng kiểm' },
  { type: 'exam_center' as const, name: 'Trung tâm sát hạch' },
  { type: 'registration_office' as const, name: 'Phòng đăng ký xe' }
];

const roles: ('admin' | 'manager' | 'officer' | 'viewer')[] = ['admin', 'manager', 'officer', 'viewer'];

export const trafficAuthorities: TrafficAuthority[] = Array.from({ length: 50 }, (_, i) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const authorityType = authorityTypes[Math.floor(Math.random() * authorityTypes.length)];
  const establishedDate = generateDate(new Date(2000, 0, 1), new Date(2020, 0, 1));
  
  // Generate 1-4 wallet addresses per authority
  const numAddresses = Math.floor(1 + Math.random() * 4);
  const walletAddresses = Array.from({ length: numAddresses }, () => ({
    address: generateWalletAddress(),
    role: roles[Math.floor(Math.random() * roles.length)],
    assignedDate: generateDate(new Date(2020, 0, 1), new Date(2024, 0, 1)).toISOString().split('T')[0],
    assignedBy: generateName()
  }));
  
  return {
    id: `TA${String(i + 1).padStart(5, '0')}`,
    name: `${authorityType.name} ${city}`,
    code: `${authorityType.type.substring(0, 2).toUpperCase()}-${city.substring(0, 2).toUpperCase()}-${String(100 + i).substring(1)}`,
    type: authorityType.type,
    address: `Số ${Math.floor(1 + Math.random() * 999)}, ${city}`,
    city,
    director: generateName(),
    phone: generatePhone(),
    email: `${authorityType.type}.${city.toLowerCase().replace(/\./g, '').replace(/\s/g, '')}@conganbonganh.gov.vn`,
    employees: Math.floor(10 + Math.random() * 90),
    status: Math.random() > 0.05 ? 'active' : 'inactive',
    establishedDate: establishedDate.toISOString().split('T')[0],
    walletAddresses
  };
});

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Đăng kiểm sắp hết hạn',
    message: '15 phương tiện sắp đến hạn đăng kiểm trong 7 ngày tới',
    type: 'warning',
    read: false,
    date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Vi phạm mới',
    message: '23 vi phạm giao thông mới được ghi nhận',
    type: 'info',
    read: false,
    date: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Kỳ thi hoàn thành',
    message: 'Kỳ thi sát hạch ngày 25/10 đã hoàn thành với 45 thí sinh',
    type: 'success',
    read: true,
    date: new Date(Date.now() - 86400000).toISOString()
  }
];

// Generate news
export const newsArticles: News[] = [
  {
    id: 'NEWS00001',
    title: 'Thông báo thay đổi quy định về nồng độ cồn khi lái xe từ ngày 1/1/2025',
    slug: 'thong-bao-thay-doi-quy-dinh-nong-do-con',
    summary: 'Bộ Công an thông báo thay đổi quy định xử phạt vi phạm nồng độ cồn khi tham gia giao thông, áp dụng từ ngày 1/1/2025.',
    content: `<h2>Nội dung thay đổi</h2><p>Theo Nghị định mới, mức phạt đối với lái xe có nồng độ cồn sẽ được điều chỉnh như sau:</p><ul><li>Nồng độ cồn dưới 0.25mg/lít khí thở: Phạt 6-8 triệu đồng, tước GPLX 10-12 tháng</li><li>Nồng độ cồn từ 0.25-0.4mg/lít khí thở: Phạt 16-18 triệu đồng, tước GPLX 16-18 tháng</li><li>Nồng độ cồn trên 0.4mg/lít khí thở: Phạt 30-40 triệu đồng, tước GPLX 22-24 tháng</li></ul><p>Quy định này nhằm tăng cường ý thức người dân và giảm thiểu tai nạn giao thông do sử dụng rượu bia.</p>`,
    category: 'traffic-law',
    author: 'Cục CSGT - Bộ Công an',
    publishDate: new Date(2024, 10, 28).toISOString(),
    status: 'published',
    views: 15234,
    tags: ['Luật giao thông', 'Nồng độ cồn', 'Xử phạt'],
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    featured: true
  },
  {
    id: 'NEWS00002',
    title: 'Hướng dẫn đổi GPLX mới theo quy định 2024',
    slug: 'huong-dan-doi-gplx-moi-2024',
    summary: 'Hướng dẫn chi tiết về thủ tục đổi giấy phép lái xe sang mẫu mới theo Thông tư 12/2024/TT-BCA.',
    content: `<h2>Thủ tục đổi GPLX</h2><p>Người dân có thể đổi GPLX theo các bước sau:</p><ol><li>Chuẩn bị hồ sơ: GPLX cũ, CCCD, 2 ảnh 3x4 nền trắng</li><li>Nộp hồ sơ tại Phòng CSGT hoặc qua cổng dịch vụ công trực tuyến</li><li>Thanh toán lệ phí 135.000đ</li><li>Nhận GPLX mới sau 5-7 ngày làm việc</li></ol><p>GPLX mới có chip điện tử, tích hợp nhiều thông tin và bảo mật cao hơn.</p>`,
    category: 'guide',
    author: 'Phòng CSGT TP.HCM',
    publishDate: new Date(2024, 10, 25).toISOString(),
    status: 'published',
    views: 8942,
    tags: ['GPLX', 'Hướng dẫn', 'Đổi GPLX'],
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    featured: true
  },
  {
    id: 'NEWS00003',
    title: 'Triển khai hệ thống camera AI giám sát vi phạm giao thông',
    slug: 'trien-khai-he-thong-camera-ai',
    summary: 'Bộ Công an sẽ triển khai 1000 camera AI tại các tuyến đường trọng điểm để tự động phát hiện và xử lý vi phạm.',
    content: `<h2>Hệ thống camera AI hiện đại</h2><p>Hệ thống camera AI mới có khả năng:</p><ul><li>Tự động nhận diện biển số xe</li><li>Phát hiện vi phạm vượt đèn đỏ, vượt tốc độ</li><li>Nhận diện không đội mũ bảo hiểm</li><li>Phát hiện lấn làn, dừng đỗ sai quy định</li></ul><p>Hệ thống sẽ gửi thông báo vi phạm trực tiếp đến chủ phương tiện qua ứng dụng VNeID.</p>`,
    category: 'announcement',
    author: 'Bộ Công an',
    publishDate: new Date(2024, 10, 20).toISOString(),
    status: 'published',
    views: 12456,
    tags: ['Camera AI', 'Công nghệ', 'An toàn giao thông'],
    thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
    featured: true
  },
  {
    id: 'NEWS00004',
    title: 'Lịch nghỉ lễ và đăng kiểm xe dịp Tết Nguyên Đán 2025',
    slug: 'lich-nghi-le-tet-nguyen-dan-2025',
    summary: 'Thông báo lịch làm việc của các trung tâm đăng kiểm và Phòng CSGT trong dịp Tết Nguyên Đán 2025.',
    content: `<h2>Lịch nghỉ Tết 2025</h2><p>Các cơ quan giao thông sẽ nghỉ Tết từ 27/1 đến 2/2/2025 (tức 28 Tết đến mùng 4 Tết).</p><p>Đề nghị người dân sắp xếp đăng kiểm xe trước 25/1/2025 để tránh ảnh hưởng đến việc sử dụng phương tiện.</p><p>Trong trường hợp khẩn cấp, vui lòng liên hệ tổng đài 1900.xxxx để được hỗ trợ.</p>`,
    category: 'announcement',
    author: 'Cục Đăng kiểm Việt Nam',
    publishDate: new Date(2024, 10, 15).toISOString(),
    status: 'published',
    views: 6789,
    tags: ['Thông báo', 'Lịch làm việc', 'Tết'],
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800',
    featured: false
  },
  {
    id: 'NEWS00005',
    title: 'Mức phạt mới đối với vi phạm tốc độ trên đường cao tốc',
    slug: 'muc-phat-moi-vi-pham-toc-do-cao-toc',
    summary: 'Cập nhật mức phạt mới đối với các trường hợp vi phạm tốc độ trên đường cao tốc từ tháng 12/2024.',
    content: `<h2>Mức phạt mới</h2><p>Theo quy định mới:</p><ul><li>Vượt tốc độ dưới 10km/h: Cảnh cáo hoặc phạt 800.000đ - 1.200.000đ</li><li>Vượt tốc độ từ 10-20km/h: Phạt 2.000.000đ - 3.000.000đ</li><li>Vượt tốc độ từ 20-35km/h: Phạt 4.000.000đ - 6.000.000đ</li><li>Vượt tốc độ trên 35km/h: Phạt 7.000.000đ - 8.000.000đ + tước GPLX 2-4 tháng</li></ul>`,
    category: 'traffic-law',
    author: 'Cục CSGT',
    publishDate: new Date(2024, 10, 10).toISOString(),
    status: 'published',
    views: 10234,
    tags: ['Tốc độ', 'Xử phạt', 'Cao tốc'],
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    featured: false
  },
  {
    id: 'NEWS00006',
    title: 'Cách tra cứu điểm vi phạm GPLX trực tuyến',
    slug: 'cach-tra-cuu-diem-vi-pham-gplx',
    summary: 'Hướng dẫn chi tiết cách tra cứu điểm vi phạm giấy phép lái xe qua ứng dụng và website.',
    content: `<h2>Tra cứu điểm GPLX</h2><p>Có 3 cách tra cứu điểm vi phạm:</p><ol><li><strong>Qua ứng dụng VNeID:</strong> Đăng nhập > Dịch vụ công > GPLX > Xem điểm</li><li><strong>Qua website:</strong> Truy cập csgt.vn > Tra cứu > Nhập số GPLX</li><li><strong>Qua SMS:</strong> Soạn GP [Số GPLX] gửi 8077</li></ol><p>Mỗi GPLX có 12 điểm, trừ điểm theo từng vi phạm. Khi hết điểm sẽ bị thu hồi GPLX.</p>`,
    category: 'guide',
    author: 'Phòng Công nghệ thông tin',
    publishDate: new Date(2024, 10, 5).toISOString(),
    status: 'published',
    views: 18567,
    tags: ['Tra cứu', 'Điểm GPLX', 'Hướng dẫn'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    featured: false
  },
  {
    id: 'NEWS00007',
    title: 'Quy định mới về sử dụng điện thoại khi lái xe',
    slug: 'quy-dinh-moi-su-dung-dien-thoai-lai-xe',
    summary: 'Từ 1/1/2025, nghiêm cấm mọi hành vi sử dụng điện thoại khi điều khiển phương tiện.',
    content: `<h2>Quy định cụ thể</h2><p>Các hành vi bị cấm:</p><ul><li>Cầm điện thoại bằng tay khi lái xe</li><li>Nhắn tin, lướt mạng xã hội</li><li>Xem video, chơi game</li><li>Gọi điện không dùng tai nghe</li></ul><p><strong>Mức phạt:</strong> 600.000đ - 800.000đ đối với xe máy, 2.000.000đ - 3.000.000đ đối với ô tô.</p><p>Cho phép sử dụng điện thoại ở chế độ loa ngoài hoặc tai nghe Bluetooth.</p>`,
    category: 'traffic-law',
    author: 'Bộ Công an',
    publishDate: new Date(2024, 9, 28).toISOString(),
    status: 'published',
    views: 9876,
    tags: ['Điện thoại', 'An toàn', 'Luật giao thông'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    featured: false
  },
  {
    id: 'NEWS00008',
    title: '[Dự thảo] Đề xuất giảm tuổi thi GPLX hạng A1 xuống 16 tuổi',
    slug: 'du-thao-giam-tuoi-thi-gplx-a1',
    summary: 'Bộ Công an đang lấy ý kiến về đề xuất giảm độ tuổi tối thiểu để thi GPLX hạng A1 từ 18 xuống 16 tuổi.',
    content: `<h2>Nội dung đề xuất</h2><p>Theo dự thảo, học sinh từ 16 tuổi có thể thi lấy GPLX hạng A1 để điều khiển xe máy dưới 125cc.</p><p><strong>Lý do:</strong></p><ul><li>Phù hợp với thực tế nhiều học sinh sử dụng xe máy đến trường</li><li>Tăng cường giáo dục ý thức an toàn giao thông từ sớm</li><li>Hợp pháp hóa để quản lý tốt hơn</li></ul><p>Dự thảo đang được lấy ý kiến đến 31/12/2024.</p>`,
    category: 'news',
    author: 'Bộ Công an',
    publishDate: new Date(2024, 9, 20).toISOString(),
    status: 'draft',
    views: 5432,
    tags: ['Dự thảo', 'GPLX', 'Độ tuổi'],
    thumbnail: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800',
    featured: false
  }
];