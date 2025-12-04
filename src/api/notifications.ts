// Notification API endpoints with mock responses

import type {
  Notification,
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkNotificationReadBody,
  MarkNotificationReadResponse,
  CreateNotificationBody,
  CreateNotificationResponse,
  ApiError
} from './types';

// Helper functions
const createResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

const createError = (code: string, message: string, details?: any): ApiError => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date().toISOString()
});

const paginate = <T>(items: T[], page: number = 1, limit: number = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    items: paginatedItems,
    pagination: { page, limit, total, totalPages }
  };
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_1',
    walletAddress: '0x335145400C12958600C0542F9180e03B917F7BbB',
    title: 'GPLX sắp hết hạn',
    message: 'Giấy phép lái xe GPLX12345678 của bạn sẽ hết hạn vào 30 ngày tới. Vui lòng đến cơ quan có thẩm quyền để gia hạn.',
    type: 'license_expiry',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    relatedId: 'lic_1',
    relatedType: 'license',
    actionUrl: '/licenses/lic_1'
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    walletAddress: '0x335145400C12958600C0542F9180e03B917F7BbB',
    title: 'Đăng kiểm xe sắp đến hạn',
    message: 'Xe biển số 29A-12345 cần đăng kiểm trong vòng 15 ngày tới.',
    type: 'inspection_due',
    priority: 'medium',
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedId: 'veh_1',
    relatedType: 'vehicle',
    actionUrl: '/vehicles/veh_1'
  },
  {
    id: 'notif_3',
    userId: 'user_2',
    walletAddress: '0xE083813Ddd4A50ACA941db0ddcDdF10C5A9aee04',
    title: 'Vi phạm giao thông mới',
    message: 'Bạn có vi phạm mới: Vượt đèn đỏ tại ngã tư Láng Hạ - Huỳnh Thúc Kháng. Phạt: 1,500,000 VNĐ',
    type: 'violation',
    priority: 'urgent',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    relatedId: 'vio_1',
    relatedType: 'violation',
    actionUrl: '/violations/vio_1'
  }
];

/**
 * GET /api/notifications
 * Get list of notifications with filters and pagination
 */
export const getNotifications = async (params: GetNotificationsParams = {}): Promise<GetNotificationsResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      walletAddress,
      type,
      priority,
      read
    } = params;

    // Filter notifications
    let filtered = [...mockNotifications];

    if (walletAddress) {
      filtered = filtered.filter(n => n.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    }

    if (type) {
      filtered = filtered.filter(n => n.type === type);
    }

    if (priority) {
      filtered = filtered.filter(n => n.priority === priority);
    }

    if (read !== undefined) {
      filtered = filtered.filter(n => n.read === read);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Paginate
    const paginatedData = paginate(filtered, page, limit);

    return createResponse(paginatedData);
  } catch (error: any) {
    return createError('GET_NOTIFICATIONS_ERROR', 'Failed to fetch notifications', error.message);
  }
};

/**
 * POST /api/notifications/:id/read
 * Mark notification as read
 */
export const markNotificationRead = async (body: MarkNotificationReadBody): Promise<MarkNotificationReadResponse | ApiError> => {
  try {
    const { id } = body;
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === id);
    
    if (notificationIndex === -1) {
      return createError('NOTIFICATION_NOT_FOUND', `Notification with id ${id} not found`);
    }

    // Mark as read
    mockNotifications[notificationIndex].read = true;

    return createResponse({ success: true }, 'Notification marked as read');
  } catch (error: any) {
    return createError('MARK_READ_ERROR', 'Failed to mark notification as read', error.message);
  }
};

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for a user
 */
export const markAllNotificationsRead = async (walletAddress: string): Promise<MarkNotificationReadResponse | ApiError> => {
  try {
    mockNotifications
      .filter(n => n.walletAddress.toLowerCase() === walletAddress.toLowerCase())
      .forEach(n => {
        n.read = true;
      });

    return createResponse({ success: true }, 'All notifications marked as read');
  } catch (error: any) {
    return createError('MARK_ALL_READ_ERROR', 'Failed to mark all notifications as read', error.message);
  }
};

