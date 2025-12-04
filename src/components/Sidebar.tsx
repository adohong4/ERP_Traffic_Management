import { motion } from "motion/react";
import { Button } from "./ui/button";
import { FileText, ChevronRight, X } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component: any;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  sidebarCollapsed: boolean;
  isDesktop: boolean;
  onMenuClick: (menuId: string) => void;
  onToggleCollapse: () => void;
  onClose: () => void;
}

export default function Sidebar({
  menuItems,
  activeMenu,
  sidebarCollapsed,
  isDesktop,
  onMenuClick,
  onToggleCollapse,
  onClose,
}: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{
        x: 0,
        width: sidebarCollapsed ? "80px" : "256px",
      }}
      exit={{ x: -300 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed md:static inset-y-0 left-0 z-50 border-r border-cyan-400/20 flex flex-col shadow-2xl shadow-cyan-500/20"
      style={{
        background:
          "linear-gradient(180deg, #0a1929 0%, #0d2438 50%, #0a1929 100%)",
        boxShadow:
          "0 0 40px rgba(34, 211, 238, 0.2), inset 0 0 60px rgba(34, 211, 238, 0.05)",
      }}
    >
      {/* Logo + Collapse Toggle */}
      <div className="p-6 border-b border-cyan-400/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          {!sidebarCollapsed ? (
            <>
              <div className="flex-1">
                <h1 className="text-xl bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent font-bold">
                  Bộ Công an
                </h1>
                <p className="text-xs text-cyan-300/70 mt-1">
                  Quản lý thông tin
                </p>
              </div>
              {/* Collapse button - same row */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden md:flex text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all flex-shrink-0"
              >
                <motion.div
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {/* Collapse button when collapsed */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden md:flex text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all"
              >
                <motion.div
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </div>
          )}
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-cyan-300 hover:text-white hover:bg-cyan-500/20 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onMenuClick(item.id)}
              className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 rounded-xl transition-all relative group ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/50"
                  : "text-cyan-200 hover:bg-cyan-500/10 hover:text-white"
              }`}
              title={sidebarCollapsed ? item.label : ""}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
                  style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.6)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`h-5 w-5 relative z-10 ${isActive ? "drop-shadow-lg" : ""}`}
              />
              {!sidebarCollapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
              {!isActive && !sidebarCollapsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
