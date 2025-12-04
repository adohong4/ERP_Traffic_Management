import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Car,
  CreditCard,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CHART_COLORS = {
  primary: '#06b6d4',
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Mock data for charts
const monthlyData = [
  { month: 'T1', licenses: 1200, vehicles: 800, violations: 450 },
  { month: 'T2', licenses: 1400, vehicles: 950, violations: 380 },
  { month: 'T3', licenses: 1100, vehicles: 1100, violations: 520 },
  { month: 'T4', licenses: 1600, vehicles: 1000, violations: 410 },
  { month: 'T5', licenses: 1350, vehicles: 1200, violations: 490 },
  { month: 'T6', licenses: 1500, vehicles: 900, violations: 360 },
];

const licenseByClass = [
  { name: 'A1', value: 3200, color: CHART_COLORS.primary },
  { name: 'A2', value: 1800, color: CHART_COLORS.secondary },
  { name: 'B1', value: 4500, color: CHART_COLORS.success },
  { name: 'B2', value: 2800, color: CHART_COLORS.warning },
  { name: 'C', value: 1900, color: CHART_COLORS.danger },
];

const violationByType = [
  { type: 'Tốc độ', count: 450, color: CHART_COLORS.primary },
  { type: 'Đèn đỏ', count: 320, color: CHART_COLORS.secondary },
  { type: 'Nồng độ cồn', count: 280, color: CHART_COLORS.danger },
  { type: 'Không mũ BH', count: 150, color: CHART_COLORS.warning },
  { type: 'Khác', count: 200, color: CHART_COLORS.success },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => (
  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
    <div className="absolute right-4 top-4 rounded-full bg-gradient-to-br p-3 opacity-20" style={{ background: color }}>
      {icon}
    </div>
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl">{value}</p>
      <div className="flex items-center gap-2">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500">so với tháng trước</span>
      </div>
    </div>
  </Card>
);

export const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống quản lý GPLX & Đăng kiểm</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng GPLX"
          value="14,200"
          change="+12.5%"
          trend="up"
          icon={<CreditCard className="h-6 w-6" />}
          color="linear-gradient(135deg, #06b6d4, #0ea5e9)"
        />
        <StatCard
          title="Phương tiện"
          value="8,450"
          change="+8.2%"
          trend="up"
          icon={<Car className="h-6 w-6" />}
          color="linear-gradient(135deg, #0ea5e9, #3b82f6)"
        />
        <StatCard
          title="Vi phạm tháng này"
          value="1,400"
          change="-5.3%"
          trend="down"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="linear-gradient(135deg, #f59e0b, #ef4444)"
        />
        <StatCard
          title="Người dùng"
          value="3,280"
          change="+15.7%"
          trend="up"
          icon={<Users className="h-6 w-6" />}
          color="linear-gradient(135deg, #10b981, #06b6d4)"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="border-0 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg">Xu hướng theo tháng</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="licenses"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                name="GPLX"
                dot={{ fill: CHART_COLORS.primary, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="vehicles"
                stroke={CHART_COLORS.secondary}
                strokeWidth={2}
                name="Phương tiện"
                dot={{ fill: CHART_COLORS.secondary, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="violations"
                stroke={CHART_COLORS.danger}
                strokeWidth={2}
                name="Vi phạm"
                dot={{ fill: CHART_COLORS.danger, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* License by Class */}
        <Card className="border-0 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg">Phân loại GPLX</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={licenseByClass}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {licenseByClass.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Violations by Type */}
        <Card className="border-0 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg">Vi phạm theo loại</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {violationByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg">Hoạt động gần đây</h3>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { action: 'Cấp GPLX mới', user: 'Nguyễn Văn A', time: '5 phút trước', type: 'license' },
              { action: 'Đăng ký xe', user: 'Trần Thị B', time: '12 phút trước', type: 'vehicle' },
              { action: 'Xử lý vi phạm', user: 'Lê Văn C', time: '25 phút trước', type: 'violation' },
              { action: 'Gia hạn GPLX', user: 'Phạm Thị D', time: '1 giờ trước', type: 'license' },
              { action: 'Đăng kiểm xe', user: 'Hoàng Văn E', time: '2 giờ trước', type: 'inspection' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                <div
                  className={`rounded-full p-2 ${
                    activity.type === 'license'
                      ? 'bg-cyan-50 text-cyan-600'
                      : activity.type === 'vehicle'
                        ? 'bg-blue-50 text-blue-600'
                        : activity.type === 'violation'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-green-50 text-green-600'
                  }`}
                >
                  {activity.type === 'license' ? (
                    <CreditCard className="h-4 w-4" />
                  ) : activity.type === 'vehicle' ? (
                    <Car className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
