import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, X } from 'lucide-react';
import { TrafficAuthority } from '@/lib/mockData';
import { useBreadcrumb } from '@/components/BreadcrumbContext';

interface AuthorityAddEditProps {
  authority?: TrafficAuthority;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function AuthorityAddEdit({ authority, onBack, onSave }: AuthorityAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!authority;

  const [formData, setFormData] = useState({
    name: authority?.name || '',
    code: authority?.code || '',
    type: authority?.type || 'police_department',
    address: authority?.address || '',
    city: authority?.city || 'Hà Nội',
    director: authority?.director || '',
    phone: authority?.phone || '',
    email: authority?.email || '',
    employees: authority?.employees?.toString() || '0',
    status: authority?.status || 'active',
    establishedDate: authority?.establishedDate || ''
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Cơ quan giao thông', onClick: onBack },
      ...(isEdit
        ? [
          { label: authority.name, onClick: () => { } },
          { label: 'Chỉnh sửa' }
        ]
        : [{ label: 'Thêm cơ quan mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, authority, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      employees: parseInt(formData.employees)
    });
  };

  const authorityTypes = [
    { value: 'police_department', label: 'Phòng CSGT' },
    { value: 'inspection_center', label: 'Trung tâm đăng kiểm' },
    { value: 'exam_center', label: 'Trung tâm sát hạch' },
    { value: 'registration_office', label: 'Phòng đăng ký xe' }
  ];

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
            <h2 className="text-3xl">{isEdit ? 'Chỉnh sửa cơ quan giao thông' : 'Thêm cơ quan giao thông mới'}</h2>
            <p className="text-muted-foreground mt-1">
              {isEdit ? `Cập nhật thông tin cơ quan ${authority.name}` : 'Đăng ký cơ quan giao thông mới'}
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
                  <CardTitle>Thông tin cơ quan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên cơ quan *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="VD: Phòng CSGT Hà Nội"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Mã cơ quan *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="VD: PD-HN-001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Loại cơ quan *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => handleChange('type', value)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {authorityTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ đầy đủ"
                      required
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="director">Giám đốc/Trưởng phòng *</Label>
                      <Input
                        id="director"
                        value={formData.director}
                        onChange={(e) => handleChange('director', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employees">Số nhân viên *</Label>
                      <Input
                        id="employees"
                        type="number"
                        min="0"
                        value={formData.employees}
                        onChange={(e) => handleChange('employees', e.target.value)}
                        placeholder="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="0243xxxxxxx"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@conganbonganh.gov.vn"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="establishedDate">Ngày thành lập *</Label>
                      <Input
                        id="establishedDate"
                        type="date"
                        value={formData.establishedDate}
                        onChange={(e) => handleChange('establishedDate', e.target.value)}
                        required
                      />
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
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
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
                  <p>• Mã cơ quan phải là duy nhất</p>
                  <p>• Email phải có đuôi @conganbonganh.gov.vn</p>
                  <p>• Số điện thoại phải là số hợp lệ</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
