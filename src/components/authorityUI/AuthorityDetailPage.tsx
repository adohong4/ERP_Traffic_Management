import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Building2,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Users,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { TrafficAuthority } from '@/lib/mockData';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import WalletAddressManager from '@/components/WalletAddressManager';

const statusConfig = {
  active: { label: 'Hoạt động', color: 'bg-green-500' },
  inactive: { label: 'Ngưng hoạt động', color: 'bg-gray-500' }
};

const authorityTypeLabels: Record<string, string> = {
  police_department: 'Phòng CSGT',
  inspection_center: 'Trung tâm đăng kiểm',
  exam_center: 'Trung tâm sát hạch',
  registration_office: 'Phòng đăng ký xe'
};

interface AuthorityDetailPageProps {
  authority: TrafficAuthority;
  onBack: () => void;
  onEdit: () => void;
}

export default function AuthorityDetailPage({ authority, onBack, onEdit }: AuthorityDetailPageProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Cơ quan giao thông', onClick: onBack },
      { label: authority.name }
    ]);

    return () => {
      resetBreadcrumbs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authority.name]);

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
            <h2 className="text-3xl">Chi tiết cơ quan giao thông</h2>
            <p className="text-muted-foreground mt-1">
              Thông tin chi tiết cơ quan {authority.name}
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
                <Building2 className="h-5 w-5" />
                Thông tin cơ quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow
                icon={Building2}
                label="Tên cơ quan"
                value={authority.name}
                highlight
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Mã cơ quan"
                value={<code className="text-sm bg-muted px-2 py-1 rounded">{authority.code}</code>}
              />
              <Separator />
              <InfoRow
                icon={Building2}
                label="Loại hình"
                value={<Badge variant="outline">{authorityTypeLabels[authority.type]}</Badge>}
              />
              <Separator />
              <InfoRow
                icon={MapPin}
                label="Địa chỉ"
                value={authority.address}
              />
              <Separator />
              <InfoRow
                icon={MapPin}
                label="Thành phố"
                value={authority.city}
              />
              <Separator />
              <InfoRow
                icon={User}
                label="Giám đốc/Trưởng phòng"
                value={authority.director}
              />
              <Separator />
              <InfoRow
                icon={Users}
                label="Số nhân viên"
                value={<Badge className="bg-purple-100 text-purple-700">{authority.employees}</Badge>}
              />
              <Separator />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={authority.phone}
              />
              <Separator />
              <InfoRow
                icon={Mail}
                label="Email"
                value={authority.email}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Ngày thành lập"
                value={new Date(authority.establishedDate).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Trạng thái"
                value={
                  <Badge className={statusConfig[authority.status].color}>
                    {statusConfig[authority.status].label}
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
              {authority.status === 'inactive' && (
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Kích hoạt lại
                </Button>
              )}
              {authority.status === 'active' && (
                <Button className="w-full justify-start text-red-600" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Tạm ngưng hoạt động
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
                  <div className={`h-3 w-3 rounded-full ${statusConfig[authority.status].color}`}></div>
                  <div>
                    <p className="font-medium">{statusConfig[authority.status].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {authority.status === 'active'
                        ? 'Cơ quan đang hoạt động bình thường'
                        : 'Cơ quan tạm ngưng hoạt động'}
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
                <p className="text-sm text-muted-foreground">Số nhân viên</p>
                <p className="text-xl">{authority.employees} người</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian hoạt động</p>
                <p className="text-xl">
                  {Math.floor((new Date().getTime() - new Date(authority.establishedDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} năm
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Loại hình</p>
                <p className="text-base">{authorityTypeLabels[authority.type]}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Wallet Address Manager Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WalletAddressManager
          walletAddresses={authority.walletAddresses}
          authorityName={authority.name}
          onChange={(addresses) => {
            console.log('Updated addresses:', addresses);
            // In real app, save to backend/blockchain
          }}
        />
      </motion.div>
    </div>
  );
}
