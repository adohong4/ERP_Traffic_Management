import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Calendar, 
  MapPin, 
  User,
  Car,
  Download,
  Printer,
  CheckCircle
} from 'lucide-react';
import { InspectionCertificate } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';

const statusConfig = {
  valid: { label: 'Còn hiệu lực', color: 'bg-green-500' },
  expired: { label: 'Hết hạn', color: 'bg-red-500' },
  pending: { label: 'Đang xử lý', color: 'bg-yellow-500' }
};

interface InspectionDetailPageProps {
  certificate: InspectionCertificate;
  onBack: () => void;
  onEdit: () => void;
}

export default function InspectionDetailPage({ certificate, onBack, onEdit }: InspectionDetailPageProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Giấy tờ xe', onClick: onBack },
      { label: 'GPLX' }
    ]);

    return () => {
      resetBreadcrumbs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificate.certificateNumber]);

  const InfoRow = ({ icon: Icon, label, value, highlight }: any) => (
    <div className="flex items-start gap-4 py-3">
      <div className="flex items-center gap-2 min-w-[180px] text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className={`flex-1 ${highlight ? 'font-medium' : ''}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl">Chi tiết giấy đăng kiểm</h2>
            <p className="text-muted-foreground mt-1">
              Thông tin chi tiết giấy đăng kiểm {certificate.certificateNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            In
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin giấy đăng kiểm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow 
                icon={FileText} 
                label="Số giấy đăng kiểm" 
                value={certificate.certificateNumber} 
                highlight 
              />
              <Separator />
              <InfoRow 
                icon={Car} 
                label="Biển số xe" 
                value={certificate.plateNumber} 
              />
              <Separator />
              <InfoRow 
                icon={User} 
                label="Chủ sở hữu" 
                value={certificate.owner} 
              />
              <Separator />
              <InfoRow 
                icon={Car} 
                label="Loại xe" 
                value={certificate.vehicleType} 
              />
              <Separator />
              <InfoRow 
                icon={MapPin} 
                label="Trung tâm đăng kiểm" 
                value={certificate.inspectionCenter} 
              />
              <Separator />
              <InfoRow 
                icon={MapPin} 
                label="Thành phố" 
                value={certificate.city} 
              />
              <Separator />
              <InfoRow 
                icon={User} 
                label="Kỹ thuật viên" 
                value={certificate.technician} 
              />
              <Separator />
              <InfoRow 
                icon={Calendar} 
                label="Ngày cấp" 
                value={new Date(certificate.issueDate).toLocaleDateString('vi-VN')} 
              />
              <Separator />
              <InfoRow 
                icon={Calendar} 
                label="Ngày hết hạn" 
                value={new Date(certificate.expiryDate).toLocaleDateString('vi-VN')} 
              />
              <Separator />
              <InfoRow 
                icon={FileText} 
                label="Trạng thái" 
                value={
                  <Badge className={statusConfig[certificate.status].color}>
                    {statusConfig[certificate.status].label}
                  </Badge>
                } 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin
              </Button>
              {certificate.status === 'expired' && (
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Gia hạn đăng kiểm
                </Button>
              )}
              <Separator className="my-4" />
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Tải bản sao
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                In giấy đăng kiểm
              </Button>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${statusConfig[certificate.status].color}`}></div>
                  <div>
                    <p className="font-medium">{statusConfig[certificate.status].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {certificate.status === 'valid' 
                        ? `Còn hiệu lực đến ${new Date(certificate.expiryDate).toLocaleDateString('vi-VN')}`
                        : certificate.status === 'expired'
                        ? `Đã hết hạn từ ${new Date(certificate.expiryDate).toLocaleDateString('vi-VN')}`
                        : 'Đang xử lý đăng kiểm'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
                <p className="text-xl">
                  {Math.max(0, Math.ceil((new Date(certificate.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} ngày
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian sử dụng</p>
                <p className="text-xl">
                  {Math.floor((new Date().getTime() - new Date(certificate.issueDate).getTime()) / (1000 * 60 * 60 * 24))} ngày
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
