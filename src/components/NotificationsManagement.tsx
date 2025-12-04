import { useState } from "react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Mail,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import ModernDataTable, { ColumnDef, FilterConfig } from "./ModernDataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  targetAudience:
    | "all"
    | "license_holders"
    | "vehicle_owners"
    | "violators"
    | "students";
  status: "draft" | "sent" | "scheduled";
  createdDate: string;
  sentDate?: string;
  recipientCount: number;
  readCount: number;
  createdBy: string;
}

// Mock data
const mockNotifications: NotificationRecord[] = [
  {
    id: "NTF00001",
    title: "Thông báo gia hạn GPLX",
    message:
      "Kính gửi quý khách, GPLX của bạn sắp hết hạn. Vui lòng đến cơ quan CSGT để làm thủ tục gia hạn.",
    type: "warning",
    targetAudience: "license_holders",
    status: "sent",
    createdDate: "2024-10-20",
    sentDate: "2024-10-20",
    recipientCount: 245,
    readCount: 189,
    createdBy: "Admin",
  },
  {
    id: "NTF00002",
    title: "Nhắc nhở đăng kiểm phương tiện",
    message:
      "Phương tiện của bạn đã đến hạn đăng kiểm. Vui lòng liên hệ trung tâm đăng kiểm gần nhất.",
    type: "warning",
    targetAudience: "vehicle_owners",
    status: "sent",
    createdDate: "2024-10-18",
    sentDate: "2024-10-18",
    recipientCount: 156,
    readCount: 142,
    createdBy: "Admin",
  },
  {
    id: "NTF00003",
    title: "Cập nhật chính sách mới",
    message:
      "Bộ GTVT vừa ban hành quy định mới về quản lý GPLX. Vui lòng xem chi tiết tại website.",
    type: "info",
    targetAudience: "all",
    status: "sent",
    createdDate: "2024-10-15",
    sentDate: "2024-10-15",
    recipientCount: 1250,
    readCount: 980,
    createdBy: "Admin",
  },
  {
    id: "NTF00004",
    title: "Thông báo kết quả sát hạch",
    message:
      "Kết quả kỳ sát hạch ngày 25/10/2024 đã được công bố. Vui lòng kiểm tra kết quả của bạn.",
    type: "success",
    targetAudience: "students",
    status: "draft",
    createdDate: "2024-10-25",
    recipientCount: 0,
    readCount: 0,
    createdBy: "Admin",
  },
  {
    id: "NTF00005",
    title: "Cảnh báo vi phạm nghiêm trọng",
    message:
      "Bạn có vi phạm giao thông chưa được xử lý. Vui lòng đến cơ quan CSGT để giải quyết.",
    type: "error",
    targetAudience: "violators",
    status: "sent",
    createdDate: "2024-10-22",
    sentDate: "2024-10-22",
    recipientCount: 78,
    readCount: 45,
    createdBy: "Admin",
  },
];

const typeConfig = {
  info: { label: "Thông tin", color: "bg-blue-500", icon: Info },
  warning: { label: "Cảnh báo", color: "bg-yellow-500", icon: AlertTriangle },
  success: { label: "Thành công", color: "bg-green-500", icon: CheckCircle },
  error: { label: "Lỗi", color: "bg-red-500", icon: XCircle },
};

const statusConfig = {
  draft: { label: "Nháp", color: "bg-gray-500" },
  sent: { label: "Đã gửi", color: "bg-green-500" },
  scheduled: { label: "Đã lên lịch", color: "bg-blue-500" },
};

