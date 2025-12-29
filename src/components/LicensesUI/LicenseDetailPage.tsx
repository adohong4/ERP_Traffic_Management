import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  MapPin,
  User,
  CreditCard,
  AlertTriangle,
  Ban,
  RefreshCw,
  Download,
  Printer,
  Blocks,
  Shield
} from 'lucide-react';
import { useBreadcrumb } from '../BreadcrumbContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import BlockchainConfirmModal from '@/components/BlockchainConfirmModal';
import licenseService from '@/services/licenseService';
import type { DriverLicense } from '@/types';

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-blue-500' },
  active: { label: 'Hoạt động', color: 'bg-green-500' },
  expired: { label: 'Hết hạn', color: 'bg-gray-500' },
  pause: { label: 'Tạm dừng', color: 'bg-yellow-500' },
  revoke: { label: 'Thu hồi', color: 'bg-red-500' }
};

interface LicenseDetailPageProps {
  license: DriverLicense;
  onBack: () => void;
  onEdit: () => void;
}

export default function LicenseDetailPage({ license, onBack, onEdit }: LicenseDetailPageProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);

  useEffect(() => {
    // Set breadcrumbs
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Quản lý GPLX', onClick: onBack },
      { label: license.license_no }
    ]);

    // TODO: Fetch related violations if API available
    // Example:
    // const fetchViolations = async () => {
    //   try {
    //     const violations = await licenseService.getViolationsByLicense(license.license_no);
    //     setRelatedViolations(violations);
    //   } catch (err) {
    //     toast.error('Lỗi khi tải lịch sử vi phạm');
    //   }
    // };
    // fetchViolations();

    return () => {
      resetBreadcrumbs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [license.license_no]);

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

  const handleConfirmBlockchain = async (txHash: string) => {
    try {
      await licenseService.confirmBlockchainStorage(license.id, txHash);
      toast.success('Đã lưu vào blockchain');
      // Refresh license data
      const updatedLicense = await licenseService.getLicenseById(license.id);
      // Update parent state if needed, but since props, perhaps reload
    } catch (err) {
      toast.error('Lỗi khi lưu vào blockchain');
    }
  };

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
            <h2 className="text-3xl">Chi tiết GPLX</h2>
            <p className="text-muted-foreground mt-1">
              Thông tin chi tiết giấy phép lái xe {license.license_no}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {license.on_blockchain ? (
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
              onClick={() => setShowBlockchainModal(true)}
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
                <FileText className="h-5 w-5" />
                Thông tin GPLX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow
                icon={FileText}
                label="Số GPLX"
                value={license.license_no}
                highlight
              />
              <Separator />
              <InfoRow
                icon={User}
                label="Người sở hữu"
                value={license.full_name}
              />
              <Separator />
              <InfoRow
                icon={CreditCard}
                label="CCCD/CMND"
                value={license.identity_no}
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Hạng GPLX"
                value={<Badge variant="outline" className="text-base">{license.license_type}</Badge>}
              />
              <Separator />
              <InfoRow
                icon={MapPin}
                label="Nơi cấp"
                value={license.issuing_authority}
              />
              <Separator />
              <InfoRow
                icon={MapPin}
                label="Thành phố"
                value={license.owner_city}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Ngày cấp"
                value={new Date(license.issue_date).toLocaleDateString('vi-VN')}
              />
              <Separator />
              <InfoRow
                icon={Calendar}
                label="Ngày hết hạn"
                value={license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
              />
              <Separator />
              <InfoRow
                icon={AlertTriangle}
                label="Điểm còn lại"
                value={
                  <Badge variant={license.point <= 5 ? 'destructive' : 'secondary'}>
                    {license.point} điểm
                  </Badge>
                }
              />
              <Separator />
              <InfoRow
                icon={FileText}
                label="Trạng thái"
                value={
                  <Badge className={statusConfig[license.status].color}>
                    {statusConfig[license.status].label}
                  </Badge>
                }
              />
            </CardContent>
          </Card>

          {/* Related Violations - Placeholder, assume fetch if API available */}
          {/* {relatedViolations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Lịch sử vi phạm ({relatedViolations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày vi phạm</TableHead>
                      <TableHead>Loại vi phạm</TableHead>
                      <TableHead>Địa điểm</TableHead>
                      <TableHead>Phạt tiền</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedViolations.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{new Date(v.date).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{v.violationType}</TableCell>
                        <TableCell>{v.location}</TableCell>
                        <TableCell>{v.fine.toLocaleString('vi-VN')} đ</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{v.points}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={v.status === 'paid' ? 'default' : v.status === 'overdue' ? 'destructive' : 'secondary'}>
                            {v.status === 'paid' ? 'Đã nộp' : v.status === 'overdue' ? 'Quá hạn' : 'Chưa nộp'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )} */}
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
                <RefreshCw className="mr-2 h-4 w-4" />
                Đổi GPLX
              </Button>
              {license.status === 'active' && (
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Tạm dừng GPLX
                </Button>
              )}
              {license.status === 'active' && (
                <Button className="w-full justify-start text-red-600" variant="outline">
                  <Ban className="mr-2 h-4 w-4" />
                  Thu hồi GPLX
                </Button>
              )}
              <Separator className="my-4" />
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Tải bản sao
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                In GPLX
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
                  <div className={`h-3 w-3 rounded-full ${statusConfig[license.status].color}`}></div>
                  <div>
                    <p className="font-medium">{statusConfig[license.status].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {license.status === 'active'
                        ? `Còn hiệu lực đến ${license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : 'Vô thời hạn'}`
                        : license.status === 'expired'
                          ? `Đã hết hạn từ ${license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : 'Vô thời hạn'}`
                          : license.status === 'pause'
                            ? 'GPLX đang bị tạm dừng'
                            : 'GPLX đã bị thu hồi'}
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
                  {license.expiry_date ? licenseService.getDaysUntilExpiry(license) : 'Vô thời hạn'} ngày
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Điểm còn lại</p>
                <p className="text-xl text-red-600">{license.point} điểm</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian sở hữu</p>
                <p className="text-xl">
                  {Math.floor((new Date().getTime() - new Date(license.issue_date).getTime()) / (1000 * 60 * 60 * 24 * 365))} năm
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Blockchain Confirm Modal */}
      <BlockchainConfirmModal
        open={showBlockchainModal}
        onClose={() => setShowBlockchainModal(false)}
        onConfirm={handleConfirmBlockchain}
        type="license"
        data={{
          id: license.id,
          name: license.full_name,
          number: license.license_no
        }}
      />
    </div>
  );
}