import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Vehicle } from '@/lib/mockData';
import { useBreadcrumb } from '@/components/BreadcrumbContext';

interface VehicleAddEditProps {
  vehicle?: Vehicle;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function VehicleAddEdit({ vehicle, onBack, onSave }: VehicleAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!vehicle;

  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    owner: vehicle?.owner || '',
    ownerPhone: vehicle?.ownerPhone || '',
    vehicleType: vehicle?.vehicleType || 'Ô tô con',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    color: vehicle?.color || '',
    city: vehicle?.city || 'Hà Nội',
    registrationDate: vehicle?.registrationDate || '',
    lastInspection: vehicle?.lastInspection || '',
    nextInspection: vehicle?.nextInspection || '',
    status: vehicle?.status || 'valid'
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Phương tiện', onClick: onBack },
      ...(isEdit
        ? [
          { label: vehicle.plateNumber, onClick: () => { } },
          { label: 'Chỉnh sửa' }
        ]
        : [{ label: 'Thêm phương tiện mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, vehicle, onBack, setBreadcrumbs, resetBreadcrumbs]);

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
            <h2 className="text-3xl">{isEdit ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}</h2>
            <p className="text-muted-foreground mt-1">
              {isEdit ? `Cập nhật thông tin phương tiện ${vehicle.plateNumber}` : 'Đăng ký phương tiện mới'}
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
                  <CardTitle>Thông tin phương tiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Loại xe *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value: any) => handleChange('vehicleType', value)}
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
                      <Label htmlFor="ownerPhone">Số điện thoại *</Label>
                      <Input
                        id="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={(e) => handleChange('ownerPhone', e.target.value)}
                        placeholder="0912345678"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Hãng xe *</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value: any) => handleChange('brand', value)}
                      >
                        <SelectTrigger id="brand">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai', 'KIA', 'Vinfast', 'Mercedes', 'BMW'].map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleChange('model', e.target.value)}
                        placeholder="VD: Vios 2024"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Màu sắc *</Label>
                      <Select
                        value={formData.color}
                        onValueChange={(value: any) => handleChange('color', value)}
                      >
                        <SelectTrigger id="color">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Trắng', 'Đen', 'Bạc', 'Xám', 'Đỏ', 'Xanh'].map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
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
                        onValueChange={(value: any) => handleChange('city', value)}
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
                      <Label htmlFor="registrationDate">Ngày đăng ký *</Label>
                      <Input
                        id="registrationDate"
                        type="date"
                        value={formData.registrationDate}
                        onChange={(e) => handleChange('registrationDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lastInspection">Lần đăng kiểm gần nhất</Label>
                      <Input
                        id="lastInspection"
                        type="date"
                        value={formData.lastInspection}
                        onChange={(e) => handleChange('lastInspection', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextInspection">Đăng kiểm tiếp theo</Label>
                      <Input
                        id="nextInspection"
                        type="date"
                        value={formData.nextInspection}
                        onChange={(e) => handleChange('nextInspection', e.target.value)}
                      />
                    </div>
                  </div>

                  {isEdit && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => handleChange('status', value)}
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
                  <p>• Biển số xe phải theo định dạng chuẩn</p>
                  <p>• Số điện thoại phải là số hợp lệ</p>
                  <p>• Ngày đăng kiểm tiếp theo phải sau ngày đăng kiểm gần nhất</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
