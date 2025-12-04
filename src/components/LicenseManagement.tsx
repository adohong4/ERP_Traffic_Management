import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { FileText, Ban, RefreshCw, AlertTriangle, BarChart3, Eye, Edit, Trash2, Plus, CheckCircle, Clock, XCircle, Database, Shield } from 'lucide-react';
import { licenses, type License } from '../lib/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LicenseDetailPage from './LicenseDetailPage';
import LicenseAddEdit from './LicenseAddEdit';
import ModernDataTable, { ColumnDef, FilterConfig } from './ModernDataTable';
import StatCard from './StatCard';

const statusConfig = {
  active: { label: 'Đang hiệu lực', color: 'bg-green-500', icon: FileText },
  expired: { label: 'Hết hạn', color: 'bg-gray-500', icon: AlertTriangle },
  revoked: { label: 'Thu hồi', color: 'bg-red-500', icon: Ban },
  suspended: { label: 'Tạm dừng', color: 'bg-yellow-500', icon: AlertTriangle }
};
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function LicenseManagement() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'add' | 'edit'>('list');

  const cities = Array.from(new Set(licenses.map(l => l.city)));
  const licenseTypes = Array.from(new Set(licenses.map(l => l.licenseType)));

  // Helper functions
  const handleViewDetail = (license: License) => {
    setSelectedLicense(license);
    setViewMode('detail');
  };

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license);
    setViewMode('edit');
  };

  // Analytics data
  const analyticsData = {
    byStatus: [
      { name: 'Hiệu lực', value: licenses.filter(l => l.status === 'active').length },
      { name: 'Hết hạn', value: licenses.filter(l => l.status === 'expired').length },
      { name: 'Tạm dừng', value: licenses.filter(l => l.status === 'suspended').length },
      { name: 'Thu hồi', value: licenses.filter(l => l.status === 'revoked').length }
    ],
    byType: licenseTypes.map(type => ({
      type,
      count: licenses.filter(l => l.licenseType === type).length
    })),
    byCity: Array.from(new Set(licenses.map(l => l.city))).map(city => ({
      city: city.length > 10 ? city.substring(0, 10) : city,
      count: licenses.filter(l => l.city === city).length
    })),
    violationDistribution: [
      { range: '0', count: licenses.filter(l => l.violations === 0).length },
      { range: '1-3', count: licenses.filter(l => l.violations > 0 && l.violations <= 3).length },
      { range: '4-7', count: licenses.filter(l => l.violations > 3 && l.violations <= 7).length },
      { range: '8+', count: licenses.filter(l => l.violations > 7).length }
    ]
  };

  // View modes
  if (viewMode === 'detail' && selectedLicense) {
    return (
      <LicenseDetailPage 
        license={selectedLicense} 
        onBack={() => {
          setViewMode('list');
          setSelectedLicense(null);
        }}
        onEdit={() => setViewMode('edit')}
      />
    );
  }

  if (viewMode === 'edit' && selectedLicense) {
    return (
      <LicenseAddEdit
        license={selectedLicense}
        onBack={() => setViewMode('detail')}
        onSave={(data) => {
          console.log('Saving license:', data);
          setViewMode('detail');
        }}
      />
    );
  }

  if (viewMode === 'add') {
    return (
      <LicenseAddEdit
        onBack={() => setViewMode('list')}
        onSave={(data) => {
          console.log('Adding license:', data);
          setViewMode('list');
        }}
      />
    );
  }

  // Define columns
  const columns: ColumnDef<License>[] = [
    {
      key: 'stt',
      header: 'STT',
      width: '60px',
      render: (_, index) => <span className="text-sm">{index + 1}</span>
    },
    {
      key: 'licenseNumber',
      header: 'Số GPLX',
      sortable: true,
      width: '150px',
      render: (license) => (
        <div className="flex items-center gap-2 justify-center">
          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm truncate" title={license.licenseNumber}>{license.licenseNumber}</span>
        </div>
      )
    },
    {
      key: 'holderName',
      header: 'Người sở hữu',
      sortable: true,
      width: '160px',
      render: (license) => <span className="text-sm truncate" title={license.holderName}>{license.holderName}</span>
    },
    {
      key: 'idCard',
      header: 'CCCD',
      sortable: true,
      width: '130px',
      render: (license) => <span className="text-sm font-mono">{license.idCard}</span>
    },
    {
      key: 'walletAddress',
      header: 'Wallet Address',
      sortable: true,
      width: '180px',
      render: (license) => (
        license.walletAddress ? (
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-cyan-600 flex-shrink-0" />
                  <code className="text-xs bg-gradient-to-r from-cyan-50 to-blue-50 px-2 py-1 rounded border border-cyan-200 text-cyan-700 font-mono truncate max-w-[140px]">
                    {license.walletAddress.slice(0, 6)}...{license.walletAddress.slice(-4)}
                  </code>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Địa chỉ Wallet đầy đủ:</p>
                  <code className="text-xs bg-slate-800 text-cyan-300 px-2 py-1 rounded block">
                    {license.walletAddress}
                  </code>
                </div>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        ) : (
          <span className="text-xs text-muted-foreground italic">Chưa liên kết</span>
        )
      )
    },
    {
      key: 'licenseType',
      header: 'Hạng',
      sortable: true,
      width: '80px',
      render: (license) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {license.licenseType}
        </Badge>
      )
    },
    {
      key: 'city',
      header: 'Thành phố',
      sortable: true,
      width: '120px',
      render: (license) => <span className="text-sm truncate" title={license.city}>{license.city}</span>
    },
    {
      key: 'issuePlace',
      header: 'Nơi cấp',
      width: '150px',
      render: (license) => <span className="text-sm text-muted-foreground truncate" title={license.issuePlace}>{license.issuePlace}</span>
    },
    {
      key: 'issueDate',
      header: 'Ngày cấp',
      sortable: true,
      width: '110px',
      render: (license) => (
        <span className="text-sm">{new Date(license.issueDate).toLocaleDateString('vi-VN')}</span>
      )
    },
    {
      key: 'expiryDate',
      header: 'Hết hạn',
      sortable: true,
      width: '110px',
      render: (license) => (
        <span className="text-sm">{new Date(license.expiryDate).toLocaleDateString('vi-VN')}</span>
      )
    },
    {
      key: 'violations',
      header: 'Vi phạm',
      sortable: true,
      width: '90px',
      render: (license) => (
        <Badge 
          variant={license.violations > 5 ? 'destructive' : 'secondary'}
          className={license.violations > 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
        >
          {license.violations}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      width: '120px',
      render: (license) => {
        const config = statusConfig[license.status];
        return (
          <Badge 
            className={`${config.color} text-white border-0`}
          >
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
      render: (license) => (
        <div className="flex justify-center">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                {license.onBlockchain ? (
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
                <p>{license.onBlockchain ? 'Đã lưu trữ vào Blockchain' : 'Chưa lưu vào Blockchain'}</p>
                {license.onBlockchain && license.blockchainTxHash && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{license.blockchainTxHash.slice(0, 10)}...</p>
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
      width: '120px',
      render: (license) => (
        <div className="flex justify-center gap-1">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => handleViewDetail(license)}
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
                  onClick={() => handleEditLicense(license)}
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
        { value: 'active', label: 'Hiệu lực' },
        { value: 'expired', label: 'Hết hạn' },
        { value: 'suspended', label: 'Tạm dừng' },
        { value: 'revoked', label: 'Thu hồi' }
      ]
    },
    {
      key: 'licenseType',
      label: 'Hạng GPLX',
      options: [
        { value: 'all', label: 'Tất cả' },
        ...licenseTypes.map(type => ({ value: type, label: type }))
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
              Thêm GPLX
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
          title="Đang hiệu lực"
          value={licenses.filter(l => l.status === 'active').length}
          subtitle={`${Math.round((licenses.filter(l => l.status === 'active').length / licenses.length) * 100)}% tổng số`}
          icon={CheckCircle}
          color="green"
          trend={{ value: 3, isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Hết hạn"
          value={licenses.filter(l => l.status === 'expired').length}
          subtitle="Cần gia hạn"
          icon={Clock}
          color="amber"
          delay={0.15}
        />
        <StatCard
          title="Tạm dừng"
          value={licenses.filter(l => l.status === 'suspended').length}
          subtitle="Đang bị tạm dừng"
          icon={AlertTriangle}
          color="orange"
          delay={0.2}
        />
        <StatCard
          title="Thu hồi"
          value={licenses.filter(l => l.status === 'revoked').length}
          subtitle="Đã bị thu hồi"
          icon={XCircle}
          color="red"
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
              <CardTitle>Phân bố theo hạng GPLX</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
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
              <CardTitle>Phân bố theo thành phố</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.byCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố vi phạm</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.violationDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" name="Số lượng GPLX" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái GPLX</CardTitle>
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
        </motion.div>
      )}

      {/* Modern Data Table */}
      <div>
        <ModernDataTable
          data={licenses}
          columns={columns}
          title="Danh sách GPLX"
          searchPlaceholder="Tìm kiếm theo số GPLX, tên, CCCD..."
          searchKeys={['licenseNumber', 'holderName', 'idCard']}
          filters={filters}
          getItemKey={(license) => license.id}
          onExport={() => console.log('Exporting licenses...')}
        />
        
        {/* Action Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
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