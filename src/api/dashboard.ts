// Dashboard API endpoints with mock responses

import { licenses, vehicles, violations } from '../lib/mockData';
import { mockAuthorities } from './authorities';
import type {
  DashboardStats,
  GetDashboardStatsResponse,
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

/**
 * GET /api/dashboard/stats
 * Get comprehensive dashboard statistics
 */
export const getDashboardStats = async (city?: string): Promise<GetDashboardStatsResponse | ApiError> => {
  try {
    // Filter by city if provided
    const filteredLicenses = city ? licenses.filter(l => l.city === city) : licenses;
    const filteredVehicles = city ? vehicles.filter(v => v.city === city) : vehicles;
    const filteredViolations = city ? violations.filter(v => v.city === city) : violations;
    const filteredAuthorities = city ? mockAuthorities.filter(a => a.city === city) : mockAuthorities;

    // Calculate last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // License stats
    const licenseStats = {
      total: filteredLicenses.length,
      active: filteredLicenses.filter(l => l.status === 'active').length,
      expired: filteredLicenses.filter(l => l.status === 'expired').length,
      suspended: filteredLicenses.filter(l => l.status === 'suspended').length,
      revoked: filteredLicenses.filter(l => l.status === 'revoked').length,
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      recentCount: filteredLicenses.filter(l => new Date(l.issueDate) >= thirtyDaysAgo).length
    };

    filteredLicenses.forEach(l => {
      licenseStats.byType[l.licenseType] = (licenseStats.byType[l.licenseType] || 0) + 1;
      licenseStats.byCity[l.city] = (licenseStats.byCity[l.city] || 0) + 1;
    });

    // Vehicle stats
    const now = new Date();
    const inspectionsDueDate = new Date(now);
    inspectionsDueDate.setDate(inspectionsDueDate.getDate() + 30);

    const vehicleStats = {
      total: filteredVehicles.length,
      valid: filteredVehicles.filter(v => v.status === 'valid').length,
      expired: filteredVehicles.filter(v => v.status === 'expired').length,
      pending: filteredVehicles.filter(v => v.status === 'pending').length,
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      inspectionsDue: filteredVehicles.filter(v => {
        const nextInspection = new Date(v.nextInspection);
        return nextInspection <= inspectionsDueDate && nextInspection >= now;
      }).length
    };

    filteredVehicles.forEach(v => {
      vehicleStats.byType[v.vehicleType] = (vehicleStats.byType[v.vehicleType] || 0) + 1;
      vehicleStats.byCity[v.city] = (vehicleStats.byCity[v.city] || 0) + 1;
    });

    // Violation stats
    const violationStats = {
      total: filteredViolations.length,
      pending: filteredViolations.filter(v => v.status === 'pending').length,
      paid: filteredViolations.filter(v => v.status === 'paid').length,
      overdue: filteredViolations.filter(v => v.status === 'overdue').length,
      totalFines: filteredViolations.reduce((sum, v) => sum + v.fine, 0),
      collectedFines: filteredViolations.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.fine, 0),
      byType: {} as Record<string, number>,
      byCity: {} as Record<string, number>,
      recentCount: filteredViolations.filter(v => new Date(v.date) >= thirtyDaysAgo).length
    };

    filteredViolations.forEach(v => {
      violationStats.byType[v.violationType] = (violationStats.byType[v.violationType] || 0) + 1;
      violationStats.byCity[v.city] = (violationStats.byCity[v.city] || 0) + 1;
    });

    // Authority stats
    const authorityStats = {
      total: filteredAuthorities.length,
      active: filteredAuthorities.filter(a => a.status === 'active').length,
      inactive: filteredAuthorities.filter(a => a.status === 'inactive').length,
      byType: {} as Record<string, number>
    };

    filteredAuthorities.forEach(a => {
      authorityStats.byType[a.type] = (authorityStats.byType[a.type] || 0) + 1;
    });

    const stats: DashboardStats = {
      licenses: licenseStats,
      vehicles: vehicleStats,
      violations: violationStats,
      authorities: authorityStats
    };

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_DASHBOARD_STATS_ERROR', 'Failed to fetch dashboard statistics', error.message);
  }
};

/**
 * GET /api/dashboard/recent-activities
 * Get recent system activities
 */
export const getRecentActivities = async (limit: number = 10, city?: string) => {
  try {
    const activities: Array<{
      id: string;
      type: 'license' | 'vehicle' | 'violation' | 'inspection';
      action: string;
      description: string;
      timestamp: string;
      entity: any;
    }> = [];

    // Recent licenses
    const recentLicenses = (city ? licenses.filter(l => l.city === city) : licenses)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5);

    recentLicenses.forEach(l => {
      activities.push({
        id: `act_lic_${l.id}`,
        type: 'license',
        action: 'created',
        description: `GPLX ${l.licenseNumber} được cấp cho ${l.holderName}`,
        timestamp: l.issueDate,
        entity: l
      });
    });

    // Recent vehicles
    const recentVehicles = (city ? vehicles.filter(v => v.city === city) : vehicles)
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 5);

    recentVehicles.forEach(v => {
      activities.push({
        id: `act_veh_${v.id}`,
        type: 'vehicle',
        action: 'registered',
        description: `Xe ${v.plateNumber} đăng ký cho ${v.owner}`,
        timestamp: v.registrationDate,
        entity: v
      });
    });

    // Recent violations
    const recentViolations = (city ? violations.filter(v => v.city === city) : violations)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    recentViolations.forEach(v => {
      activities.push({
        id: `act_vio_${v.id}`,
        type: 'violation',
        action: 'recorded',
        description: `Vi phạm: ${v.violationType} - ${v.violatorName}`,
        timestamp: v.date,
        entity: v
      });
    });

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return createResponse(sortedActivities);
  } catch (error: any) {
    return createError('GET_RECENT_ACTIVITIES_ERROR', 'Failed to fetch recent activities', error.message);
  }
};

