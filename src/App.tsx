import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmiConfig';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Car,
  AlertCircle,
  BarChart3,
  Building2,
  Newspaper,
  Mail,
  Trash2,
  Settings as SettingsIcon
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { PermissionsProvider } from './context/PermissionsContext';
import { BreadcrumbProvider, useBreadcrumb } from './components/BreadcrumbContext';
import { usePermissions } from './context/PermissionsContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LicenseManagement from './components/LicensesUI/LicenseManagement';
import VehicleManagement from './components/VehicleManagement';
import ViolationsManagement from './components/ViolationsManagement';
import ReportsAnalytics from './components/ReportsAnalytics';
import TrafficAuthoritiesManagement from './components/TrafficAuthoritiesManagement';
import NewsManagement from './components/NewsManagement';
import NotificationsManagement from './components/NotificationsManagement';
import TrashBin from './components/TrashBin';
import Settings from './components/Settings';
import NotificationsPanel from './components/NotificationsPanel';
import { notifications } from './lib/mockData';
import authService from './services/authService';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  component: any;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, component: Dashboard },
  { id: 'licenses', label: 'Quản lý GPLX', icon: FileText, component: LicenseManagement },
  { id: 'vehicles', label: 'Phương tiện', icon: Car, component: VehicleManagement },
  { id: 'violations', label: 'Vi phạm', icon: AlertCircle, component: ViolationsManagement },
  { id: 'reports', label: 'Báo cáo & Phân tích', icon: BarChart3, component: ReportsAnalytics },
  { id: 'authorities', label: 'Cơ quan giao thông', icon: Building2, component: TrafficAuthoritiesManagement },
  { id: 'news', label: 'Đăng tin tức', icon: Newspaper, component: NewsManagement },
  { id: 'notifications-mgmt', label: 'Quản lý thông báo', icon: Mail, component: NotificationsManagement },
  { id: 'trash', label: 'Thùng rác', icon: Trash2, component: TrashBin },
  { id: 'settings', label: 'Cài đặt', icon: SettingsIcon, component: Settings },
];

function AppContent() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { breadcrumbs } = useBreadcrumb();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { canAccessMenuItem, userConfig } = usePermissions();

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => canAccessMenuItem(item.id));

  const ActiveComponent = filteredMenuItems.find(item => item.id === activeMenu)?.component || Dashboard;
  const unreadCount = notifications.filter(n => !n.read).length;

  // Remove dark class on mount and handle responsive
  useEffect(() => {
    document.documentElement.classList.remove('dark');

    // Check if user is logged in (from localStorage)
    const loggedIn = localStorage.getItem('erp_logged_in') === 'true';
    setIsLoggedIn(loggedIn);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('erp_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await authService.logout()
    setIsLoggedIn(false);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || isDesktop) && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && !isDesktop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <Sidebar
              menuItems={filteredMenuItems}
              activeMenu={activeMenu}
              sidebarCollapsed={sidebarCollapsed}
              isDesktop={isDesktop}
              onMenuClick={(menuId) => {
                setActiveMenu(menuId);
                setSidebarOpen(false);
              }}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <Header
          menuItems={menuItems}
          activeMenu={activeMenu}
          unreadCount={unreadCount}
          isConnected={isConnected}
          address={address}
          onMenuToggle={() => setSidebarOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen(true)}
          onLogout={handleLogout}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Background effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl"></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PermissionsProvider>
          <BreadcrumbProvider>
            <AppContent />
            <Toaster position="top-right" richColors />
          </BreadcrumbProvider>
        </PermissionsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}