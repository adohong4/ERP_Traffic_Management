import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Key,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { useBreadcrumb } from "./BreadcrumbContext";

export default function Settings() {
  const { setBreadcrumbs, resetBreadcrumbs } = useBreadcrumb();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    violations: true,
    expiryReminders: true,
    inspectionReminders: true,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Trang chính", isHome: true },
      { label: "Cài đặt" },
    ]);

    return () => {
      resetBreadcrumbs();
    };
  }, [setBreadcrumbs, resetBreadcrumbs]);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          <div>
            <h2 className="text-3xl">Cài đặt hệ thống</h2>
            <p className="text-muted-foreground mt-1">
              Quản lý cấu hình và tùy chỉnh hệ thống QLTT
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Tài khoản
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Giao diện
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="mr-2 h-4 w-4" />
              Hệ thống
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" defaultValue="Quản trị viên" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input id="username" defaultValue="admin" disabled />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-8"
                        defaultValue="admin@conganbonganh.gov.vn"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-8"
                        defaultValue="0912345678"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <div className="relative">
                    <Building2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      className="pl-8"
                      defaultValue="Phòng CSGT Hà Nội"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger id="position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="manager">Quản lý</SelectItem>
                      <SelectItem value="officer">Cán bộ</SelectItem>
                      <SelectItem value="viewer">Xem thông tin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>
                  Quản lý cách bạn nhận thông báo từ hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Kênh thông báo</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo qua email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(value) =>
                          handleNotificationChange("email", value)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo qua tin nhắn SMS
                        </p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(value) =>
                          handleNotificationChange("sms", value)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notification</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo đẩy trên trình duyệt
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(value) =>
                          handleNotificationChange("push", value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Loại thông báo</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Vi phạm giao thông mới</Label>
                        <p className="text-sm text-muted-foreground">
                          Thông báo khi có vi phạm mới được ghi nhận
                        </p>
                      </div>
                      <Switch
                        checked={notifications.violations}
                        onCheckedChange={(value) =>
                          handleNotificationChange("violations", value)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Nhắc nhở GPLX hết hạn</Label>
                        <p className="text-sm text-muted-foreground">
                          Thông báo trước khi GPLX sắp hết hạn
                        </p>
                      </div>
                      <Switch
                        checked={notifications.expiryReminders}
                        onCheckedChange={(value) =>
                          handleNotificationChange("expiryReminders", value)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Nhắc nhở đăng kiểm</Label>
                        <p className="text-sm text-muted-foreground">
                          Thông báo khi xe sắp đến hạn đăng kiểm
                        </p>
                      </div>
                      <Switch
                        checked={notifications.inspectionReminders}
                        onCheckedChange={(value) =>
                          handleNotificationChange("inspectionReminders", value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu cài đặt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu và cài đặt bảo mật
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type="password"
                      className="pl-8"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      className="pl-8"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-8"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="font-medium">Xác thực hai yếu tố (2FA)</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bật xác thực hai yếu tố</Label>
                      <p className="text-sm text-muted-foreground">
                        Tăng cường bảo mật với mã xác thực OTP
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h4 className="font-medium">Phiên đăng nhập</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tự động đăng xuất</Label>
                      <p className="text-sm text-muted-foreground">
                        Đăng xuất sau khoảng thời gian không hoạt động
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Thời gian timeout (phút)
                    </Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="sessionTimeout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 phút</SelectItem>
                        <SelectItem value="30">30 phút</SelectItem>
                        <SelectItem value="60">60 phút</SelectItem>
                        <SelectItem value="120">120 phút</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Cập nhật bảo mật
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Giao diện</CardTitle>
                <CardDescription>Tùy chỉnh giao diện hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Chủ đề</Label>
                  <Select defaultValue="light">
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="system">Theo hệ thống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select defaultValue="vi">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Định dạng ngày</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select defaultValue="utc+7">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc+7">
                        GMT+7 (Giờ Việt Nam)
                      </SelectItem>
                      <SelectItem value="utc+0">GMT+0 (UTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hiệu ứng chuyển động</Label>
                    <p className="text-sm text-muted-foreground">
                      Bật/tắt animation trong giao diện
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <Separator className="my-4" />

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu cài đặt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>
                  Quản lý cấu hình hệ thống và dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Sao lưu và phục hồi</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tự động sao lưu</Label>
                      <p className="text-sm text-muted-foreground">
                        Tự động sao lưu dữ liệu hệ thống
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Tần suất sao lưu</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backupFrequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Mỗi giờ</SelectItem>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Sao lưu ngay
                    </Button>
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Phục hồi dữ liệu
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Giới hạn hiệu suất</h4>
                  <div className="space-y-2">
                    <Label htmlFor="itemsPerPage">Số bản ghi mỗi trang</Label>
                    <Select defaultValue="15">
                      <SelectTrigger id="itemsPerPage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Bảo trì hệ thống</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chế độ bảo trì</Label>
                      <p className="text-sm text-muted-foreground">
                        Tạm ngừng truy cập để bảo trì
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <Button variant="outline" className="w-full">
                    Xóa bộ nhớ cache
                  </Button>
                </div>

                <Separator className="my-4" />

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu cài đặt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
