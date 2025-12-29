import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, User, FileText, CreditCard, AlertCircle, CheckCircle, Clock, Download, Image as ImageIcon } from 'lucide-react';
import { Violation } from '@/lib/mockData';
import { ImageWithFallback } from '@/components/image/ImageWithFallback';
import { toast } from 'sonner';

interface ViolationDetailPageProps {
  violation: Violation;
  onBack: () => void;
}

const statusConfig = {
  pending: { label: 'Chưa thanh toán', color: 'bg-yellow-500', icon: Clock },
  paid: { label: 'Đã thanh toán', color: 'bg-green-500', icon: CheckCircle },
  overdue: { label: 'Quá hạn', color: 'bg-red-500', icon: AlertCircle }
};

export default function ViolationDetailPage({ violation, onBack }: ViolationDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const status = statusConfig[violation.status];
  const StatusIcon = status.icon;

  const handlePayment = () => {
    toast.success('Xác nhận thanh toán thành công!');
  };

  const handleDownloadReceipt = () => {
    toast.success('Đang tải xuống biên lai...');
  };

  const handleSendReminder = () => {
    toast.info('Đã gửi thông báo nhắc nhở tới người vi phạm');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex items-start justify-between">
          <div>
            {/* Title removed - already in breadcrumb */}
          </div>
          <Badge className={`${status.color} text-white px-4 py-2`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {status.label}
          </Badge>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle>Thông tin vi phạm</CardTitle>
              <CardDescription>Chi tiết về hành vi vi phạm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Loại vi phạm</p>
                  <p className="font-medium">{violation.violationType}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Số điểm trừ</p>
                  <p className="font-medium text-red-600">{violation.points} điểm</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày vi phạm
                  </p>
                  <p className="font-medium">{violation.date}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa điểm
                  </p>
                  <p className="font-medium">{violation.location}, {violation.city}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cán bộ xử lý
                  </p>
                  <p className="font-medium">{violation.officer}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Mức phạt
                  </p>
                  <p className="font-medium text-red-600 text-lg">
                    {violation.fine.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>

              {violation.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Mô tả chi tiết
                    </p>
                    <p className="text-sm">{violation.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          {violation.images && violation.images.length > 0 && (
            <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Hình ảnh vi phạm ({violation.images.length})
                </CardTitle>
                <CardDescription>Bằng chứng vi phạm được ghi nhận</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {violation.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedImage(image)}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`Vi phạm ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Info */}
          {violation.status === 'paid' && violation.paymentDate && (
            <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-green-200/50 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Ngày thanh toán</p>
                    <p className="font-medium">{violation.paymentDate}</p>
                  </div>
                  {violation.paymentMethod && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phương thức</p>
                      <p className="font-medium">{violation.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Violator Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle>Thông tin người vi phạm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Họ và tên</p>
                <p className="font-medium">{violation.violatorName}</p>
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Số GPLX</p>
                <p className="font-medium font-mono text-blue-600">{violation.licenseNumber}</p>
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Biển số xe</p>
                <p className="font-medium font-mono">{violation.plateNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-0 shadow-lg rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(violation.status === 'pending' || violation.status === 'overdue') && (
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  onClick={handlePayment}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Xác nhận đã nộp phạt
                </Button>
              )}

              {violation.status === 'overdue' && (
                <Button
                  variant="outline"
                  className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
                  onClick={handleSendReminder}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Gửi nhắc nhở
                </Button>
              )}

              {violation.status === 'paid' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải biên lai
                </Button>
              )}

              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Xuất biên bản
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={selectedImage}
              alt="Hình ảnh vi phạm"
              className="w-full h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              Đóng
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}