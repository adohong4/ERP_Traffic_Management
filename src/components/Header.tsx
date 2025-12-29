import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Menu, Bell, ChevronDown, ChevronRight, Home, LogOut } from "lucide-react";
import { toast } from "sonner";
import { PermissionBadge } from "./PermissionBadge";
import { usePermissions } from "../context/PermissionsContext";
import { useBreadcrumb } from "./BreadcrumbContext";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component: any;
}

interface HeaderProps {
  menuItems: MenuItem[];
  activeMenu: string;
  unreadCount: number;
  isConnected: boolean;
  address?: string;
  onMenuToggle: () => void;
  onNotificationsOpen: () => void;
  onLogout: () => void;
}

export default function Header({
  menuItems,
  activeMenu,
  unreadCount,
  isConnected,
  address,
  onMenuToggle,
  onNotificationsOpen,
  onLogout,
}: HeaderProps) {
  const { breadcrumbs } = useBreadcrumb();
  const { userConfig } = usePermissions();

  const copyAddress = () => {
    if (!address) return;

    const textArea = document.createElement("textarea");
    textArea.value = address;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Đã copy địa chỉ wallet!");
    } catch (err) {
      toast.error("Không thể copy địa chỉ");
    }
    document.body.removeChild(textArea);
  };

  return (
    <header
      className="border-b border-cyan-200/60 px-6 py-4 bg-white/80 backdrop-blur-xl"
      style={{
        boxShadow: "0 2px 10px rgba(6, 182, 212, 0.08)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-700 hover:text-cyan-600 hover:bg-cyan-50"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            {breadcrumbs.length > 0 ? (
              <Breadcrumb>
                <BreadcrumbList className="text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && (
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </BreadcrumbSeparator>
                      )}
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="text-foreground font-semibold">
                            {crumb.isHome ? (
                              <Home className="h-4 w-4" />
                            ) : (
                              crumb.label
                            )}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            onClick={crumb.onClick}
                            className="cursor-pointer hover:text-primary text-muted-foreground hover:underline flex items-center transition-colors"
                          >
                            {crumb.isHome ? (
                              <Home className="h-4 w-4" />
                            ) : (
                              crumb.label
                            )}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                    {menuItems.find((item) => item.id === activeMenu)?.label}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Hệ thống quản lý thông tin giao thông
                  </p>
                </div>
                {userConfig && <PermissionBadge />}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
            onClick={onNotificationsOpen}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] items-center justify-center text-white shadow-lg shadow-cyan-500/50">
                  {unreadCount}
                </span>
              </span>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 text-slate-700 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
              >
                <Avatar className="h-8 w-8 ring-2 ring-cyan-400/60">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    {isConnected && address
                      ? address.slice(0, 2).toUpperCase()
                      : "QT"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm text-slate-900">
                    {isConnected && address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : "Quản trị viên"}
                  </div>
                  <div className="text-xs text-slate-600">
                    {isConnected
                      ? "Đang kết nối ví"
                      : "admin@conganbonganh.gov.vn"}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              {isConnected && address && (
                <>
                  <div className="px-2 py-2 text-xs">
                    <div className="font-medium text-slate-900 mb-1">
                      Địa chỉ Wallet
                    </div>
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-2 rounded border border-cyan-200">
                      <code className="text-xs break-all text-cyan-700">
                        {address}
                      </code>
                    </div>
                    <button
                      onClick={copyAddress}
                      className="text-xs text-cyan-600 hover:text-cyan-700 mt-1"
                    >
                      📋 Copy địa chỉ
                    </button>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