/**
 * POST /api/notifications
 * Create new notification
 */
export const createNotification = async (body: CreateNotificationBody): Promise<CreateNotificationResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.walletAddress || !body.title || !body.message || !body.type || !body.priority) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Create new notification
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId: `user_${Date.now()}`, // In real app, get from user session
      walletAddress: body.walletAddress,
      title: body.title,
      message: body.message,
      type: body.type,
      priority: body.priority,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: body.relatedId,
      relatedType: body.relatedType,
      actionUrl: body.actionUrl
    };

    // In real app, save to database
    mockNotifications.push(newNotification);

    return createResponse(newNotification, 'Notification created successfully');
  } catch (error: any) {
    return createError('CREATE_NOTIFICATION_ERROR', 'Failed to create notification', error.message);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete notification
 */
export const deleteNotification = async (id: string) => {
  try {
    const notificationIndex = mockNotifications.findIndex(n => n.id === id);
    
    if (notificationIndex === -1) {
      return createError('NOTIFICATION_NOT_FOUND', `Notification with id ${id} not found`);
    }

    // Remove notification
    mockNotifications.splice(notificationIndex, 1);

    return createResponse({ deleted: true }, 'Notification deleted successfully');
  } catch (error: any) {
    return createError('DELETE_NOTIFICATION_ERROR', 'Failed to delete notification', error.message);
  }
};

/**
 * DELETE /api/notifications/clear
 * Clear all read notifications for a user
 */
export const clearReadNotifications = async (walletAddress: string) => {
  try {
    const initialLength = mockNotifications.length;
    
    // Remove all read notifications for this wallet
    for (let i = mockNotifications.length - 1; i >= 0; i--) {
      if (mockNotifications[i].walletAddress.toLowerCase() === walletAddress.toLowerCase() && mockNotifications[i].read) {
        mockNotifications.splice(i, 1);
      }
    }

    const deletedCount = initialLength - mockNotifications.length;

    return createResponse({ deletedCount }, `${deletedCount} read notifications cleared`);
  } catch (error: any) {
    return createError('CLEAR_NOTIFICATIONS_ERROR', 'Failed to clear notifications', error.message);
  }
};

/**
 * GET /api/notifications/stats
 * Get notification statistics for a user
 */
export const getNotificationStats = async (walletAddress: string) => {
  try {
    const userNotifications = mockNotifications.filter(
      n => n.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      read: userNotifications.filter(n => n.read).length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      urgent: userNotifications.filter(n => n.priority === 'urgent' && !n.read).length
    };

    // Group by type
    userNotifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    });

    // Group by priority
    userNotifications.forEach(n => {
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_NOTIFICATION_STATS_ERROR', 'Failed to get notification statistics', error.message);
  }
};

/**
 * POST /api/notifications/send-batch
 * Send notification to multiple users
 */
export const sendBatchNotifications = async (body: {
  walletAddresses: string[];
  title: string;
  message: string;
  type: Notification['type'];
  priority: Notification['priority'];
}) => {
  try {
    const createdNotifications: Notification[] = [];

    for (const walletAddress of body.walletAddresses) {
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random()}`,
        userId: `user_${Date.now()}`,
        walletAddress,
        title: body.title,
        message: body.message,
        type: body.type,
        priority: body.priority,
        read: false,
        createdAt: new Date().toISOString()
      };

      mockNotifications.push(newNotification);
      createdNotifications.push(newNotification);
    }

    return createResponse({
      sent: createdNotifications.length,
      notifications: createdNotifications
    }, `Sent ${createdNotifications.length} notifications`);
  } catch (error: any) {
    return createError('SEND_BATCH_ERROR', 'Failed to send batch notifications', error.message);
  }
};
