import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Users,
  Car,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  FileCheck,
  ClipboardList,
} from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  students,
  licenses,
  vehicles,
  violations,
  inspectionCertificates,
  vehicleRegistrations,
  trafficAuthorities,
} from "../lib/mockData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );

  // License Analytics
  const licenseStats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === "active").length,
    expired: licenses.filter((l) => l.status === "expired").length,
    suspended: licenses.filter((l) => l.status === "suspended").length,
    revoked: licenses.filter((l) => l.status === "revoked").length,
  };

  const licensesByType = Array.from(
    new Set(licenses.map((l) => l.licenseType))
  ).map((type) => ({
    type,
    count: licenses.filter((l) => l.licenseType === type).length,
  }));

  const licensesByCity = Array.from(new Set(licenses.map((l) => l.city))).map(
    (city) => ({
      city,
      active: licenses.filter((l) => l.city === city && l.status === "active")
        .length,
      expired: licenses.filter((l) => l.city === city && l.status === "expired")
        .length,
      suspended: licenses.filter(
        (l) => l.city === city && l.status === "suspended"
      ).length,
    })
  );

  // Student Analytics
  const studentStats = {
    total: students.length,
    passed: students.filter((s) => s.status === "passed").length,
    failed: students.filter((s) => s.status === "failed").length,
    pending: students.filter((s) => s.status === "pending").length,
    passRate: (
      (students.filter((s) => s.status === "passed").length / students.length) *
      100
    ).toFixed(1),
  };

  const studentsByLicenseType = Array.from(
    new Set(students.map((s) => s.licenseType))
  ).map((type) => ({
    type,
    total: students.filter((s) => s.licenseType === type).length,
    passed: students.filter(
      (s) => s.licenseType === type && s.status === "passed"
    ).length,
    failed: students.filter(
      (s) => s.licenseType === type && s.status === "failed"
    ).length,
  }));

  // Vehicle Analytics
  const vehicleStats = {
    total: vehicles.length,
    valid: vehicles.filter((v) => v.status === "valid").length,
    expired: vehicles.filter((v) => v.status === "expired").length,
    pending: vehicles.filter((v) => v.status === "pending").length,
  };

  const vehiclesByType = Array.from(
    new Set(vehicles.map((v) => v.vehicleType))
  ).map((type) => ({
    type,
    count: vehicles.filter((v) => v.vehicleType === type).length,
  }));

  // Inspection Certificate Analytics
  const inspectionStats = {
    total: inspectionCertificates.length,
    valid: inspectionCertificates.filter((i) => i.status === "valid").length,
    expired: inspectionCertificates.filter((i) => i.status === "expired")
      .length,
    pending: inspectionCertificates.filter((i) => i.status === "pending")
      .length,
  };

  const inspectionsByCity = Array.from(
    new Set(inspectionCertificates.map((i) => i.city))
  ).map((city) => ({
    city,
    valid: inspectionCertificates.filter(
      (i) => i.city === city && i.status === "valid"
    ).length,
    expired: inspectionCertificates.filter(
      (i) => i.city === city && i.status === "expired"
    ).length,
  }));

  // Vehicle Registration Analytics
  const registrationStats = {
    total: vehicleRegistrations.length,
    active: vehicleRegistrations.filter((r) => r.status === "active").length,
    transferred: vehicleRegistrations.filter((r) => r.status === "transferred")
      .length,
    cancelled: vehicleRegistrations.filter((r) => r.status === "cancelled")
      .length,
  };

  const registrationsByType = Array.from(
    new Set(vehicleRegistrations.map((r) => r.vehicleType))
  ).map((type) => ({
    type,
    count: vehicleRegistrations.filter((r) => r.vehicleType === type).length,
  }));

  // Violation Analytics
  const violationStats = {
    total: violations.length,
    pending: violations.filter((v) => v.status === "pending").length,
    paid: violations.filter((v) => v.status === "paid").length,
    overdue: violations.filter((v) => v.status === "overdue").length,
    totalFines: violations.reduce((sum, v) => sum + v.fine, 0),
    collectedFines: violations
      .filter((v) => v.status === "paid")
      .reduce((sum, v) => sum + v.fine, 0),
  };

  const violationsByType = Array.from(
    new Set(violations.map((v) => v.violationType))
  )
    .map((type) => ({
      type,
      count: violations.filter((v) => v.violationType === type).length,
      totalFine: violations
        .filter((v) => v.violationType === type)
        .reduce((sum, v) => sum + v.fine, 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Traffic Authority Analytics
  const authorityStats = {
    total: trafficAuthorities.length,
    active: trafficAuthorities.filter((a) => a.status === "active").length,
    inactive: trafficAuthorities.filter((a) => a.status === "inactive").length,
    totalEmployees: trafficAuthorities.reduce((sum, a) => sum + a.employees, 0),
  };

  const authoritiesByType = Array.from(
    new Set(trafficAuthorities.map((a) => a.type))
  ).map((type) => ({
    type: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count: trafficAuthorities.filter((a) => a.type === type).length,
    employees: trafficAuthorities
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.employees, 0),
  }));

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subValue,
    trend,
    color = "blue",
  }: any) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl mb-1">{value}</h3>
          {subValue && (
            <p className="text-sm text-muted-foreground">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-950`}>
          <Icon
            className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 mt-4">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {Math.abs(trend)}% so với tháng trước
          </span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="licenses">GPLX</TabsTrigger>
          <TabsTrigger value="students">Thí sinh</TabsTrigger>
          <TabsTrigger value="inspections">Đăng kiểm</TabsTrigger>
          <TabsTrigger value="registrations">Đăng ký xe</TabsTrigger>
          <TabsTrigger value="violations">Vi phạm</TabsTrigger>
          <TabsTrigger value="authorities">Cơ quan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              label="Tổng GPLX"
              value={licenseStats.total.toLocaleString()}
              subValue={`${licenseStats.active} đang hoạt động`}
              trend={12.5}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Thí sinh"
              value={studentStats.total.toLocaleString()}
              subValue={`Tỷ lệ đậu: ${studentStats.passRate}%`}
              trend={8.3}
              color="green"
            />
            <StatCard
              icon={FileCheck}
              label="Giấy đăng kiểm"
              value={inspectionStats.total.toLocaleString()}
              subValue={`${inspectionStats.expired} hết hạn`}
              trend={-3.2}
              color="purple"
            />
            <StatCard
              icon={AlertCircle}
              label="Vi phạm"
              value={violationStats.total.toLocaleString()}
              subValue={`${violationStats.overdue} quá hạn`}
              trend={-15.7}
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Phân bố GPLX theo loại</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={licensesByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) =>
                      `${type}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {licensesByType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Top 10 loại vi phạm</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationsByType.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Phương tiện theo loại</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehiclesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Cơ quan theo loại hình</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={authoritiesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={CheckCircle}
              label="Đang hoạt động"
              value={licenseStats.active.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Hết hạn"
              value={licenseStats.expired.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={Clock}
              label="Tạm ngưng"
              value={licenseStats.suspended.toLocaleString()}
              color="orange"
            />
            <StatCard
              icon={AlertCircle}
              label="Thu hồi"
              value={licenseStats.revoked.toLocaleString()}
              color="gray"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Phân bố GPLX theo loại</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={licensesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">GPLX theo tỉnh thành</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={licensesByCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="city"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="active"
                    fill="#10b981"
                    name="Hoạt động"
                    stackId="a"
                  />
                  <Bar
                    dataKey="expired"
                    fill="#ef4444"
                    name="Hết hạn"
                    stackId="a"
                  />
                  <Bar
                    dataKey="suspended"
                    fill="#f59e0b"
                    name="Tạm ngưng"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Thống kê chi tiết theo loại GPLX</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Loại GPLX</th>
                    <th className="text-right py-3 px-4">Tổng số</th>
                    <th className="text-right py-3 px-4">Hoạt động</th>
                    <th className="text-right py-3 px-4">Hết hạn</th>
                    <th className="text-right py-3 px-4">Tỷ lệ hoạt động</th>
                  </tr>
                </thead>
                <tbody>
                  {licensesByType.map((item) => {
                    const activeCount = licenses.filter(
                      (l) =>
                        l.licenseType === item.type && l.status === "active"
                    ).length;
                    const expiredCount = licenses.filter(
                      (l) =>
                        l.licenseType === item.type && l.status === "expired"
                    ).length;
                    const rate = ((activeCount / item.count) * 100).toFixed(1);
                    return (
                      <tr
                        key={item.type}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <Badge>{item.type}</Badge>
                        </td>
                        <td className="text-right py-3 px-4">{item.count}</td>
                        <td className="text-right py-3 px-4 text-green-600">
                          {activeCount}
                        </td>
                        <td className="text-right py-3 px-4 text-red-600">
                          {expiredCount}
                        </td>
                        <td className="text-right py-3 px-4">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              label="Tổng thí sinh"
              value={studentStats.total.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Đã đậu"
              value={studentStats.passed.toLocaleString()}
              subValue={`${studentStats.passRate}%`}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Không đậu"
              value={studentStats.failed.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={Clock}
              label="Đang chờ"
              value={studentStats.pending.toLocaleString()}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Kết quả thi theo loại GPLX</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={studentsByLicenseType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passed" fill="#10b981" name="Đậu" stackId="a" />
                  <Bar
                    dataKey="failed"
                    fill="#ef4444"
                    name="Trượt"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Tỷ lệ đậu/trượt</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Đậu", value: studentStats.passed },
                      { name: "Trượt", value: studentStats.failed },
                      { name: "Chờ kết quả", value: studentStats.pending },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Chi tiết theo loại GPLX</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Loại GPLX</th>
                    <th className="text-right py-3 px-4">Tổng số</th>
                    <th className="text-right py-3 px-4">Đậu</th>
                    <th className="text-right py-3 px-4">Trượt</th>
                    <th className="text-right py-3 px-4">Tỷ lệ đậu</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsByLicenseType.map((item) => {
                    const rate = ((item.passed / item.total) * 100).toFixed(1);
                    return (
                      <tr
                        key={item.type}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <Badge>{item.type}</Badge>
                        </td>
                        <td className="text-right py-3 px-4">{item.total}</td>
                        <td className="text-right py-3 px-4 text-green-600">
                          {item.passed}
                        </td>
                        <td className="text-right py-3 px-4 text-red-600">
                          {item.failed}
                        </td>
                        <td className="text-right py-3 px-4">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Inspections Tab */}
        <TabsContent value="inspections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FileCheck}
              label="Tổng giấy đăng kiểm"
              value={inspectionStats.total.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Còn hiệu lực"
              value={inspectionStats.valid.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Hết hạn"
              value={inspectionStats.expired.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={Clock}
              label="Chờ xử lý"
              value={inspectionStats.pending.toLocaleString()}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Đăng kiểm theo tỉnh thành</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={inspectionsByCity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="city"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="valid"
                    fill="#10b981"
                    name="Còn hạn"
                    stackId="a"
                  />
                  <Bar
                    dataKey="expired"
                    fill="#ef4444"
                    name="Hết hạn"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Tình trạng giấy đăng kiểm</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Còn hiệu lực", value: inspectionStats.valid },
                      { name: "Hết hạn", value: inspectionStats.expired },
                      { name: "Chờ xử lý", value: inspectionStats.pending },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Registrations Tab */}
        <TabsContent value="registrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={ClipboardList}
              label="Tổng giấy đăng ký"
              value={registrationStats.total.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Đang sử dụng"
              value={registrationStats.active.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={Car}
              label="Đã chuyển nhượng"
              value={registrationStats.transferred.toLocaleString()}
              color="orange"
            />
            <StatCard
              icon={XCircle}
              label="Đã hủy"
              value={registrationStats.cancelled.toLocaleString()}
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Đăng ký xe theo loại</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={registrationsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Trạng thái đăng ký</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Đang sử dụng", value: registrationStats.active },
                      {
                        name: "Đã chuyển nhượng",
                        value: registrationStats.transferred,
                      },
                      { name: "Đã hủy", value: registrationStats.cancelled },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={AlertCircle}
              label="Tổng vi phạm"
              value={violationStats.total.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={CheckCircle}
              label="Đã xử phạt"
              value={violationStats.paid.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={Clock}
              label="Chưa xử phạt"
              value={violationStats.pending.toLocaleString()}
              color="orange"
            />
            <StatCard
              icon={XCircle}
              label="Quá hạn"
              value={violationStats.overdue.toLocaleString()}
              color="gray"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-2">Tổng tiền phạt</h3>
              <p className="text-3xl mb-1">
                {violationStats.totalFines.toLocaleString()} đ
              </p>
              <p className="text-sm text-muted-foreground">
                Đã thu: {violationStats.collectedFines.toLocaleString()} đ (
                {(
                  (violationStats.collectedFines / violationStats.totalFines) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="mb-2">Tỷ lệ xử lý</h3>
              <p className="text-3xl mb-1">
                {((violationStats.paid / violationStats.total) * 100).toFixed(
                  1
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">
                {violationStats.paid}/{violationStats.total} vi phạm đã xử lý
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Top 10 loại vi phạm phổ biến</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  angle={-45}
                  textAnchor="end"
                  height={150}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  fill="#ef4444"
                  name="Số lượng"
                />
                <Bar
                  yAxisId="right"
                  dataKey="totalFine"
                  fill="#f59e0b"
                  name="Tổng tiền phạt"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Chi tiết vi phạm</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Loại vi phạm</th>
                    <th className="text-right py-3 px-4">Số lượng</th>
                    <th className="text-right py-3 px-4">Tổng tiền phạt</th>
                    <th className="text-right py-3 px-4">Trung bình</th>
                  </tr>
                </thead>
                <tbody>
                  {violationsByType.map((item) => (
                    <tr key={item.type} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{item.type}</td>
                      <td className="text-right py-3 px-4">{item.count}</td>
                      <td className="text-right py-3 px-4">
                        {item.totalFine.toLocaleString()} đ
                      </td>
                      <td className="text-right py-3 px-4">
                        {Math.round(
                          item.totalFine / item.count
                        ).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Authorities Tab */}
        <TabsContent value="authorities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Building2}
              label="Tổng cơ quan"
              value={authorityStats.total.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Đang hoạt động"
              value={authorityStats.active.toLocaleString()}
              color="green"
            />
            <StatCard
              icon={XCircle}
              label="Ngừng hoạt động"
              value={authorityStats.inactive.toLocaleString()}
              color="red"
            />
            <StatCard
              icon={Users}
              label="Tổng nhân viên"
              value={authorityStats.totalEmployees.toLocaleString()}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Cơ quan theo loại hình</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={authoritiesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Nhân viên theo loại cơ quan</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={authoritiesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#10b981" name="Nhân viên" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Chi tiết theo loại cơ quan</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Loại cơ quan</th>
                    <th className="text-right py-3 px-4">Số lượng</th>
                    <th className="text-right py-3 px-4">Tổng nhân viên</th>
                    <th className="text-right py-3 px-4">
                      TB nhân viên/cơ quan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {authoritiesByType.map((item) => (
                    <tr key={item.type} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{item.type}</td>
                      <td className="text-right py-3 px-4">{item.count}</td>
                      <td className="text-right py-3 px-4">{item.employees}</td>
                      <td className="text-right py-3 px-4">
                        {Math.round(item.employees / item.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
