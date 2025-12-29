import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import type { DriverLicense } from '@/types';

interface LicenseAddEditProps {
  license?: DriverLicense;
  onBack: () => void;
  onSave: (data: Partial<DriverLicense>) => void;
}

export default function LicenseAddEdit({ license, onBack, onSave }: LicenseAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!license;

  const [formData, setFormData] = useState<Partial<DriverLicense>>({
    license_no: license?.license_no || '',
    full_name: license?.full_name || '',
    identity_no: license?.identity_no || '',
    license_type: license?.license_type || 'B2',
    owner_city: license?.owner_city || 'Hà Nội',
    issuing_authority: license?.issuing_authority || '',
    issue_date: license?.issue_date || '',
    expiry_date: license?.expiry_date || '',
    status: license?.status || 'active'
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Quản lý GPLX', onClick: onBack },
      ...(isEdit
        ? [
          { label: license.license_no, onClick: () => { } },
          { label: 'Chỉnh sửa' }
        ]
        : [{ label: 'Thêm GPLX mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, license, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const handleChange = (field: keyof DriverLicense, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            <h2 className="text-3xl">{isEdit ? 'Chỉnh sửa GPLX' : 'Thêm GPLX mới'}</h2>
            <p className="text-muted-foreground mt-1">
              {isEdit ? `Cập nhật thông tin GPLX ${license.license_no}` : 'Cấp giấy phép lái xe mới'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin GPLX</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="license_no">Số GPLX *</Label>
                      <Input
                        id="license_no"
                        value={formData.license_no || ''}
                        onChange={(e) => handleChange('license_no', e.target.value)}
                        placeholder="VD: B2-HN-123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_type">Hạng GPLX *</Label>
                      <Select
                        value={formData.license_type || ''}
                        onValueChange={(value: any) => handleChange('license_type', value)}
                      >
                        <SelectTrigger id="license_type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F'].map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Họ và tên *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name || ''}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identity_no">CCCD/CMND *</Label>
                      <Input
                        id="identity_no"
                        value={formData.identity_no || ''}
                        onChange={(e) => handleChange('identity_no', e.target.value)}
                        placeholder="001012345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="owner_city">Thành phố *</Label>
                      <Select
                        value={formData.owner_city || ''}
                        onValueChange={(value: any) => handleChange('owner_city', value)}
                      >
                        <SelectTrigger id="owner_city">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nghệ An', 'Thanh Hóa', 'Bình Dương', 'Đồng Nai'].map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuing_authority">Nơi cấp *</Label>
                      <Input
                        id="issuing_authority"
                        value={formData.issuing_authority || ''}
                        onChange={(e) => handleChange('issuing_authority', e.target.value)}
                        placeholder="Phòng CSGT Hà Nội"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issue_date">Ngày cấp *</Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={formData.issue_date || ''}
                        onChange={(e) => handleChange('issue_date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry_date">Ngày hết hạn *</Label>
                      <Input
                        id="expiry_date"
                        type="date"
                        value={formData.expiry_date || ''}
                        onChange={(e) => handleChange('expiry_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {isEdit && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select
                        value={formData.status || ''}
                        onValueChange={(value: any) => handleChange('status', value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ duyệt</SelectItem>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="expired">Hết hạn</SelectItem>
                          <SelectItem value="pause">Tạm dừng</SelectItem>
                          <SelectItem value="revoke">Thu hồi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lưu ý</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Tất cả các trường đánh dấu (*) là bắt buộc</p>
                  <p>• Số GPLX phải theo định dạng chuẩn</p>
                  <p>• Ngày hết hạn phải sau ngày cấp</p>
                  <p>• CCCD/CMND phải là số hợp lệ</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}