/**
 * GET /api/dashboard/alerts
 * Get system alerts and warnings
 */
export const getSystemAlerts = async (city?: string) => {
  try {
    const alerts: Array<{
      id: string;
      type: 'warning' | 'error' | 'info';
      category: 'license' | 'vehicle' | 'violation';
      title: string;
      message: string;
      count: number;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    const filteredLicenses = city ? licenses.filter(l => l.city === city) : licenses;
    const filteredVehicles = city ? vehicles.filter(v => v.city === city) : vehicles;
    const filteredViolations = city ? violations.filter(v => v.city === city) : violations;

    // Expired licenses
    const expiredLicenses = filteredLicenses.filter(l => l.status === 'expired');
    if (expiredLicenses.length > 0) {
      alerts.push({
        id: 'alert_lic_expired',
        type: 'warning',
        category: 'license',
        title: 'GPLX hết hạn',
        message: `${expiredLicenses.length} GPLX đã hết hạn cần xử lý`,
        count: expiredLicenses.length,
        priority: 'medium'
      });
    }

    // Expiring soon licenses (30 days)
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const expiringSoon = filteredLicenses.filter(l => {
      const expiryDate = new Date(l.expiryDate);
      return l.status === 'active' && expiryDate <= thirtyDaysLater && expiryDate >= now;
    });

    if (expiringSoon.length > 0) {
      alerts.push({
        id: 'alert_lic_expiring',
        type: 'info',
        category: 'license',
        title: 'GPLX sắp hết hạn',
        message: `${expiringSoon.length} GPLX sẽ hết hạn trong 30 ngày tới`,
        count: expiringSoon.length,
        priority: 'low'
      });
    }

    // Vehicles needing inspection
    const inspectionsDue = filteredVehicles.filter(v => {
      const nextInspection = new Date(v.nextInspection);
      return nextInspection <= thirtyDaysLater && nextInspection >= now;
    });

    if (inspectionsDue.length > 0) {
      alerts.push({
        id: 'alert_veh_inspection',
        type: 'warning',
        category: 'vehicle',
        title: 'Xe cần đăng kiểm',
        message: `${inspectionsDue.length} xe cần đăng kiểm trong 30 ngày tới`,
        count: inspectionsDue.length,
        priority: 'medium'
      });
    }

    // Expired vehicle inspections
    const expiredInspections = filteredVehicles.filter(v => v.status === 'expired');
    if (expiredInspections.length > 0) {
      alerts.push({
        id: 'alert_veh_expired',
        type: 'error',
        category: 'vehicle',
        title: 'Xe hết hạn đăng kiểm',
        message: `${expiredInspections.length} xe đã hết hạn đăng kiểm`,
        count: expiredInspections.length,
        priority: 'high'
      });
    }

    // Unpaid violations
    const unpaidViolations = filteredViolations.filter(v => v.status === 'pending' || v.status === 'overdue');
    if (unpaidViolations.length > 0) {
      alerts.push({
        id: 'alert_vio_unpaid',
        type: 'warning',
        category: 'violation',
        title: 'Vi phạm chưa thanh toán',
        message: `${unpaidViolations.length} vi phạm chưa được thanh toán`,
        count: unpaidViolations.length,
        priority: 'medium'
      });
    }

    // Overdue violations
    const overdueViolations = filteredViolations.filter(v => v.status === 'overdue');
    if (overdueViolations.length > 0) {
      alerts.push({
        id: 'alert_vio_overdue',
        type: 'error',
        category: 'violation',
        title: 'Vi phạm quá hạn',
        message: `${overdueViolations.length} vi phạm đã quá hạn thanh toán`,
        count: overdueViolations.length,
        priority: 'high'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return createResponse(alerts);
  } catch (error: any) {
    return createError('GET_ALERTS_ERROR', 'Failed to fetch system alerts', error.message);
  }
};

/**
 * GET /api/dashboard/trends
 * Get trend data for charts
 */
export const getTrends = async (days: number = 30, city?: string) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filteredViolations = city ? violations.filter(v => v.city === city) : violations;
    const filteredLicenses = city ? licenses.filter(l => l.city === city) : licenses;
    const filteredVehicles = city ? vehicles.filter(v => v.city === city) : vehicles;

    // Generate daily data
    const dailyData = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      dailyData.push({
        date: dateStr,
        violations: filteredViolations.filter(v => v.date === dateStr).length,
        licenses: filteredLicenses.filter(l => l.issueDate === dateStr).length,
        vehicles: filteredVehicles.filter(v => v.registrationDate === dateStr).length,
        revenue: filteredViolations
          .filter(v => v.date === dateStr && v.status === 'paid')
          .reduce((sum, v) => sum + v.fine, 0)
      });
    }

    return createResponse({
      period: { from: startDate.toISOString(), to: endDate.toISOString() },
      daily: dailyData,
      summary: {
        totalViolations: dailyData.reduce((sum, d) => sum + d.violations, 0),
        totalLicenses: dailyData.reduce((sum, d) => sum + d.licenses, 0),
        totalVehicles: dailyData.reduce((sum, d) => sum + d.vehicles, 0),
        totalRevenue: dailyData.reduce((sum, d) => sum + d.revenue, 0)
      }
    });
  } catch (error: any) {
    return createError('GET_TRENDS_ERROR', 'Failed to fetch trend data', error.message);
  }
};
