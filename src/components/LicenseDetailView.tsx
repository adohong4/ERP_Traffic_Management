import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X,
  FileText,
  Calendar,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  History,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Blocks
} from 'lucide-react';
import { License } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';
import { toast } from 'sonner';

interface LicenseDetailViewProps {
  license: License;
  onBack: () => void;
}

// Mock history data
const mockViolationHistory = [
  { id: 'V001', date: '15/03/2024', type: 'Vượt tốc độ cho phép', location: 'Quận 1, TP.HCM', fine: 800000, status: 'paid' as const, points: 2 },
  { id: 'V002', date: '22/01/2024', type: 'Dừng đỗ sai quy định', location: 'Quận 3, TP.HCM', fine: 300000, status: 'paid' as const, points: 1 },
  { id: 'V003', date: '05/12/2023', type: 'Vượt đèn đỏ', location: 'Quận 7, TP.HCM', fine: 1200000, status: 'paid' as const, points: 4 }
];

const mockChangeHistory = [
  { id: 'H001', changeType: 'issued', changeDate: '10/01/2020', reason: 'Cấp GPLX lần đầu', performedBy: 'Phòng CSGT TP.HCM', notes: 'Đạt kỳ thi lý thuyết và thực hành' },
  { id: 'H002', changeType: 'renewed', changeDate: '15/01/2023', reason: 'Gia hạn GPLX', performedBy: 'Phòng CSGT TP.HCM', notes: 'Gia hạn thời hạn sử dụng' },
  { id: 'H003', changeType: 'upgraded', changeDate: '20/06/2023', reason: 'Nâng hạng từ B1 lên B2', performedBy: 'Phòng CSGT TP.HCM', notes: 'Hoàn thành khóa học nâng hạng' }
];

export default function LicenseDetailView({ license, onBack }: LicenseDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLicense, setEditedLicense] = useState(license);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    if (isEditing) {
      setBreadcrumbs([
        { label: 'Quản lý GPLX', onClick: onBack },
        { 
          label: `Chi tiết - ${license.licenseNumber}`, 
          onClick: () => setIsEditing(false) 
        },
        { label: 'Cập nhật thông tin' }
      ]);
    } else {
      setBreadcrumbs([
        { label: 'Quản lý GPLX', onClick: onBack },
        { label: `Chi tiết - ${license.licenseNumber}` }
      ]);
    }

    return () => {
      setBreadcrumbs([]);
    };
  }, [isEditing]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      active: { label: 'Đang hiệu lực', className: 'bg-green-500 text-white' },
      expired: { label: 'Hết hạn', className: 'bg-gray-500 text-white' },
      revoked: { label: 'Thu hồi', className: 'bg-red-500 text-white' },
      suspended: { label: 'Tạm dừng', className: 'bg-yellow-500 text-white' }
    };
    const config = configs[status] || configs.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getChangeTypeConfig = (type: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      issued: { label: 'Cấp mới', color: 'text-blue-600', icon: FileText },
      renewed: { label: 'Gia hạn', color: 'text-green-600', icon: CheckCircle },
      upgraded: { label: 'Nâng hạng', color: 'text-purple-600', icon: TrendingUp },
      suspended: { label: 'Tạm dừng', color: 'text-yellow-600', icon: AlertCircle },
      revoked: { label: 'Thu hồi', color: 'text-red-600', icon: XCircle },
      reactivated: { label: 'Kích hoạt lại', color: 'text-green-600', icon: CheckCircle }
    };
    return configs[type] || configs.issued;
  };

  const handleSave = () => {
    toast.success('Cập nhật thông tin GPLX thành công!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLicense(license);
    setIsEditing(false);
    toast.info('Đã hủy thay đổi');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl mb-2">Chi tiết GPLX</h2>
            <p className="text-muted-foreground">
              Số GPLX: <code className="bg-muted px-2 py-1 rounded font-mono">{license.licenseNumber}</code>
            </p>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(isEditing ? editedLicense.status : license.status)}
            {!isEditing && (
              <>
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300 hover:border-purple-400 text-purple-700"
                  onClick={() => toast.success('Đã lưu thông tin GPLX vào Blockchain thành công!')}
                >
                  <Blocks className="mr-2 h-4 w-4" />
                  Lưu vào Blockchain
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">
            <FileText className="mr-2 h-4 w-4" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="violations">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Lịch sử vi phạm ({mockViolationHistory.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Lịch sử thay đổi
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        value={editedLicense.holderName}
                        onChange={(e) => setEditedLicense({...editedLicense, holderName: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium">{license.holderName}</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground">CMND/CCCD</Label>
                    {isEditing ? (
                      <Input
                        value={editedLicense.idCard}
                        onChange={(e) => setEditedLicense({...editedLicense, idCard: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 font-medium font-mono">{license.idCard}</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Thành phố
                    </Label>
                    <p className="mt-1 font-medium">{license.city}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin GPLX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Hạng GPLX</Label>
                    <p className="mt-1">
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {license.licenseType}
                      </Badge>
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày cấp
                    </Label>
                    <p className="mt-1 font-medium">{new Date(license.issueDate).toLocaleDateString('vi-VN')}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày hết hạn
                    </Label>
                    <p className="mt-1 font-medium">{new Date(license.expiryDate).toLocaleDateString('vi-VN')}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground">Nơi cấp</Label>
                    <p className="mt-1 font-medium">{license.issuePlace}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Số lần vi phạm
                    </Label>
                    <p className="mt-1">
                      <Badge 
                        className={
                          license.violations === 0 
                            ? 'bg-green-500 text-white'
                            : license.violations <= 3
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                        }
                      >
                        {license.violations} lần
                      </Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-2"
            >
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            </motion.div>
          )}
        </TabsContent>

        {/* Violations History Tab */}
        <TabsContent value="violations">
          <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle>Lịch sử vi phạm</CardTitle>
              <CardDescription>
                Tổng cộng {mockViolationHistory.length} vi phạm - 
                Tổng phạt: {mockViolationHistory.reduce((sum, v) => sum + v.fine, 0).toLocaleString('vi-VN')} VNĐ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockViolationHistory.map((violation, index) => (
                  <motion.div
                    key={violation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{violation.type}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {violation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {violation.location}
                          </span>
                        </div>
                      </div>
                      <Badge className={violation.status === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                        {violation.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">
                        Phạt: {violation.fine.toLocaleString('vi-VN')} VNĐ
                      </span>
                      <span className="text-orange-600">
                        Trừ {violation.points} điểm
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change History Tab */}
        <TabsContent value="history">
          <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle>Lịch sử thay đổi</CardTitle>
              <CardDescription>Các thay đổi liên quan đến GPLX này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {mockChangeHistory.map((change, index) => {
                    const config = getChangeTypeConfig(change.changeType);
                    const Icon = config.icon;
                    
                    return (
                      <motion.div
                        key={change.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-12"
                      >
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{change.reason}</h4>
                              <p className={`text-sm ${config.color}`}>{config.label}</p>
                            </div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {change.changeDate}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Người thực hiện:</span> {change.performedBy}
                            </p>
                            {change.notes && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Ghi chú:</span> {change.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}