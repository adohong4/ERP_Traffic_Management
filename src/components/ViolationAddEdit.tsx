import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Save, X, Upload, AlertCircle } from 'lucide-react';
import { Violation } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ViolationAddEditProps {
  violation?: Violation;
  onBack: () => void;
  onSave: (data: any) => void;
}

const violationTypes = [
  'Vượt đèn đỏ',
  'Vượt quá tốc độ',
  'Không đội mũ bảo hiểm',
  'Không có GPLX',
  'Nồng độ cồn',
  'Đi sai làn đường',
  'Dừng đỗ sai quy định',
  'Không thắt dây an toàn',
  'Sử dụng điện thoại khi lái xe',
  'Vi phạm khác'
];

const cities = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nghệ An',
  'Thanh Hóa',
  'Bình Dương',
  'Đồng Nai'
];

export default function ViolationAddEdit({ violation, onBack, onSave }: ViolationAddEditProps) {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const isEdit = !!violation;

  const [formData, setFormData] = useState({
    violatorName: violation?.violatorName || '',
    licenseNumber: violation?.licenseNumber || '',
    plateNumber: violation?.plateNumber || '',
    violationType: violation?.violationType || 'Vượt đèn đỏ',
    location: violation?.location || '',
    city: violation?.city || 'Hà Nội',
    date: violation?.date || new Date().toISOString().slice(0, 16),
    fine: violation?.fine || 0,
    points: violation?.points || 0,
    officer: violation?.officer || '',
    description: violation?.description || '',
    status: violation?.status || 'pending'
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>(violation?.images || []);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Trang chính', onClick: onBack, isHome: true },
      { label: 'Quản lý vi phạm', onClick: onBack },
      ...(isEdit 
        ? [
            { label: violation.id, onClick: () => {} },
            { label: 'Chỉnh sửa' }
          ]
        : [{ label: 'Ghi nhận vi phạm mới' }]
      )
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [isEdit, violation, onBack, setBreadcrumbs, resetBreadcrumbs]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate upload - in real app, upload to server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      images: uploadedImages
    });
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
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-cyan-50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {/* Title removed - already in breadcrumb */}
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
            <div className="md:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle>Thông tin người vi phạm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="violatorName">Họ và tên *</Label>
                      <Input
                        id="violatorName"
                        value={formData.violatorName}
                        onChange={(e) => handleChange('violatorName', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Số GPLX *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleChange('licenseNumber', e.target.value)}
                        placeholder="012345678"
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plateNumber">Biển số xe *</Label>
                      <Input
                        id="plateNumber"
                        value={formData.plateNumber}
                        onChange={(e) => handleChange('plateNumber', e.target.value)}
                        placeholder="30A-12345"
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="officer">Cán bộ xử lý *</Label>
                      <Input
                        id="officer"
                        value={formData.officer}
                        onChange={(e) => handleChange('officer', e.target.value)}
                        placeholder="Trần Văn B"
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle>Thông tin vi phạm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="violationType">Loại vi phạm *</Label>
                      <Select
                        value={formData.violationType}
                        onValueChange={(value) => handleChange('violationType', value)}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {violationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày giờ vi phạm *</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Địa điểm *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Đường Láng"
                        required
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleChange('city', value)}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fine">Mức phạt (VNĐ) *</Label>
                      <Input
                        id="fine"
                        type="number"
                        value={formData.fine}
                        onChange={(e) => handleChange('fine', parseInt(e.target.value) || 0)}
                        placeholder="1000000"
                        required
                        min="0"
                        step="100000"
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points">Số điểm trừ *</Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                        placeholder="2"
                        required
                        min="0"
                        max="12"
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả chi tiết</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Mô tả chi tiết về hành vi vi phạm..."
                      rows={4}
                      className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images Upload */}
              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle>Hình ảnh vi phạm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Tải lên hình ảnh</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                      <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <ImageWithFallback
                            src={image}
                            alt={`Vi phạm ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg border-2 border-gray-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle>Trạng thái</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái xử lý</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                        <SelectItem value="overdue">Quá hạn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-yellow-900">Lưu ý quan trọng</p>
                        <p className="text-xs text-yellow-700">
                          Đảm bảo thông tin chính xác và đầy đủ trước khi lưu biên bản vi phạm.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
                <CardHeader>
                  <CardTitle>Thao tác</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? 'Cập nhật' : 'Lưu biên bản'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onBack}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}