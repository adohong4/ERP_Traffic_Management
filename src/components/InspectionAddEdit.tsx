import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { InspectionCertificate } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';

interface InspectionAddEditProps {
  certificate?: InspectionCertificate;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function InspectionAddEdit({ certificate, onBack, onSave }: InspectionAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!certificate;

  const [formData, setFormData] = useState({
    certificateNumber: certificate?.certificateNumber || '',
    plateNumber: certificate?.plateNumber || '',
    owner: certificate?.owner || '',
    vehicleType: certificate?.vehicleType || 'Ô tô con',
    city: certificate?.city || 'Hà Nội',
    inspectionCenter: certificate?.inspectionCenter || '',
    technician: certificate?.technician || '',
    issueDate: certificate?.issueDate || '',
    expiryDate: certificate?.expiryDate || '',
    status: certificate?.status || 'valid'
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Giấy tờ xe', onClick: onBack },
      ...(isEdit 
        ? [
            { label: certificate.certificateNumber, onClick: () => {} },
            { label: 'Chỉnh sửa' }
          ]
        : [{ label: 'Thêm giấy đăng kiểm mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, certificate, onBack, setBreadcrumbs, resetBreadcrumbs]);

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
            <h2 className="text-3xl">{isEdit ? 'Chỉnh sửa giấy đăng kiểm' : 'Thêm giấy đăng kiểm mới'}</h2>
            <p className="text-muted-foreground mt-1">
              {isEdit ? `Cập nhật thông tin giấy đăng kiểm ${certificate.certificateNumber}` : 'Cấp giấy đăng kiểm mới'}
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
                  <CardTitle>Thông tin giấy đăng kiểm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="certificateNumber">Số giấy đăng kiểm *</Label>
                      <Input
                        id="certificateNumber"
                        value={formData.certificateNumber}
                        onChange={(e) => handleChange('certificateNumber', e.target.value)}
                        placeholder="VD: DK-HN-123456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plateNumber">Biển số xe *</Label>
                      <Input
                        id="plateNumber"
                        value={formData.plateNumber}
                        onChange={(e) => handleChange('plateNumber', e.target.value)}
                        placeholder="VD: 30A-12345"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="owner">Chủ sở hữu *</Label>
                      <Input
                        id="owner"
                        value={formData.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Loại xe *</Label>
                      <Select 
                        value={formData.vehicleType} 
                        onValueChange={(value) => handleChange('vehicleType', value)}
                      >
                        <SelectTrigger id="vehicleType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Ô tô con', 'Xe máy', 'Ô tô tải', 'Xe khách', 'Xe đầu kéo'].map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="inspectionCenter">Trung tâm đăng kiểm *</Label>
                      <Input
                        id="inspectionCenter"
                        value={formData.inspectionCenter}
                        onChange={(e) => handleChange('inspectionCenter', e.target.value)}
                        placeholder="Trung tâm đăng kiểm Hà Nội"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technician">Kỹ thuật viên *</Label>
                    <Input
                      id="technician"
                      value={formData.technician}
                      onChange={(e) => handleChange('technician', e.target.value)}
                      placeholder="Nguyễn Văn B"
                      required
                    />
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
                          <SelectItem value="valid">Còn hiệu lực</SelectItem>
                          <SelectItem value="expired">Hết hạn</SelectItem>
                          <SelectItem value="pending">Đang xử lý</SelectItem>
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
                  <p>• Số giấy đăng kiểm phải theo định dạng chuẩn</p>
                  <p>• Ngày hết hạn phải sau ngày cấp</p>
                  <p>• Biển số xe phải đã được đăng ký</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
