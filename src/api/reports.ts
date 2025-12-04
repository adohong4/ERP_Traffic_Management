// Reports API endpoints with mock responses

import { licenses, vehicles, violations } from '../lib/mockData';
import type {
  GetReportsParams,
  GetReportsResponse,
  ReportData,
  ExportReportParams,
  ExportReportResponse,
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
 * GET /api/reports
 * Generate comprehensive reports
 */
export const getReports = async (params: GetReportsParams): Promise<GetReportsResponse | ApiError> => {
  try {
    const { reportType, dateFrom, dateTo, city, groupBy = 'day' } = params;

    if (!reportType || !dateFrom || !dateTo) {
      return createError('VALIDATION_ERROR', 'Missing required parameters: reportType, dateFrom, dateTo');
    }

    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    // Filter data by city if provided
    const filteredLicenses = city ? licenses.filter(l => l.city === city) : licenses;
    const filteredVehicles = city ? vehicles.filter(v => v.city === city) : vehicles;
    const filteredViolations = city ? violations.filter(v => v.city === city) : violations;

    let reportData: ReportData;

    switch (reportType) {
      case 'license':
        reportData = generateLicenseReport(filteredLicenses, startDate, endDate, groupBy);
        break;
      case 'vehicle':
        reportData = generateVehicleReport(filteredVehicles, startDate, endDate, groupBy);
        break;
      case 'violation':
        reportData = generateViolationReport(filteredViolations, startDate, endDate, groupBy);
        break;
      case 'revenue':
        reportData = generateRevenueReport(filteredViolations, startDate, endDate, groupBy);
        break;
      case 'inspection':
        reportData = generateInspectionReport(filteredVehicles, startDate, endDate, groupBy);
        break;
      default:
        return createError('INVALID_REPORT_TYPE', `Invalid report type: ${reportType}`);
    }

    return createResponse(reportData);
  } catch (error: any) {
    return createError('GET_REPORTS_ERROR', 'Failed to generate report', error.message);
  }
};

/**
 * Generate license report
 */
function generateLicenseReport(data: any[], startDate: Date, endDate: Date, groupBy: string): ReportData {
  const filtered = data.filter(l => {
    const issueDate = new Date(l.issueDate);
    return issueDate >= startDate && issueDate <= endDate;
  });

  const summary = {
    total: filtered.length,
    active: filtered.filter(l => l.status === 'active').length,
    expired: filtered.filter(l => l.status === 'expired').length,
    suspended: filtered.filter(l => l.status === 'suspended').length,
    revoked: filtered.filter(l => l.status === 'revoked').length,
    byType: {} as Record<string, number>
  };

  filtered.forEach(l => {
    summary.byType[l.licenseType] = (summary.byType[l.licenseType] || 0) + 1;
  });

  // Time series data
  const timeSeriesData = generateTimeSeriesData(filtered, startDate, endDate, groupBy, (item) => item.issueDate);

  // Distribution by type
  const distributionData = Object.entries(summary.byType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Status comparison
  const comparisonData = [
    { name: 'Hiệu lực', value: summary.active },
    { name: 'Hết hạn', value: summary.expired },
    { name: 'Tạm dừng', value: summary.suspended },
    { name: 'Thu hồi', value: summary.revoked }
  ];

  return {
    reportType: 'license',
    period: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    },
    summary,
    data: timeSeriesData,
    charts: {
      timeSeries: timeSeriesData,
      distribution: distributionData,
      comparison: comparisonData
    }
  };
}

/**
 * Generate vehicle report
 */
function generateVehicleReport(data: any[], startDate: Date, endDate: Date, groupBy: string): ReportData {
  const filtered = data.filter(v => {
    const regDate = new Date(v.registrationDate);
    return regDate >= startDate && regDate <= endDate;
  });

  const summary = {
    total: filtered.length,
    valid: filtered.filter(v => v.status === 'valid').length,
    expired: filtered.filter(v => v.status === 'expired').length,
    pending: filtered.filter(v => v.status === 'pending').length,
    byType: {} as Record<string, number>,
    byBrand: {} as Record<string, number>
  };

  filtered.forEach(v => {
    summary.byType[v.vehicleType] = (summary.byType[v.vehicleType] || 0) + 1;
    summary.byBrand[v.brand] = (summary.byBrand[v.brand] || 0) + 1;
  });

  const timeSeriesData = generateTimeSeriesData(filtered, startDate, endDate, groupBy, (item) => item.registrationDate);

  const distributionData = Object.entries(summary.byType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const comparisonData = Object.entries(summary.byBrand).map(([brand, count]) => ({
    name: brand,
    value: count
  })).slice(0, 10); // Top 10 brands

  return {
    reportType: 'vehicle',
    period: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    },
    summary,
    data: timeSeriesData,
    charts: {
      timeSeries: timeSeriesData,
      distribution: distributionData,
      comparison: comparisonData
    }
  };
}

/**
 * Generate violation report
 */
function generateViolationReport(data: any[], startDate: Date, endDate: Date, groupBy: string): ReportData {
  const filtered = data.filter(v => {
    const violationDate = new Date(v.date);
    return violationDate >= startDate && violationDate <= endDate;
  });

  const summary = {
    total: filtered.length,
    pending: filtered.filter(v => v.status === 'pending').length,
    paid: filtered.filter(v => v.status === 'paid').length,
    overdue: filtered.filter(v => v.status === 'overdue').length,
    totalFines: filtered.reduce((sum, v) => sum + v.fine, 0),
    collectedFines: filtered.filter(v => v.status === 'paid').reduce((sum, v) => sum + v.fine, 0),
    byType: {} as Record<string, number>
  };

  filtered.forEach(v => {
    summary.byType[v.violationType] = (summary.byType[v.violationType] || 0) + 1;
  });

  const timeSeriesData = generateTimeSeriesData(filtered, startDate, endDate, groupBy, (item) => item.date);

  const distributionData = Object.entries(summary.byType)
    .map(([type, count]) => ({
      name: type,
      value: count
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 violation types

  const comparisonData = [
    { name: 'Chưa thanh toán', value: summary.pending },
    { name: 'Đã thanh toán', value: summary.paid },
    { name: 'Quá hạn', value: summary.overdue }
  ];

  return {
    reportType: 'violation',
    period: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    },
    summary,
    data: timeSeriesData,
    charts: {
      timeSeries: timeSeriesData,
      distribution: distributionData,
      comparison: comparisonData
    }
  };
}

/**
 * Generate revenue report
 */
function generateRevenueReport(data: any[], startDate: Date, endDate: Date, groupBy: string): ReportData {
  const filtered = data.filter(v => {
    const violationDate = new Date(v.date);
    return violationDate >= startDate && violationDate <= endDate;
  });

  const paidViolations = filtered.filter(v => v.status === 'paid');
  
  const summary = {
    totalRevenue: paidViolations.reduce((sum, v) => sum + v.fine, 0),
    pendingRevenue: filtered.filter(v => v.status !== 'paid').reduce((sum, v) => sum + v.fine, 0),
    transactionCount: paidViolations.length,
    averageTransaction: paidViolations.length > 0 
      ? Math.round(paidViolations.reduce((sum, v) => sum + v.fine, 0) / paidViolations.length)
      : 0,
    byPaymentMethod: {} as Record<string, number>
  };

  paidViolations.forEach(v => {
    const method = v.paymentMethod || 'unknown';
    summary.byPaymentMethod[method] = (summary.byPaymentMethod[method] || 0) + v.fine;
  });

  const timeSeriesData = generateRevenueTimeSeries(paidViolations, startDate, endDate, groupBy);

  const distributionData = Object.entries(summary.byPaymentMethod).map(([method, amount]) => ({
    name: method,
    value: amount
  }));

  const comparisonData = [
    { name: 'Đã thu', value: summary.totalRevenue },
    { name: 'Chưa thu', value: summary.pendingRevenue }
  ];

  return {
    reportType: 'revenue',
    period: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    },
    summary,
    data: timeSeriesData,
    charts: {
      timeSeries: timeSeriesData,
      distribution: distributionData,
      comparison: comparisonData
    }
  };
}

/**
 * Generate inspection report
 */
function generateInspectionReport(data: any[], startDate: Date, endDate: Date, groupBy: string): ReportData {
  const filtered = data.filter(v => {
    const inspectionDate = new Date(v.lastInspection);
    return inspectionDate >= startDate && inspectionDate <= endDate;
  });

  const summary = {
    total: filtered.length,
    passed: filtered.filter(v => v.status === 'valid').length,
    failed: filtered.filter(v => v.status === 'expired').length,
    pending: filtered.filter(v => v.status === 'pending').length,
    byType: {} as Record<string, number>
  };

  filtered.forEach(v => {
    summary.byType[v.vehicleType] = (summary.byType[v.vehicleType] || 0) + 1;
  });

  const timeSeriesData = generateTimeSeriesData(filtered, startDate, endDate, groupBy, (item) => item.lastInspection);

  const distributionData = Object.entries(summary.byType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const comparisonData = [
    { name: 'Đạt', value: summary.passed },
    { name: 'Không đạt', value: summary.failed },
    { name: 'Đang chờ', value: summary.pending }
  ];

  return {
    reportType: 'inspection',
    period: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    },
    summary,
    data: timeSeriesData,
    charts: {
      timeSeries: timeSeriesData,
      distribution: distributionData,
      comparison: comparisonData
    }
  };
}

/**
 * Generate time series data
 */
function generateTimeSeriesData(
  data: any[],
  startDate: Date,
  endDate: Date,
  groupBy: string,
  dateGetter: (item: any) => string
): Array<{ date: string; value: number; breakdown?: Record<string, number> }> {
  const result: Array<{ date: string; value: number; breakdown?: Record<string, number> }> = [];
  
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    
    const dayData = data.filter(item => {
      const itemDate = new Date(dateGetter(item));
      return itemDate.toISOString().split('T')[0] === dateStr;
    });
    
    result.push({
      date: dateStr,
      value: dayData.length
    });
    
    // Move to next period
    if (groupBy === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (groupBy === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (groupBy === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else if (groupBy === 'year') {
      current.setFullYear(current.getFullYear() + 1);
    }
  }
  
  return result;
}

/**
 * Generate revenue time series
 */
function generateRevenueTimeSeries(
  data: any[],
  startDate: Date,
  endDate: Date,
  groupBy: string
): Array<{ date: string; value: number }> {
  const result: Array<{ date: string; value: number }> = [];
  
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    
    const dayRevenue = data
      .filter(item => {
        const paymentDate = item.paymentDate ? new Date(item.paymentDate) : new Date(item.date);
        return paymentDate.toISOString().split('T')[0] === dateStr;
      })
      .reduce((sum, item) => sum + item.fine, 0);
    
    result.push({
      date: dateStr,
      value: dayRevenue
    });
    
    // Move to next period
    if (groupBy === 'day') {
      current.setDate(current.getDate() + 1);
    } else if (groupBy === 'week') {
      current.setDate(current.getDate() + 7);
    } else if (groupBy === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else if (groupBy === 'year') {
      current.setFullYear(current.getFullYear() + 1);
    }
  }
  
  return result;
}

/**
 * POST /api/reports/export
 * Export report to file
 */
export const exportReport = async (params: ExportReportParams): Promise<ExportReportResponse | ApiError> => {
  try {
    const { format } = params;
    
    // Generate report first
    const reportResponse = await getReports(params);
    
    if (!reportResponse.success) {
      return reportResponse as ApiError;
    }

    // In real app, generate actual file and upload to storage
    const filename = `report_${params.reportType}_${Date.now()}.${format}`;
    const downloadUrl = `/downloads/${filename}`; // Mock URL
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Link expires in 24 hours

    return createResponse({
      downloadUrl,
      filename,
      expiresAt: expiresAt.toISOString()
    }, `Report exported successfully as ${format.toUpperCase()}`);
  } catch (error: any) {
    return createError('EXPORT_REPORT_ERROR', 'Failed to export report', error.message);
  }
};
