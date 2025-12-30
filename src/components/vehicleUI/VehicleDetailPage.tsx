import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  FileText,
  Download,
  Printer,
  AlertTriangle,
  Blocks,
  Shield,
} from 'lucide-react';
import { VehicleRegistration } from '@/types'; // Dùng type thực từ backend
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import { toast } from 'sonner';
import vehicleService from '@/services/vehicleService';
import BlockchainConfirmModal from '@/components/BlockchainConfirmModal';

const statusConfig: Record<string, { label: string; color: string }> = {
  'hợp lệ': { label: 'Hợp lệ', color: 'bg-green-500' },
  'hết hạn': { label: 'Hết hạn', color: 'bg-red-500' },
  'chờ đăng kiểm': { label: 'Chờ đăng kiểm', color: 'bg-yellow-500' },
  'còn hiệu lực': { label: 'Còn hiệu lực', color: 'bg-green-500' },
  'bị thu hồi': { label: 'Bị thu hồi', color: 'bg-red-700' },
};

interface VehicleDetailPageProps {
  vehicle: VehicleRegistration;
  onBack: () => void;
  onEdit: () => void;
}

export default function VehicleDetailPage({ vehicle, onBack, onEdit }: VehicleDetailPageProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const [isBlockchainModalOpen, setBlockchainModalOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Phương tiện', onClick: onBack },
      { label: vehicle.vehicle_no },
    ]);

    return () => resetBreadcrumbs();
  }, [vehicle.vehicle_no, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    highlight = false,
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
  }) => (
    <div className="flex items-start gap-4 py-3">
      <div className="flex items-center gap-2 min-w-[180px] text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className={`flex-1 ${highlight ? 'font-medium text-lg' : ''}`}>
        {value}
      </div>
    </div>
  );

  const handleBlockchainConfirm = async (txHash: string) => {
    try {
      await vehicleService.confirmVehicleOnBlockchain(vehicle.id, txHash);
      toast.success('Đã lưu thông tin phương tiện vào Blockchain thành công!');
      setBlockchainModalOpen(false);
      // Có thể refetch vehicle để cập nhật UI nếu cần
    } catch (err) {
      toast.error('Lưu vào Blockchain thất bại');
    }
  };

  // Tính số ngày còn lại đến hạn đăng kiểm
  const getDaysUntilExpiry = () => {
    if (!vehicle.expiry_date) return null;
    const expiry = new Date(vehicle.expiry_date);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiry();

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
              Thông tin chi tiết phương tiện <span className="font-semibold">{vehicle.vehicle_no}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {vehicle.on_blockchain ? (
            <Button variant="outline" size="sm" disabled>
              <Shield className="mr-2 h-4 w-4" />
              Đã lưu trữ Blockchain
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setBlockchainModalOpen(true)}>
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
              <InfoRow icon={Car} label="Biển số xe" value={vehicle.vehicle_no} highlight />
              <Separator />
              <InfoRow icon={User} label="Chủ sở hữu" value={vehicle.owner_name} />
              <Separator />
              <InfoRow icon={Car} label="Loại xe" value={vehicle.type_vehicle} />
              <Separator />
              <InfoRow icon={FileText} label="Hãng xe" value={vehicle.brand} />
              <Separator />
              <InfoRow icon={FileText} label="Màu xe" value={vehicle.color_vehicle} />
              <Separator />
              <InfoRow icon={MapPin} label="Nơi cấp" value={vehicle.issuer} />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Ngày cấp đăng ký"
                value={new Date(vehicle.issue_date).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Hạn đăng kiểm"
                value={
                  vehicle.expiry_date
                    ? new Date(vehicle.expiry_date).toLocaleDateString('vi-VN')
                    : 'Chưa có thông tin'
                }
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Trạng thái"
                value={
                  <Badge
                    className={
                      statusConfig[vehicle.status.toLowerCase()]?.color || 'bg-gray-500'
                    }
                  >
                    {statusConfig[vehicle.status.toLowerCase()]?.label || vehicle.status}
                  </Badge>
                }
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Nơi đăng kiểm"
                value={vehicle.registration_place || '—'}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Thao tác */}
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
              {daysUntilExpiry !== null && daysUntilExpiry < 0 && (
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

          {/* Trạng thái hiện tại */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${statusConfig[vehicle.status.toLowerCase()]?.color || 'bg-gray-500'
                      }`}
                  ></div>
                  <div>
                    <p className="font-medium">
                      {statusConfig[vehicle.status.toLowerCase()]?.label || vehicle.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {daysUntilExpiry === null
                        ? 'Chưa có hạn đăng kiểm'
                        : daysUntilExpiry > 0
                          ? `Còn ${daysUntilExpiry} ngày đến hạn`
                          : `Đã hết hạn ${Math.abs(daysUntilExpiry!)} ngày`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thống kê nhanh */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Thời gian đến kỳ đăng kiểm</p>
                <p className="text-xl">
                  {daysUntilExpiry === null
                    ? '—'
                    : daysUntilExpiry > 0
                      ? `${daysUntilExpiry} ngày`
                      : 'Đã hết hạn'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Tuổi xe (tính từ ngày cấp)</p>
                <p className="text-xl">
                  {Math.floor(
                    (new Date().getTime() - new Date(vehicle.issue_date).getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                  )}{' '}
                  năm
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Blockchain Confirm Modal */}
      <BlockchainConfirmModal
        open={isBlockchainModalOpen}
        onClose={() => setBlockchainModalOpen(false)}
        onConfirm={handleBlockchainConfirm}
        type="vehicle"
        data={{
          id: vehicle.id,
          number: vehicle.vehicle_no,
          name: vehicle.owner_name,
        }}
      />
    </div>
  );
}