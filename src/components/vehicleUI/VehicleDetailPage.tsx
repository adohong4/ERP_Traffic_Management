import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Car,
  Calendar,
  MapPin,
  User,
  Phone,
  FileText,
  Download,
  Printer,
  AlertTriangle,
  Blocks,
  Shield
} from 'lucide-react';
import { Vehicle } from '@/lib/mockData';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import { toast } from 'sonner';
import BlockchainConfirmModal from '@/components/BlockchainConfirmModal';

const statusConfig = {
  valid: { label: 'Còn hiệu lực', color: 'bg-green-500' },
  expired: { label: 'Hết hạn', color: 'bg-red-500' },
  pending: { label: 'Đang xử lý', color: 'bg-yellow-500' }
};

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  onBack: () => void;
  onEdit: () => void;
}

export default function VehicleDetailPage({ vehicle, onBack, onEdit }: VehicleDetailPageProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Phương tiện', onClick: onBack },
      { label: vehicle.plateNumber }
    ]);

    return () => {
      resetBreadcrumbs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.plateNumber]);

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

  const [isBlockchainModalOpen, setBlockchainModalOpen] = useState(false);

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
            <h2 className="text-3xl">Chi tiết phương tiện</h2>
            <p className="text-muted-foreground mt-1">
              Thông tin chi tiết phương tiện {vehicle.plateNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {vehicle.onBlockchain ? (
            <Button
              variant="outline"
              className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-400 hover:border-cyan-500 text-cyan-700"
              size="sm"
              disabled
            >
              <Shield className="mr-2 h-4 w-4" />
              Đã lưu trữ vào Blockchain
            </Button>
          ) : (
            <Button
              variant="outline"
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300 hover:border-purple-400 text-purple-700"
              size="sm"
              onClick={() => setBlockchainModalOpen(true)}
            >
              <Blocks className="mr-2 h-4 w-4" />
              Lưu vào Blockchain
            </Button>
          )}
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
                <Car className="h-5 w-5" />
                Thông tin phương tiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow
                icon={Car}
                label="Biển số xe"
                value={vehicle.plateNumber}
                highlight
              />
              <Separator />
              <InfoRow
                icon={User}
                label="Chủ sở hữu"
                value={vehicle.owner}
              />
              <Separator />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={vehicle.ownerPhone}
              />
              <Separator />
              <InfoRow
                icon={Car}
                label="Loại xe"
                value={vehicle.vehicleType}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Hãng xe"
                value={vehicle.brand}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Model"
                value={vehicle.model}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Màu sắc"
                value={vehicle.color}
              />
              <Separator />
              <InfoRow
                icon={MapPin}
                label="Thành phố"
                value={vehicle.city}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Ngày đăng ký"
                value={new Date(vehicle.registrationDate).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Lần đăng kiểm gần nhất"
                value={new Date(vehicle.lastInspection).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Đăng kiểm tiếp theo"
                value={new Date(vehicle.nextInspection).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Trạng thái"
                value={
                  <Badge className={statusConfig[vehicle.status].color}>
                    {statusConfig[vehicle.status].label}
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
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Xem giấy đăng kiểm
              </Button>
              {vehicle.status === 'expired' && (
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
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
                In thông tin
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
                  <div className={`h-3 w-3 rounded-full ${statusConfig[vehicle.status].color}`}></div>
                  <div>
                    <p className="font-medium">{statusConfig[vehicle.status].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.status === 'valid'
                        ? `Đăng kiểm đến ${new Date(vehicle.nextInspection).toLocaleDateString('vi-VN')}`
                        : vehicle.status === 'expired'
                          ? `Đã hết hạn từ ${new Date(vehicle.nextInspection).toLocaleDateString('vi-VN')}`
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
                <p className="text-sm text-muted-foreground">Thời gian đến kỳ đăng kiểm</p>
                <p className="text-xl">
                  {Math.max(0, Math.ceil((new Date(vehicle.nextInspection).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} ngày
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tuổi xe</p>
                <p className="text-xl">
                  {Math.floor((new Date().getTime() - new Date(vehicle.registrationDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} năm
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Blockchain Confirm Modal */}
      {/* <BlockchainConfirmModal
        isOpen={isBlockchainModalOpen}
        onClose={() => setBlockchainModalOpen(false)}
        onConfirm={() => {
          toast.success('Đã lưu thông tin phương tiện vào Blockchain thành công!');
          setBlockchainModalOpen(false);
        }}
        vehicle={vehicle}
      /> */}
    </div>
  );
}