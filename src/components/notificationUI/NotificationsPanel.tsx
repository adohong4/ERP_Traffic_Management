import { motion } from 'motion/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { notifications, Notification } from '@/lib/mockData';

const notificationIcons = {
  info: { icon: Info, color: 'text-blue-500 bg-blue-100' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-100' },
  success: { icon: CheckCircle, color: 'text-green-500 bg-green-100' },
  error: { icon: X, color: 'text-red-500 bg-red-100' }
};

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} mới</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Cập nhật mới nhất về hệ thống
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const config = notificationIcons[notification.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/50'
                    } hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-full ${config.color} h-fit`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getTimeAgo(notification.date)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <Button variant="outline" className="w-full">
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
