import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { License } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';

interface LicenseAddEditProps {
  license?: License;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function LicenseAddEdit({ license, onBack, onSave }: LicenseAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!license;

  const [formData, setFormData] = useState({
    licenseNumber: license?.licenseNumber || '',
    holderName: license?.holderName || '',
    idCard: license?.idCard || '',
    licenseType: license?.licenseType || 'B2',
    city: license?.city || 'Hà Nội',
    issuePlace: license?.issuePlace || '',
    issueDate: license?.issueDate || '',
    expiryDate: license?.expiryDate || '',
    status: license?.status || 'active'
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Quản lý GPLX', onClick: onBack },
      ...(isEdit 
        ? [
            { label: license.licenseNumber, onClick: () => {} },
            { label: 'Chỉnh sửa' }
          ]
        : [{ label: 'Thêm GPLX mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, license, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const handleChange = (field: string, value: string) => {
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
              {isEdit ? `Cập nhật thông tin GPLX ${license.licenseNumber}` : 'Cấp giấy phép lái xe mới'}
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
                      <Label htmlFor="licenseNumber">Số GPLX *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleChange('licenseNumber', e.target.value)}
                        placeholder="VD: B2-HN-123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseType">Hạng GPLX *</Label>
                      <Select 
                        value={formData.licenseType} 
                        onValueChange={(value) => handleChange('licenseType', value)}
                      >
                        <SelectTrigger id="licenseType">
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
                      <Label htmlFor="holderName">Họ và tên *</Label>
                      <Input
                        id="holderName"
                        value={formData.holderName}
                        onChange={(e) => handleChange('holderName', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idCard">CCCD/CMND *</Label>
                      <Input
                        id="idCard"
                        value={formData.idCard}
                        onChange={(e) => handleChange('idCard', e.target.value)}
                        placeholder="001012345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố *</Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => handleChange('city', value)}
                      >
                        <SelectTrigger id="city">
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
                      <Label htmlFor="issuePlace">Nơi cấp *</Label>
                      <Input
                        id="issuePlace"
                        value={formData.issuePlace}
                        onChange={(e) => handleChange('issuePlace', e.target.value)}
                        placeholder="Phòng CSGT Hà Nội"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Ngày cấp *</Label>
                      <Input
                        id="issueDate"
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => handleChange('issueDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleChange('expiryDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {isEdit && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleChange('status', value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Đang hiệu lực</SelectItem>
                          <SelectItem value="expired">Hết hạn</SelectItem>
                          <SelectItem value="suspended">Tạm dừng</SelectItem>
                          <SelectItem value="revoked">Thu hồi</SelectItem>
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
