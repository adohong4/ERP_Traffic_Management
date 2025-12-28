import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Database, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BlockchainConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (txHash: string) => Promise<void>;
  title?: string;
  type?: 'license' | 'vehicle';
  data: {
    id: string;
    name?: string;
    number?: string;
  };
}

export default function BlockchainConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  type = 'license',
  data,
}: BlockchainConfirmModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleConfirm = async () => {
    if (!txHash) {
      toast.error('Vui lòng nhập Transaction Hash');
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(txHash);

      toast.success('Lưu trữ vào Blockchain thành công!', {
        description: `${type === 'license' ? 'GPLX' : 'Phương tiện'} đã được lưu trữ an toàn trên Blockchain`,
      });

      onClose();
    } catch (error: any) {
      toast.error('Lỗi khi lưu trữ vào Blockchain', {
        description: error?.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {title || 'Lưu trữ vào Blockchain'}
              </DialogTitle>
              <DialogDescription>
                Xác nhận lưu trữ dữ liệu lên Blockchain
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Loại:</span>{' '}
                {type === 'license' ? 'Giấy phép lái xe' : 'Phương tiện'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Số:</span>{' '}
                {data.number || data.id}
              </p>
              {data.name && (
                <p className="text-sm">
                  <span className="font-medium">Tên:</span> {data.name}
                </p>
              )}
            </div>
          </div>

          {/* TxHash Input */}
          <div className="space-y-2">
            <Label htmlFor="txHash">Transaction Hash *</Label>
            <Input
              id="txHash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Nhập transaction hash sau khi lưu blockchain"
              required
            />
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-amber-900">
              <p className="font-medium">Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Dữ liệu sau khi lưu lên Blockchain sẽ KHÔNG THỂ XÓA</li>
                <li>Thông tin sẽ được mã hóa và lưu trữ vĩnh viễn</li>
                <li>Hành động này tốn phí gas fee</li>
              </ul>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex gap-2 items-start mb-2">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="font-medium text-sm text-green-900">Lợi ích:</p>
            </div>
            <ul className="space-y-1 text-xs text-green-800 ml-7">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                Bảo mật tuyệt đối, không thể giả mạo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                Minh bạch, có thể tra cứu mọi lúc
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                Lưu trữ vĩnh viễn, không bị mất dữ liệu
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Xác nhận lưu trữ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}