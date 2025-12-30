import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Car,
  Calendar,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Shield,
  Database,
  Loader2,
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VehicleDetailPage from './VehicleDetailPage'; // Bạn tự tạo hoặc điều chỉnh
import VehicleAddEdit from './VehicleAddEdit';         // Bạn tự tạo hoặc điều chỉnh
import ModernDataTable, { ColumnDef, FilterConfig } from '@/components/LicensesUI/ModernDataTable';
import StatCard from '../StatCard';
import { toast } from 'sonner';
import vehicleService from '@/services/vehicleService';
import type { VehicleRegistration, VehicleRegistrationList, CountItem } from '@/types';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  'hợp lệ': { label: 'Hợp lệ', color: 'bg-green-500', icon: CheckCircle },
  'hết hạn': { label: 'Hết hạn', color: 'bg-red-500', icon: AlertCircle },
  'chờ đăng kiểm': { label: 'Chờ đăng kiểm', color: 'bg-yellow-500', icon: Calendar },
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#8b5cf6'];

export default function VehicleManagement() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegistration | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'add' | 'edit'>('list');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [vehicles, setVehicles] = useState<VehicleRegistration[]>([]);
  const [listData, setListData] = useState<VehicleRegistrationList | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [statsType, setStatsType] = useState<CountItem[]>([]);
  const [statsBrand, setStatsBrand] = useState<CountItem[]>([]);
  const [statsStatus, setStatsStatus] = useState<CountItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch danh sách xe
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAllVehicles(currentPage, itemsPerPage);
      setVehicles(response.vehicle_registration);
      setTotalCount(response.total_count)
      setTotalPages(response.total_pages);
    } catch (err) {
      toast.error('Không thể tải danh sách phương tiện');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Fetch thống kê
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const { type, brand, status } = await vehicleService.getVehicleStats();
      setStatsType(type);
      setStatsBrand(brand);
      setStatsStatus(status);
    } catch (err) {
      toast.error('Không thể tải thống kê');
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchStats();
  }, [fetchVehicles, fetchStats]);

  // Xử lý xóa
  const handleDelete = async (vehicle: VehicleRegistration) => {
    if (!confirm(`Bạn có chắc muốn xóa phương tiện biển số ${vehicle.vehicle_no}?`)) return;

    try {
      await vehicleService.deleteVehicleRegistration(vehicle.id);
      toast.success('Xóa phương tiện thành công!');
      fetchVehicles();
    } catch (err) {
      toast.error('Xóa thất bại');
    }
  };

  // Tính ngày còn lại đến hạn đăng kiểm
  const getInspectionStatus = (expiryDate?: string | null) => {
    if (!expiryDate) {
      return { text: 'Chưa có hạn', color: 'text-gray-600' };
    }
    const days = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Quá hạn', color: 'text-red-600' };
    if (days < 30) return { text: `Còn ${days} ngày`, color: 'text-yellow-600' };
    return { text: `Còn ${days} ngày`, color: 'text-green-600' };
  };

  // Chuẩn bị dữ liệu analytics
  const analyticsData = {
    byStatus: statsStatus.map(s => ({
      name: s.key,
      value: s.count,
    })),
    byType: statsType.map(t => ({
      type: t.key.length > 15 ? t.key.substring(0, 15) + '...' : t.key,
      count: t.count,
    })),
    byBrand: statsBrand.map(b => ({
      brand: b.key,
      count: b.count,
    })),
  };

  const totalVehicles = totalCount || 0;
  const validCount = statsStatus.find(s => s.key === 'hợp lệ')?.count || 0;
  const expiredCount = statsStatus.find(s => s.key === 'hết hạn')?.count || 0;
  const pendingCount = statsStatus.find(s => s.key === 'chờ đăng kiểm')?.count || 0;

  // View mode chi tiết
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

  if ((viewMode === 'edit' || viewMode === 'add') && (viewMode === 'add' || selectedVehicle)) {
    return (
      <VehicleAddEdit
        vehicle={viewMode === 'edit' ? selectedVehicle ?? undefined : undefined}
        onBack={() => setViewMode(viewMode === 'edit' ? 'detail' : 'list')}
        onSave={async () => {
          toast.success(viewMode === 'add' ? 'Thêm phương tiện thành công!' : 'Cập nhật thành công!');
          await fetchVehicles();
          await fetchStats();
          setViewMode('list');
          setSelectedVehicle(null);
        }}
      />
    );
  }

  // Columns cho bảng
  const columns: ColumnDef<VehicleRegistration>[] = [
    {
      key: 'stt',
      header: 'STT',
      width: '40px',
      render: (_, index) => <span className="text-sm">{index + 1}</span>,
    },
    {
      key: 'vehicle_no',
      header: 'Biển số',
      sortable: true,
      width: '150px',
      render: (v) => (
        <div className="flex items-center gap-2 justify-center">
          <Car className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{v.vehicle_no}</span>
        </div>
      ),
    },
    {
      key: 'owner_name',
      header: 'Chủ sở hữu',
      sortable: true,
      width: '150px',
      render: (v) => (
        <div className="text-left w-full">
          <div className="text-sm truncate" title={v.owner_name}>{v.owner_name}</div>
        </div>
      ),
    },
    {
      key: 'type_vehicle',
      header: 'Loại xe',
      sortable: true,
      width: '130px',
      render: (v) => <span className="text-sm truncate" title={v.type_vehicle}>{v.type_vehicle}</span>,
    },
    {
      key: 'brand',
      header: 'Hãng',
      sortable: true,
      width: '120px',
      render: (v) => (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 truncate">
          {v.brand}
        </Badge>
      ),
    },
    {
      key: 'issuer',
      header: 'Thành phố',
      width: '120px',
      render: (v) => {
        const city = v.issuer
          .replace(/^Cơ quan giao thông\s*/, '')
          .replace(/^Cục Đăng kiểm\s*/, '')
          .trim();

        return <span className="text-sm font-medium">{city || '—'}</span>;
      },
    },
    {
      key: 'color_vehicle',
      header: 'Màu xe',
      width: '100px',
      render: (v) => <span className="text-sm">{v.color_vehicle}</span>,
    },
    {
      key: 'issue_date',
      header: 'Ngày cấp',
      sortable: true,
      width: '120px',
      render: (v) => <span className="text-sm">{new Date(v.issue_date).toLocaleDateString('vi-VN')}</span>,
    },
    {
      key: 'registration_date',
      header: 'Ngày đăng kiểm',
      sortable: true,
      width: '160px',
      render: (v) => {
        return (
          <div className="text-left w-full">
            <div className="text-sm">
              {v.registration_date ? new Date(v.registration_date).toLocaleDateString('vi-VN') : 'Chưa có'}
            </div>
          </div>
        );
      },
    },

    {
      key: 'expiry_date',
      header: 'Hạn đăng kiểm',
      sortable: true,
      width: '160px',
      render: (v) => {
        const inspectionStatus = getInspectionStatus(v.expiry_date);
        return (
          <div className="text-left w-full">
            <div className="text-sm">
              {v.expiry_date ? new Date(v.expiry_date).toLocaleDateString('vi-VN') : 'Chưa có'}
            </div>
            <div className={`text-xs ${inspectionStatus.color}`}>{inspectionStatus.text}</div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      width: '130px',
      render: (v) => {
        const config = statusConfig[v.status?.toLowerCase() || ''] || {
          label: v.status || 'Không xác định',
          color: 'bg-gray-500',
        };
        return <Badge className={`${config.color} text-white border-0`}>{config.label}</Badge>;
      },
    },
    {
      key: 'on_blockchain',
      header: 'Blockchain',
      width: '110px',
      render: (v) => (
        <div className="flex justify-center text-center">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                {v.on_blockchain ? (
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
                <p>{v.on_blockchain ? 'Đã lưu trữ vào Blockchain' : 'Chưa lưu vào Blockchain'}</p>
                {v.on_blockchain && v.blockchain_txhash && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {v.blockchain_txhash.slice(0, 20)}...
                  </p>
                )}
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '150px',
      render: (v) => (
        <div className="flex justify-center gap-1">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedVehicle(v);
                    setViewMode('detail');
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xem chi tiết</p></TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedVehicle(v);
                    setViewMode('edit');
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Chỉnh sửa</p></TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDelete(v)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xóa</p></TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  // Filters (dựa trên dữ liệu thực tế)
  const uniqueTypes = Array.from(new Set(vehicles.map(v => v.type_vehicle)));
  const uniqueBrands = Array.from(new Set(vehicles.map(v => v.brand)));

  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'hợp lệ', label: 'Hợp lệ' },
        { value: 'hết hạn', label: 'Hết hạn' },
        { value: 'chờ đăng kiểm', label: 'Chờ đăng kiểm' },
      ],
    },
    {
      key: 'type_vehicle',
      label: 'Loại xe',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...uniqueTypes.map(t => ({ value: t, label: t })),
      ],
    },
    {
      key: 'brand',
      label: 'Hãng xe',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...uniqueBrands.map(b => ({ value: b, label: b })),
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center">
          <div />
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

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Tổng phương tiện" value={totalVehicles} subtitle="Đã đăng ký" icon={Car} color="blue" />
        <StatCard
          title="Hợp lệ"
          value={validCount}
          subtitle={totalVehicles ? `${Math.round((validCount / totalVehicles) * 100)}%` : '0%'}
          icon={CheckCircle}
          color="green"
        />
        <StatCard title="Hết hạn" value={expiredCount} subtitle="Cần đăng kiểm lại" icon={AlertCircle} color="red" />
        <StatCard title="Chờ đăng kiểm" value={pendingCount} subtitle="Đang chờ xử lý" icon={Calendar} color="amber" />
      </div>

      {/* Analytics */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid gap-4 md:grid-cols-2"
        >
          {statsLoading ? (
            <Card className="col-span-2 flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader><CardTitle>Phân bố theo loại xe</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.byType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Trạng thái đăng kiểm</CardTitle></CardHeader>
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
                        dataKey="value"
                      >
                        {analyticsData.byStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Top hãng xe</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.byBrand}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="brand" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Số lượng">
                        {analyticsData.byBrand.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      )}

      {/* Data Table */}
      <div>
        {loading ? (
          <Card className="flex items-center justify-center h-96">
            <Loader2 className="h-10 w-10 animate-spin" />
          </Card>
        ) : (
          <ModernDataTable
            data={vehicles}
            columns={columns}
            title="Danh sách phương tiện"
            searchPlaceholder="Tìm kiếm biển số, chủ xe..."
            searchKeys={['vehicle_no', 'owner_name', 'brand']}
            filters={filters}
            getItemKey={(v) => v.id}
            onExport={() => toast.info('Chức năng xuất file đang phát triển')}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalCount}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200"
        >
          <p className="text-sm mb-3">Chú thích thao tác:</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-600"><Eye className="h-4 w-4" /><span>Xem chi tiết</span></div>
            <div className="flex items-center gap-2 text-blue-600"><Edit className="h-4 w-4" /><span>Chỉnh sửa</span></div>
            <div className="flex items-center gap-2 text-red-600"><Trash2 className="h-4 w-4" /><span>Xóa</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}