const audienceConfig = {
  all: "Tất cả người dùng",
  license_holders: "Chủ GPLX",
  vehicle_owners: "Chủ phương tiện",
  violators: "Người vi phạm",
  students: "Thí sinh",
};

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationRecord | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "add" | "edit">(
    "list"
  );
  const [formData, setFormData] = useState<Partial<NotificationRecord>>({
    type: "info",
    targetAudience: "all",
    status: "draft",
  });

  const handleCreate = () => {
    setFormData({ type: "info", targetAudience: "all", status: "draft" });
    setViewMode("add");
  };

  const columns: ColumnDef<NotificationRecord>[] = [
    {
      key: "id",
      header: "Mã",
      width: "90px",
      sortable: true,
      render: (item) => <span className="font-mono text-xs">{item.id}</span>,
    },
    {
      key: "title",
      header: "Tiêu đề",
      width: "280px",
      sortable: true,
      render: (item) => (
        <div className="text-left">
          <div
            className="font-medium truncate max-w-[200px]"
            title={item.title}
          >
            {item.title}
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Nội dung",
      width: "280px",
      render: (item) => (
        <div
          className="text-xs text-muted-foreground truncate max-w-[280px]"
          title={item.message}
        >
          {item.message}
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      width: "150px",
      sortable: true,
      render: (item) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;
        return (
          <Badge
            className={`${config.color} text-white flex items-center gap-1 w-fit`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "targetAudience",
      header: "Đối tượng",
      width: "150px",
      render: (item) => (
        <span className="text-xs">{audienceConfig[item.targetAudience]}</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "150px",
      sortable: true,
      render: (item) => (
        <Badge
          className={`${statusConfig[item.status].color} text-white text-xs`}
        >
          {statusConfig[item.status].label}
        </Badge>
      ),
    },
    {
      key: "recipientCount",
      header: "Gửi",
      width: "100px",
      sortable: true,
      render: (item) => (
        <span className="text-center block text-sm">{item.recipientCount}</span>
      ),
    },
    {
      key: "readCount",
      header: "Đọc",
      width: "100px",
      sortable: true,
      render: (item) => (
        <div className="text-center">
          <div className="text-sm">{item.readCount}</div>
          {item.recipientCount > 0 && (
            <div className="text-xs text-muted-foreground">
              ({Math.round((item.readCount / item.recipientCount) * 100)}%)
            </div>
          )}
        </div>
      ),
    },
    {
      key: "createdDate",
      header: "Ngày tạo",
      width: "150px",
      sortable: true,
      render: (item) => (
        <span className="text-xs">
          {new Date(item.createdDate).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      width: "150px",
      render: (item) => (
        <div className="flex gap-1 justify-center">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setSelectedNotification(item);
                    setViewMode("detail");
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>

          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setSelectedNotification(item);
                    setFormData(item);
                    setViewMode("edit");
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>

          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
      ),
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "type",
      label: "Loại thông báo",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "info", label: "Thông tin" },
        { value: "warning", label: "Cảnh báo" },
        { value: "success", label: "Thành công" },
        { value: "error", label: "Lỗi" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "draft", label: "Nháp" },
        { value: "sent", label: "Đã gửi" },
        { value: "scheduled", label: "Đã lên lịch" },
      ],
    },
    {
      key: "targetAudience",
      label: "Đối tượng",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "license_holders", label: "Chủ GPLX" },
        { value: "vehicle_owners", label: "Chủ phương tiện" },
        { value: "violators", label: "Người vi phạm" },
        { value: "students", label: "Thí sinh" },
      ],
    },
  ];

  if (viewMode === "detail" && selectedNotification) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2">Chi tiết thông báo</h2>
            <p className="text-muted-foreground">
              Xem thông tin chi tiết thông báo
            </p>
          </div>
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Quay lại
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = typeConfig[selectedNotification.type].icon;
                return <Icon className="h-5 w-5" />;
              })()}
              {selectedNotification.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Mã thông báo</Label>
                <p className="font-mono">{selectedNotification.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Loại</Label>
                <div className="mt-1">
                  <Badge
                    className={`${typeConfig[selectedNotification.type].color} text-white`}
                  >
                    {typeConfig[selectedNotification.type].label}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Đối tượng nhận</Label>
                <p>{audienceConfig[selectedNotification.targetAudience]}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Trạng thái</Label>
                <div className="mt-1">
                  <Badge
                    className={`${statusConfig[selectedNotification.status].color} text-white`}
                  >
                    {statusConfig[selectedNotification.status].label}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Ngày tạo</Label>
                <p>
                  {new Date(selectedNotification.createdDate).toLocaleString(
                    "vi-VN"
                  )}
                </p>
              </div>
              {selectedNotification.sentDate && (
                <div>
                  <Label className="text-muted-foreground">Ngày gửi</Label>
                  <p>
                    {new Date(selectedNotification.sentDate).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Số người nhận</Label>
                <p>{selectedNotification.recipientCount}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Đã đọc</Label>
                <p>
                  {selectedNotification.readCount}
                  {selectedNotification.recipientCount > 0 &&
                    ` (${Math.round((selectedNotification.readCount / selectedNotification.recipientCount) * 100)}%)`}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Người tạo</Label>
                <p>{selectedNotification.createdBy}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Nội dung</Label>
              <p className="mt-2 p-4 bg-muted rounded-lg">
                {selectedNotification.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === "add" || viewMode === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2">
              {viewMode === "add" ? "Tạo thông báo mới" : "Chỉnh sửa thông báo"}
            </h2>
            <p className="text-muted-foreground">
              {viewMode === "add"
                ? "Nhập thông tin thông báo"
                : "Cập nhật thông tin thông báo"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Hủy
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tiêu đề *</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề thông báo"
                />
              </div>
              <div className="col-span-2">
                <Label>Nội dung *</Label>
                <Textarea
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Nhập nội dung thông báo"
                  rows={5}
                />
              </div>
              <div>
                <Label>Loại thông báo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Thông tin</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="error">Lỗi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Đối tượng nhận</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, targetAudience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả người dùng</SelectItem>
                    <SelectItem value="license_holders">Chủ GPLX</SelectItem>
                    <SelectItem value="vehicle_owners">
                      Chủ phương tiện
                    </SelectItem>
                    <SelectItem value="violators">Người vi phạm</SelectItem>
                    <SelectItem value="students">Thí sinh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setViewMode("list")}>
                Hủy
              </Button>
              <Button onClick={() => setViewMode("list")}>
                <Mail className="h-4 w-4 mr-2" />
                Lưu nháp
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModernDataTable
        data={notifications}
        columns={columns}
        title="Danh sách thông báo"
        searchPlaceholder="Tìm kiếm theo tiêu đề, nội dung..."
        searchKeys={["title", "message", "id"]}
        filters={filters}
        getItemKey={(item) => item.id}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        }
      />
    </div>
  );
}
