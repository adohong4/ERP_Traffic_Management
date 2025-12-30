import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { VehicleRegistration } from '@/types'; // Dùng type từ backend
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import { toast } from 'sonner';

interface VehicleAddEditProps {
  vehicle?: VehicleRegistration;
  onBack: () => void;
  onSave: (data: Partial<VehicleRegistration>) => Promise<void>;
}

export default function VehicleAddEdit({ vehicle, onBack, onSave }: VehicleAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!vehicle;

  const [formData, setFormData] = useState<Partial<VehicleRegistration>>({
    vehicle_no: vehicle?.vehicle_no || '',
    owner_name: vehicle?.owner_name || '',
    type_vehicle: vehicle?.type_vehicle || 'Ô tô con',
    brand: vehicle?.brand || '',
    color_vehicle: vehicle?.color_vehicle || '',
    issuer: vehicle?.issuer || 'Hà Nội',
    issue_date: vehicle?.issue_date || new Date().toISOString().split('T')[0],
    expiry_date: vehicle?.expiry_date || '',
    registration_date: vehicle?.registration_date || '',
    seats: vehicle?.seats || undefined,
    chassis_no: vehicle?.chassis_no || '',
    engine_no: vehicle?.engine_no || '',
    color_plate: vehicle?.color_plate || '',
    registration_place: vehicle?.registration_place || '',
    status: vehicle?.status || 'Còn hiệu lực',
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Phương tiện', onClick: onBack },
      ...(isEdit
        ? [
          { label: vehicle!.vehicle_no, onClick: () => { } },
          { label: 'Chỉnh sửa' }
        ]
        : [{ label: 'Thêm phương tiện mới' }])
    ]);

    return () => resetBreadcrumbs();
  }, [isEdit, vehicle, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const handleChange = (field: keyof Partial<VehicleRegistration>, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (err) {
      toast.error(isEdit ? 'Cập nhật thất bại' : 'Thêm mới thất bại');
    }
  };

  return (
    <div className="space-y-6">
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
              {isEdit ? `Cập nhật thông tin phương tiện ${vehicle?.vehicle_no}` : 'Đăng ký phương tiện mới'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin phương tiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_no">Biển số xe *</Label>
                      <Input
                        id="vehicle_no"
                        value={formData.vehicle_no || ''}
                        onChange={(e) => handleChange('vehicle_no', e.target.value)}
                        placeholder="VD: 59A1-12345"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type_vehicle">Loại xe *</Label>
                      <Select
                        value={formData.type_vehicle}
                        onValueChange={(value: any) => handleChange('type_vehicle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Ô tô con', 'Xe máy', 'Ô tô tải', 'Xe khách', 'Xe đầu kéo'].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="owner_name">Chủ sở hữu *</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name || ''}
                        onChange={(e) => handleChange('owner_name', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Hãng xe *</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value: any) => handleChange('brand', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Toyota', 'Honda', 'Ford', 'Mazda', 'Hyundai', 'KIA', 'VinFast', 'Mercedes', 'BMW'].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="color_vehicle">Màu xe</Label>
                      <Select
                        value={formData.color_vehicle}
                        onValueChange={(value: any) => handleChange('color_vehicle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Trắng', 'Đen', 'Bạc', 'Xám', 'Đỏ', 'Xanh'].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seats">Số chỗ ngồi</Label>
                      <Input
                        id="seats"
                        type="number"
                        value={formData.seats || ''}
                        onChange={(e) => handleChange('seats', parseInt(e.target.value) || undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuer">Nơi cấp (Thành phố)</Label>
                      <Input
                        id="issuer"
                        value={formData.issuer || ''}
                        onChange={(e) => handleChange('issuer', e.target.value)}
                        placeholder="Hà Nội"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issue_date">Ngày đăng ký *</Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => handleChange('issue_date', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="registration_date">Ngày đăng kiểm</Label>
                      <Input
                        id="registration_date"
                        type="date"
                        value={formData.registration_date || ''}
                        onChange={(e) => handleChange('registration_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry_date">Hạn đăng kiểm</Label>
                      <Input
                        id="expiry_date"
                        type="date"
                        value={formData.expiry_date || ''}
                        onChange={(e) => handleChange('expiry_date', e.target.value || undefined)}
                      />
                    </div>
                  </div>

                  {/* {isEdit && ( */}
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
                  {/* )} */}
                </CardContent>
              </Card>
            </div>

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
                    Hủy bỏ
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