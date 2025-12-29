import { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { trafficAuthorities, type TrafficAuthority } from "../lib/mockData";
import AuthorityDetailPage from "@/components/authorityUI/AuthorityDetailPage";
import AuthorityAddEdit from "@/components/authorityUI/AuthorityAddEdit";
import ModernDataTable, { ColumnDef, FilterConfig } from "./ModernDataTable";
import StatCard from "./StatCard";
import { toast } from "sonner";

const authorityTypeLabels: Record<string, string> = {
  police_department: "Phòng CSGT",
  inspection_center: "Trung tâm đăng kiểm",
  exam_center: "Trung tâm sát hạch",
  registration_office: "Phòng đăng ký xe",
};

const typeColors: Record<string, string> = {
  police_department: "bg-blue-50 text-blue-700 border-blue-200",
  inspection_center: "bg-green-50 text-green-700 border-green-200",
  exam_center: "bg-purple-50 text-purple-700 border-purple-200",
  registration_office: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function TrafficAuthoritiesManagement() {
  const [selectedAuthority, setSelectedAuthority] =
    useState<TrafficAuthority | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "add" | "edit">(
    "list"
  );

  const cities = Array.from(new Set(trafficAuthorities.map((a) => a.city)));
  const types = Array.from(new Set(trafficAuthorities.map((a) => a.type)));

  const handleAddAuthors = () => {
    setViewMode("add");
  };

  // Stats
  const stats = {
    total: trafficAuthorities.length,
    active: trafficAuthorities.filter((a) => a.status === "active").length,
    inactive: trafficAuthorities.filter((a) => a.status === "inactive").length,
    totalEmployees: trafficAuthorities.reduce((sum, a) => sum + a.employees, 0),
  };

  // View modes
  if (viewMode === "detail" && selectedAuthority) {
    return (
      <AuthorityDetailPage
        authority={selectedAuthority}
        onBack={() => {
          setViewMode("list");
          setSelectedAuthority(null);
        }}
        onEdit={() => setViewMode("edit")}
      />
    );
  }

  if (viewMode === "edit" && selectedAuthority) {
    return (
      <AuthorityAddEdit
        authority={selectedAuthority}
        onBack={() => setViewMode("detail")}
        onSave={(data) => {
          console.log("Saving authority:", data);
          setViewMode("detail");
        }}
      />
    );
  }

  if (viewMode === "add") {
    return (
      <AuthorityAddEdit
        onBack={() => setViewMode("list")}
        onSave={(data) => {
          console.log("Adding authority:", data);
          setViewMode("list");
        }}
      />
    );
  }

  // Define columns
  const columns: ColumnDef<TrafficAuthority>[] = [
    {
      key: "stt",
      header: "STT",
      width: "60px",
      render: (_, index) => <span className="text-sm">{index + 1}</span>,
    },
    {
      key: "code",
      header: "Mã cơ quan",
      sortable: true,
      width: "130px",
      render: (auth) => (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 font-mono"
        >
          {auth.code}
        </Badge>
      ),
    },
    {
      key: "name",
      header: "Tên cơ quan",
      sortable: true,
      width: "220px",
      render: (auth) => (
        <div className="flex items-center gap-2 text-left w-full">
          <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm truncate" title={auth.name}>
            {auth.name}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại hình",
      sortable: true,
      width: "170px",
      render: (auth) => (
        <Badge variant="outline" className={typeColors[auth.type]}>
          {authorityTypeLabels[auth.type]}
        </Badge>
      ),
    },
    {
      key: "city",
      header: "Thành phố",
      sortable: true,
      width: "120px",
      render: (auth) => (
        <span className="text-sm truncate" title={auth.city}>
          {auth.city}
        </span>
      ),
    },
    {
      key: "address",
      header: "Địa chỉ",
      width: "180px",
      render: (auth) => (
        <div className="flex items-start gap-2 text-left w-full">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span
            className="text-sm text-muted-foreground truncate"
            title={auth.address}
          >
            {auth.address}
          </span>
        </div>
      ),
    },
    {
      key: "director",
      header: "Giám đốc",
      sortable: true,
      width: "150px",
      render: (auth) => (
        <span className="text-sm truncate" title={auth.director}>
          {auth.director}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Điện thoại",
      width: "120px",
      render: (auth) => (
        <div className="flex items-center gap-2 text-left w-full">
          <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-mono">{auth.phone}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      width: "220px",
      render: (auth) => (
        <div className="flex items-center gap-2 text-left w-full">
          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span
            className="text-xs text-muted-foreground truncate"
            title={auth.email}
          >
            {auth.email}
          </span>
        </div>
      ),
    },
    {
      key: "employees",
      header: "Nhân viên",
      sortable: true,
      width: "100px",
      render: (auth) => (
        <div className="flex items-center gap-2 justify-center">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{auth.employees}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      width: "130px",
      render: (auth) => (
        <Badge
          className={
            auth.status === "active"
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }
        >
          {auth.status === "active" ? "Hoạt động" : "Tạm ngừng"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      width: "150px",
      render: (auth) => (
        <div className="flex justify-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedAuthority(auth);
                    setViewMode("detail");
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => {
                    setSelectedAuthority(auth);
                    setViewMode("edit");
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={() => toast.success("Đã xóa cơ quan thành công!")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  // Define filters
  const filters: FilterConfig[] = [
    {
      key: "type",
      label: "Loại hình",
      options: [
        { value: "all", label: "Tất cả" },
        ...types.map((type) => ({
          value: type,
          label: authorityTypeLabels[type],
        })),
      ],
    },
    {
      key: "city",
      label: "Thành phố",
      options: [
        { value: "all", label: "Tất cả" },
        ...cities.map((city) => ({ value: city, label: city })),
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Ngừng hoạt động" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Tổng cơ quan"
          value={stats.total}
          subtitle="Đơn vị quản lý"
          icon={Building2}
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Đang hoạt động"
          value={stats.active}
          subtitle={`${Math.round((stats.active / stats.total) * 100)}% tổng số`}
          icon={CheckCircle}
          color="green"
          progress={Math.round((stats.active / stats.total) * 100)}
          delay={0.15}
        />
        <StatCard
          title="Ngừng hoạt động"
          value={stats.inactive}
          subtitle="Cơ quan tạm ngừng"
          icon={XCircle}
          color="slate"
          delay={0.2}
        />
        <StatCard
          title="Tổng nhân viên"
          value={stats.totalEmployees}
          subtitle={`TB ${Math.round(stats.totalEmployees / stats.total)} NV/đơn vị`}
          icon={Users}
          color="purple"
          trend={{ value: 12, isPositive: true }}
          delay={0.25}
        />
      </div>

      {/* Modern Data Table */}
      <div>
        <ModernDataTable
          data={trafficAuthorities}
          columns={columns}
          title="Danh sách cơ quan giao thông"
          searchPlaceholder="Tìm kiếm theo tên, mã cơ quan..."
          searchKeys={["name", "code", "director", "city"]}
          filters={filters}
          getItemKey={(auth) => auth.id}
          onExport={() => console.log("Exporting authorities...")}
          actions={
            <Button onClick={handleAddAuthors}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm cơ quan
            </Button>
          }
        />

        {/* Action Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200"
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
