import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, FileText, Car, AlertCircle, TrendingUp, Award, Building2, CheckCircle, Activity } from 'lucide-react';
import { dashboardStats, chartData } from '../lib/mockData';
import StatCard from './StatCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// Generate mini chart data
const generateMiniChartData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 20
  }));
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        {/* Title removed - already in navbar */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng số GPLX"
          value={dashboardStats.totalLicenses}
          subtitle="24,635 người tăng từ tháng trước"
          icon={FileText}
          color="blue"
          trend={{ value: 2, isPositive: true }}
          chartData={generateMiniChartData(20)}
          chartType="line"
          delay={0}
        />
        <StatCard
          title="Phương tiện đăng ký"
          value={dashboardStats.totalVehicles}
          subtitle="Tổng phương tiện trong hệ thống"
          icon={Car}
          color="purple"
          trend={{ value: 1, isPositive: false }}
          progress={78}
          delay={0.1}
        />
        <StatCard
          title="Vi phạm trong tháng"
          value={dashboardStats.totalViolations}
          subtitle="Giảm so với tháng trước"
          icon={AlertCircle}
          color="red"
          trend={{ value: 12, isPositive: false }}
          chartData={generateMiniChartData(15)}
          chartType="bar"
          delay={0.2}
        />
        <StatCard
          title="Cơ sở sát hạch"
          value={dashboardStats.totalFacilities}
          subtitle="Trung tâm trên toàn quốc"
          icon={Building2}
          color="orange"
          variant="gradient"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Thí sinh tháng này"
          value={dashboardStats.studentsThisMonth}
          subtitle="Đã đăng ký thi sát hạch"
          icon={Users}
          color="cyan"
          trend={{ value: 5, isPositive: true }}
          chartData={generateMiniChartData(12)}
          chartType="bar"
          delay={0.4}
        />
        <StatCard
          title="Tỷ lệ đỗ trung bình"
          value={`${dashboardStats.passRate}%`}
          subtitle="Tăng 4% so với quý trước"
          icon={Award}
          color="green"
          trend={{ value: 4, isPositive: true }}
          progress={dashboardStats.passRate}
          delay={0.5}
        />
        <StatCard
          title="Đăng kiểm chờ xử lý"
          value={dashboardStats.pendingInspections}
          subtitle="Cần xử lý trong tuần"
          icon={CheckCircle}
          color="amber"
          trend={{ value: 5, isPositive: false }}
          delay={0.6}
        />
        <StatCard
          title="GPLX cấp mới"
          value={dashboardStats.newLicenses}
          subtitle="Trong tháng này"
          icon={TrendingUp}
          color="emerald"
          variant="gradient"
          chartData={generateMiniChartData(20)}
          chartType="line"
          delay={0.7}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Thống kê thi sát hạch theo tháng
              </CardTitle>
              <CardDescription>Số lượng thí sinh và tỷ lệ đỗ</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.monthlyExams}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="Thí sinh" strokeWidth={2} />
                  <Area type="monotone" dataKey="passed" stroke="#10b981" fillOpacity={1} fill="url(#colorPassed)" name="Đỗ" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl ring-1 ring-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Phân bố GPLX theo hạng
              </CardTitle>
              <CardDescription>Tổng số GPLX hiện có</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.licensesByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="count" name="Số lượng" radius={[8, 8, 0, 0]}>
                    {chartData.licensesByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl ring-1 ring-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Vi phạm giao thông theo loại
            </CardTitle>
            <CardDescription>Thống kê vi phạm trong tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.violationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: ${entry.count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    paddingAngle={3}
                  >
                    {chartData.violationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}