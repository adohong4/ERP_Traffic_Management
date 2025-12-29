import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, DollarSign, Clock, CheckCircle, BarChart3, Eye, Edit, Trash2, TrendingDown, TrendingUp, Plus } from 'lucide-react';
import { violations, type Violation } from '@/lib/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ModernDataTable, { ColumnDef, FilterConfig } from '@/components/ModernDataTable';
import ViolationDetailPage from './ViolationDetailPage';
import ViolationAddEdit from './ViolationAddEdit';
import StatCard from '@/components/StatCard';
import { toast } from 'sonner';

const statusConfig = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-500', icon: Clock },
  paid: { label: 'Đã thanh toán', color: 'bg-green-500', icon: CheckCircle },
  overdue: { label: 'Quá hạn', color: 'bg-red-500', icon: AlertTriangle }
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function ViolationsManagement() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'add' | 'edit'>('list');

  if (viewMode === 'detail' && selectedViolation) {
    return (
      <ViolationDetailPage
        violation={selectedViolation}
        onBack={() => {
          setViewMode('list');
          setSelectedViolation(null);
        }}
      />
    );
  }

  if (viewMode === 'add' || (viewMode === 'edit' && selectedViolation)) {
    return (
      <ViolationAddEdit
        violation={viewMode === 'edit' ? selectedViolation : undefined}
        onBack={() => {
          setViewMode('list');
          setSelectedViolation(null);
        }}
        onSave={(data) => {
          console.log('Saving violation:', data);
          toast.success(viewMode === 'edit' ? 'Cập nhật vi phạm thành công!' : 'Ghi nhận vi phạm thành công!');
          setViewMode('list');
          setSelectedViolation(null);
        }}
      />
    );
  }

  const cities = Array.from(new Set(violations.map(v => v.city)));
  const violationTypes = Array.from(new Set(violations.map(v => v.violationType)));

  const totalFines = violations.reduce((sum, v) => sum + v.fine, 0);
  const paidFines = violations.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.fine, 0);
  const pendingFines = violations.filter(v => v.status === 'pending').reduce((sum, v) => sum + v.fine, 0);
  const overdueFines = violations.filter(v => v.status === 'overdue').reduce((sum, v) => sum + v.fine, 0);

  // Analytics data
  const violationsByMonth = Array.from({ length: 10 }, (_, i) => {
    const monthViolations = violations.filter(v => {
      const vDate = new Date(v.date);
      return vDate.getMonth() === i && vDate.getFullYear() === 2024;
    });
    return {
      month: `T${i + 1}`,
      count: monthViolations.length,
      fine: monthViolations.reduce((sum, v) => sum + v.fine, 0) / 1000000
    };
  });

  const analyticsData = {
    byStatus: [
      { name: 'Chờ xử lý', value: violations.filter(v => v.status === 'pending').length },
      { name: 'Đã thanh toán', value: violations.filter(v => v.status === 'paid').length },
      { name: 'Quá hạn', value: violations.filter(v => v.status === 'overdue').length }
    ],
    byType: violationTypes.slice(0, 8).map(type => ({
      type: type.length > 20 ? type.substring(0, 20) + '...' : type,
      count: violations.filter(v => v.violationType === type).length
    })),
    byCity: cities.map(city => ({
      city: city.length > 10 ? city.substring(0, 10) : city,
      count: violations.filter(v => v.city === city).length
    })),
    byMonth: violationsByMonth
  };

  // Define columns
  const columns: ColumnDef<Violation>[] = [
    {
      key: 'stt',
      header: 'STT',
      width: '60px',
      render: (_, index) => <span className="text-sm">{index + 1}</span>
    },
    {
      key: 'violatorName',
      header: 'Người vi phạm',
      sortable: true,
      width: '170px',
      render: (v) => (
        <div className="text-left w-full">
          <div className="text-sm truncate" title={v.violatorName}>{v.violatorName}</div>
          <div className="text-xs text-muted-foreground truncate" title={v.licenseNumber}>{v.licenseNumber}</div>
        </div>
      )
    },
    {
      key: 'plateNumber',
      header: 'Biển số',
      sortable: true,
      width: '140px',
      render: (v) => (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-mono">
          {v.plateNumber}
        </Badge>
      )
    },
    {
      key: 'violationType',
      header: 'Loại vi phạm',
      sortable: true,
      width: '200px',
      render: (v) => (
        <div className="flex items-center gap-2 text-left w-full">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-sm truncate" title={v.violationType}>{v.violationType}</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Địa điểm',
      width: '190px',
      render: (v) => <span className="text-sm text-muted-foreground text-left block truncate" title={v.location}>{v.location}</span>
    },
    {
      key: 'date',
      header: 'Thời gian',
      sortable: true,
      width: '150px',
      render: (v) => (
        <div className="text-left w-full">
          <div className="text-sm">{new Date(v.date).toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-muted-foreground">{new Date(v.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    },
    {
      key: 'fine',
      header: 'Tiền phạt',
      sortable: true,
      width: '130px',
      render: (v) => (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {(v.fine / 1000000).toFixed(1)}M
        </Badge>
      )
    },
    {
      key: 'points',
      header: 'Điểm trừ',
      sortable: true,
      width: '100px',
      render: (v) => (
        <Badge variant={v.points >= 5 ? 'destructive' : 'secondary'} className={v.points >= 5 ? 'bg-[#FEE2E2] text-red-700' : 'bg-gray-100 text-gray-700'}>
          {v.points}
        </Badge>
      )
    },
    {
      key: 'officer',
      header: 'CSGT xử lý',
      width: '180px',
      render: (v) => <span className="text-sm text-muted-foreground truncate" title={v.officer}>{v.officer}</span>
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      width: '130px',
      render: (v) => {
        const config = statusConfig[v.status];
        return (
          <Badge className={`${config.color} text-white border-0`}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
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
                    setSelectedViolation(v);
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
                    setSelectedViolation(v);
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
                  onClick={() => toast.success('Đã xóa vi phạm thành công!')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xóa</p></TooltipContent>
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
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'overdue', label: 'Quá hạn' }
      ]
    },
    {
      key: 'violationType',
      label: 'Loại vi phạm',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...violationTypes.map(type => ({ value: type, label: type }))
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
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
              onClick={() => setViewMode('add')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm vi phạm mới
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
          title="Tổng vi phạm"
          value={violations.length}
          subtitle="Vi phạm được ghi nhận"
          icon={AlertTriangle}
          color="red"
          trend={{ value: 8, isPositive: false }}
          delay={0.1}
        />
        <StatCard
          title="Tổng tiền phạt"
          value={`${(totalFines / 1000000).toFixed(1)}M VNĐ`}
          subtitle={`Đã thu ${Math.round((paidFines / totalFines) * 100)}%`}
          icon={DollarSign}
          color="purple"
          progress={Math.round((paidFines / totalFines) * 100)}
          delay={0.15}
        />
        <StatCard
          title="Đã thanh toán"
          value={`${(paidFines / 1000000).toFixed(1)}M VNĐ`}
          subtitle={`${violations.filter(v => v.status === 'paid').length} vi phạm`}
          icon={CheckCircle}
          color="green"
          trend={{ value: 12, isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Chờ thanh toán"
          value={`${((pendingFines + overdueFines) / 1000000).toFixed(1)}M VNĐ`}
          subtitle={`${violations.filter(v => v.status !== 'paid').length} vi phạm`}
          icon={Clock}
          color="amber"
          delay={0.25}
        />
      </div>

      {/* Placeholder to complete the refactor */}
      <div className="hidden">
        {[].map((stat, index) => {
          const Icon = stat;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">temp</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl ${stat.color}`}>{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
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
              <CardTitle>Vi phạm theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData.byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" name="Số vi phạm" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="fine" stroke="#10b981" name="Tiền phạt (triệu)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo loại vi phạm</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Số lượng">
                    {analyticsData.byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái xử lý</CardTitle>
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
              <CardTitle>Phân bố theo thành phố</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" name="Số vi phạm" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modern Data Table */}
      <div>
        <ModernDataTable
          data={violations}
          columns={columns}
          title="Danh sách vi phạm"
          searchPlaceholder="Tìm kiếm theo tên, biển số, GPLX..."
          searchKeys={['violatorName', 'licenseNumber', 'plateNumber']}
          filters={filters}
          getItemKey={(v) => v.id}
          onExport={() => console.log('Exporting violations...')}
        />

        {/* Action Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-gray-200"
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