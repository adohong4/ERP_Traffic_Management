import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Shield,
  User,
  Eye,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletAddress {
  address: string;
  role: 'admin' | 'manager' | 'officer' | 'viewer';
  assignedDate: string;
  assignedBy: string;
}

interface WalletAddressManagerProps {
  walletAddresses?: WalletAddress[];
  authorityName: string;
  onChange?: (addresses: WalletAddress[]) => void;
}

const roleConfig = {
  admin: {
    label: 'Quản trị viên',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: Shield,
    description: 'Toàn quyền quản lý và phê duyệt'
  },
  manager: {
    label: 'Quản lý',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Users,
    description: 'Quản lý và xử lý hồ sơ'
  },
  officer: {
    label: 'Cán bộ',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    icon: User,
    description: 'Xử lý hồ sơ cơ bản'
  },
  viewer: {
    label: 'Xem',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Eye,
    description: 'Chỉ xem thông tin'
  }
};

export default function WalletAddressManager({ 
  walletAddresses = [], 
  authorityName,
  onChange 
}: WalletAddressManagerProps) {
  const [addresses, setAddresses] = useState<WalletAddress[]>(walletAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'officer' | 'viewer'>('officer');

  const handleAddAddress = () => {
    // Validate address
    if (!newAddress || !newAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Địa chỉ ví không hợp lệ! Định dạng: 0x + 40 ký tự hex');
      return;
    }

    // Check duplicate
    if (addresses.some(a => a.address.toLowerCase() === newAddress.toLowerCase())) {
      toast.error('Địa chỉ ví này đã tồn tại!');
      return;
    }

    const newWalletAddress: WalletAddress = {
      address: newAddress,
      role: newRole,
      assignedDate: new Date().toISOString().split('T')[0],
      assignedBy: 'Admin User' // In real app, get from auth context
    };

    const updatedAddresses = [...addresses, newWalletAddress];
    setAddresses(updatedAddresses);
    onChange?.(updatedAddresses);

    toast.success(`Đã thêm địa chỉ ví với quyền ${roleConfig[newRole].label}`);
    
    // Reset form
    setNewAddress('');
    setNewRole('officer');
    setIsAddDialogOpen(false);
  };

  const handleRemoveAddress = (address: string) => {
    const updatedAddresses = addresses.filter(a => a.address !== address);
    setAddresses(updatedAddresses);
    onChange?.(updatedAddresses);
    toast.success('Đã xóa địa chỉ ví');
  };

  const handleChangeRole = (address: string, newRole: 'admin' | 'manager' | 'officer' | 'viewer') => {
    const updatedAddresses = addresses.map(a => 
      a.address === address 
        ? { ...a, role: newRole, assignedDate: new Date().toISOString().split('T')[0] }
        : a
    );
    setAddresses(updatedAddresses);
    onChange?.(updatedAddresses);
    toast.success(`Đã cập nhật quyền thành ${roleConfig[newRole].label}`);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép địa chỉ');
  };

  return (
    <Card className="border-cyan-200/50 shadow-lg shadow-cyan-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-cyan-600" />
            Quản lý Wallet Addresses
          </CardTitle>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="h-4 w-4 mr-1" />
                Thêm địa chỉ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Wallet Address mới</DialogTitle>
                <DialogDescription>
                  Thêm địa chỉ ví Ethereum cho {authorityName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Địa chỉ ví *</Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Định dạng: 0x + 40 ký tự hexadecimal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò *</Label>
                  <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{config.label}</div>
                              <div className="text-xs text-muted-foreground">{config.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddAddress} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  Thêm địa chỉ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-4">Chưa có wallet address nào</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm địa chỉ đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((wallet, index) => {
              const RoleIcon = roleConfig[wallet.role].icon;
              return (
                <motion.div
                  key={wallet.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Address & Role Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyToClipboard(wallet.address)}
                                className="font-mono text-sm font-medium hover:text-cyan-600 transition-colors"
                              >
                                {formatAddress(wallet.address)}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click để sao chép: {wallet.address}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <Badge className={`${roleConfig[wallet.role].color} border`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleConfig[wallet.role].label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Gán ngày: {new Date(wallet.assignedDate).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span>Bởi: {wallet.assignedBy}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Select 
                        value={wallet.role} 
                        onValueChange={(value: any) => handleChangeRole(wallet.address, value)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SelectTrigger className="h-8 w-[140px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Thay đổi vai trò</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <SelectContent>
                          {Object.entries(roleConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <config.icon className="h-3 w-3" />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAddress(wallet.address)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xóa địa chỉ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {addresses.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-4 gap-2 text-center">
              {Object.entries(roleConfig).map(([key, config]) => {
                const count = addresses.filter(a => a.role === key).length;
                return (
                  <div key={key} className="space-y-1">
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-muted-foreground">{config.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
