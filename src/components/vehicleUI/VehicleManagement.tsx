import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Car, Calendar, AlertCircle, CheckCircle, BarChart3, Eye, Edit, Trash2, Plus, TrendingDown, TrendingUp, Database, Shield } from 'lucide-react';
import { vehicles, type Vehicle } from '@/lib/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import VehicleDetailPage from './VehicleDetailPage';
import VehicleAddEdit from './VehicleAddEdit';
import ModernDataTable, { ColumnDef, FilterConfig } from '../ModernDataTable';
import StatCard from '../StatCard';
import { toast } from 'sonner';

const statusConfig = {
  valid: { label: 'Hợp lệ', color: 'bg-green-500', icon: CheckCircle },
  expired: { label: 'Hết hạn', color: 'bg-red-500', icon: AlertCircle },
  pending: { label: 'Chờ đăng kiểm', color: 'bg-yellow-500', icon: Calendar }
};
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function VehicleManagement() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'add' | 'edit'>('list');

  const cities = Array.from(new Set(vehicles.map(v => v.city)));
  const vehicleTypes = Array.from(new Set(vehicles.map(v => v.vehicleType)));
  const brands = Array.from(new Set(vehicles.map(v => v.brand)));

  const getInspectionStatus = (nextInspection: string) => {
    const days = Math.floor((new Date(nextInspection).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Quá hạn', color: 'text-red-600' };
    if (days < 30) return { text: `Còn ${days} ngày`, color: 'text-yellow-600' };
    return { text: `Còn ${days} ngày`, color: 'text-green-600' };
  };

  // Analytics data
  const analyticsData = {
    byStatus: [
      { name: 'Hợp lệ', value: vehicles.filter(v => v.status === 'valid').length },
      { name: 'Hết hạn', value: vehicles.filter(v => v.status === 'expired').length },
      { name: 'Chờ ĐK', value: vehicles.filter(v => v.status === 'pending').length }
    ],
    byType: vehicleTypes.map(type => ({
      type: type.length > 15 ? type.substring(0, 15) : type,
      count: vehicles.filter(v => v.vehicleType === type).length
    })),
    byBrand: brands.slice(0, 8).map(brand => ({
      brand,
      count: vehicles.filter(v => v.brand === brand).length
    })),
    byCity: cities.map(city => ({
      city: city.length > 10 ? city.substring(0, 10) : city,
      count: vehicles.filter(v => v.city === city).length
    }))
  };

  // View modes
  if (viewMode === 'detail' && selectedVehicle) {
    return (
      <VehicleDetailPage
        vehicle={selectedVehicle}
        onBack={() => {
          setViewMode('list');
          setSelectedVehicle(null);
        }}
        onEdit={() => setViewMode('edit')}
      />
    );
  }

  if (viewMode === 'edit' && selectedVehicle) {
    return (
      <VehicleAddEdit
        vehicle={selectedVehicle}
        onBack={() => setViewMode('detail')}
        onSave={(data) => {
          console.log('Saving vehicle:', data);
          setViewMode('detail');
        }}
      />
    );
  }

  if (viewMode === 'add') {
    return (
      <VehicleAddEdit
        onBack={() => setViewMode('list')}
        onSave={(data) => {
          console.log('Adding vehicle:', data);
          setViewMode('list');
        }}
      />
    );
  }

  // Define columns
  const columns: ColumnDef<Vehicle>[] = [
    {
      key: 'stt',
      header: 'STT',
      width: '60px',
      render: (_, index) => <span className="text-sm">{index + 1}</span>
    },
    {
      key: 'plateNumber',
      header: 'Biển số',
      sortable: true,
      width: '130px',
      render: (vehicle) => (
        <div className="flex items-center gap-2 justify-center">
          <Car className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{vehicle.plateNumber}</span>
        </div>
      )
    },
    {
      key: 'owner',
      header: 'Chủ sở hữu',
      sortable: true,
      width: '180px',
      render: (vehicle) => (
        <div className="text-left w-full">
          <div className="text-sm truncate" title={vehicle.owner}>{vehicle.owner}</div>
          <div className="text-xs text-muted-foreground">{vehicle.ownerPhone}</div>
        </div>
      )
    },
    {
      key: 'vehicleType',
      header: 'Loại xe',
      sortable: true,
      width: '120px',
      render: (vehicle) => <span className="text-sm truncate" title={vehicle.vehicleType}>{vehicle.vehicleType}</span>
    },
    {
      key: 'brand',
      header: 'Hãng',
      sortable: true,
      width: '100px',
      render: (vehicle) => (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 truncate" title={vehicle.brand}>
          {vehicle.brand}
        </Badge>
      )
    },
    {
      key: 'model',
      header: 'Mẫu xe',
      width: '120px',
      render: (vehicle) => <span className="text-sm text-muted-foreground truncate" title={vehicle.model}>{vehicle.model}</span>
    },
    {
      key: 'color',
      header: 'Màu',
      sortable: true,
      width: '80px',
      render: (vehicle) => <span className="text-sm">{vehicle.color}</span>
    },
    {
      key: 'city',
      header: 'Thành phố',
      sortable: true,
      width: '120px',
      render: (vehicle) => <span className="text-sm truncate" title={vehicle.city}>{vehicle.city}</span>
    },
    {
      key: 'registrationDate',
      header: 'Ngày ĐK',
      sortable: true,
      width: '110px',
      render: (vehicle) => (
        <span className="text-sm">{new Date(vehicle.registrationDate).toLocaleDateString('vi-VN')}</span>
      )
    },
    {
      key: 'nextInspection',
      header: 'ĐK kế tiếp',
      sortable: true,
      width: '140px',
      render: (vehicle) => {
        const inspectionStatus = getInspectionStatus(vehicle.nextInspection);
        return (
          <div className="text-left w-full">
            <div className="text-sm">{new Date(vehicle.nextInspection).toLocaleDateString('vi-VN')}</div>
            <div className={`text-xs ${inspectionStatus.color} truncate`} title={inspectionStatus.text}>{inspectionStatus.text}</div>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      width: '120px',
      render: (vehicle) => {
        const config = statusConfig[vehicle.status];
        return (
          <Badge className={`${config.color} text-white border-0`}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'blockchain',
      header: 'Blockchain',
      sortable: true,
      width: '100px',
      render: (vehicle) => (
        <div className="flex justify-center">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                {vehicle.onBlockchain ? (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400">
                    <Shield className="h-4 w-4 text-cyan-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300">
                    <Database className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{vehicle.onBlockchain ? 'Đã lưu trữ vào Blockchain' : 'Chưa lưu vào Blockchain'}</p>
                {vehicle.onBlockchain && vehicle.blockchainTxHash && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{vehicle.blockchainTxHash.slice(0, 10)}...</p>
                )}
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '150px',
      render: (vehicle) => (
        <div className="flex justify-center gap-1">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setViewMode('detail');
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setViewMode('edit');
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={() => toast.success('Đã xóa phương tiện thành công!')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      )
    }
  ];

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'valid', label: 'Hợp lệ' },
        { value: 'expired', label: 'Hết hạn' },
        { value: 'pending', label: 'Chờ đăng kiểm' }
      ]
    },
    {
      key: 'vehicleType',
      label: 'Loại xe',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...vehicleTypes.map(type => ({ value: type, label: type }))
      ]
    },
    {
      key: 'brand',
      label: 'Hãng xe',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...brands.map(brand => ({ value: brand, label: brand }))
      ]
    },
    {
      key: 'city',
      label: 'Thành phố',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...cities.map(city => ({ value: city, label: city }))
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div>
            {/* Title removed - already in navbar */}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setViewMode('add')}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phương tiện
            </Button>
            <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
              <BarChart3 className="mr-2 h-4 w-4" />
              {showAnalytics ? 'Ẩn' : 'Hiện'} phân tích
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Tổng phương tiện"
          value={vehicles.length}
          subtitle="Đã đăng ký"
          icon={Car}
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Hợp lệ"
          value={vehicles.filter(v => v.status === 'valid').length}
          subtitle={`${Math.round((vehicles.filter(v => v.status === 'valid').length / vehicles.length) * 100)}% phương tiện`}
          icon={CheckCircle}
          color="green"
          trend={{ value: 5, isPositive: true }}
          delay={0.15}
        />
        <StatCard
          title="Hết hạn"
          value={vehicles.filter(v => v.status === 'expired').length}
          subtitle="Cần đăng kiểm lại"
          icon={AlertCircle}
          color="red"
          trend={{ value: 3, isPositive: false }}
          delay={0.2}
        />
        <StatCard
          title="Chờ đăng kiểm"
          value={vehicles.filter(v => v.status === 'pending').length}
          subtitle="Đang chờ xử lý"
          icon={Calendar}
          color="amber"
          delay={0.25}
        />
      </div>

      {/* Analytics */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid gap-4 md:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo loại xe</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái đăng kiểm</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.byStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo hãng xe</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byBrand}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Số lượng">
                    {analyticsData.byBrand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo thành phố</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modern Data Table */}
      <div>
        <ModernDataTable
          data={vehicles}
          columns={columns}
          title="Danh sách phương tiện"
          searchPlaceholder="Tìm kiếm theo biển số, chủ xe..."
          searchKeys={['plateNumber', 'owner', 'vehicleType']}
          filters={filters}
          getItemKey={(vehicle) => vehicle.id}
          onExport={() => console.log('Exporting vehicles...')}
        />

        {/* Action Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200"
        >
          <p className="text-sm mb-3">Chú thích thao tác:</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <Eye className="h-4 w-4" />
              <span>Xem chi tiết</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-4 w-4" />
              <span>Xóa</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}