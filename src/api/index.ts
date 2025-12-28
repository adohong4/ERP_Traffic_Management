/**
 * ERP GPLX API Index
 * Central export for all API endpoints
 */

// Export types
export * from './types';

// License APIs
// export * from './licenses';

// Vehicle APIs
export * from './vehicles';

// Violation APIs
export * from './violations';

// News APIs
export * from './news';

// Notification APIs
export * from './notifications';

// Authority APIs
export * from './authorities';

// Dashboard APIs
export * from './dashboard';

// Report APIs
export * from './reports';

// API client helper
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // License endpoints
  // licenses = {
  //   list: (params?: any) => this.request('/licenses', {
  //     method: 'GET',
  //     body: JSON.stringify(params)
  //   }),
  //   get: (id: string) => this.request(`/licenses/${id}`),
  //   create: (data: any) => this.request('/licenses', {
  //     method: 'POST',
  //     body: JSON.stringify(data)
  //   }),
  //   update: (id: string, data: any) => this.request(`/licenses/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(data)
  //   }),
  //   delete: (id: string) => this.request(`/licenses/${id}`, {
  //     method: 'DELETE'
  //   }),
  //   renew: (id: string) => this.request(`/licenses/${id}/renew`, {
  //     method: 'POST'
  //   }),
  //   suspend: (id: string, reason: string) => this.request(`/licenses/${id}/suspend`, {
  //     method: 'POST',
  //     body: JSON.stringify({ reason })
  //   }),
  //   revoke: (id: string, reason: string) => this.request(`/licenses/${id}/revoke`, {
  //     method: 'POST',
  //     body: JSON.stringify({ reason })
  //   }),
  //   stats: (city?: string) => this.request(`/licenses/stats${city ? `?city=${city}` : ''}`)
  // };

  // Vehicle endpoints
  vehicles = {
    list: (params?: any) => this.request('/vehicles', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    get: (id: string) => this.request(`/vehicles/${id}`),
    create: (data: any) => this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => this.request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => this.request(`/vehicles/${id}`, {
      method: 'DELETE'
    }),
    inspect: (id: string, data: any) => this.request(`/vehicles/${id}/inspect`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    stats: (city?: string) => this.request(`/vehicles/stats${city ? `?city=${city}` : ''}`),
    inspectionsDue: (days?: number, city?: string) =>
      this.request(`/vehicles/inspections-due?days=${days || 30}${city ? `&city=${city}` : ''}`)
  };

  // Violation endpoints
  violations = {
    list: (params?: any) => this.request('/violations', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    get: (id: string) => this.request(`/violations/${id}`),
    create: (data: any) => this.request('/violations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => this.request(`/violations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => this.request(`/violations/${id}`, {
      method: 'DELETE'
    }),
    pay: (id: string, data: any) => this.request(`/violations/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    stats: (city?: string) => this.request(`/violations/stats${city ? `?city=${city}` : ''}`),
    byLicense: (licenseNumber: string) => this.request(`/violations/by-license/${licenseNumber}`),
    byVehicle: (plateNumber: string) => this.request(`/violations/by-vehicle/${plateNumber}`)
  };

  // News endpoints
  news = {
    list: (params?: any) => this.request('/news', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    get: (id: string) => this.request(`/news/${id}`),
    getBySlug: (slug: string) => this.request(`/news/slug/${slug}`),
    create: (data: any) => this.request('/news', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => this.request(`/news/${id}`, {
      method: 'DELETE'
    }),
    publish: (id: string) => this.request(`/news/${id}/publish`, {
      method: 'POST'
    }),
    archive: (id: string) => this.request(`/news/${id}/archive`, {
      method: 'POST'
    }),
    featured: (limit?: number) => this.request(`/news/featured?limit=${limit || 5}`),
    stats: () => this.request('/news/stats')
  };

  // Notification endpoints
  notifications = {
    list: (params?: any) => this.request('/notifications', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    markRead: (id: string) => this.request(`/notifications/${id}/read`, {
      method: 'POST'
    }),
    markAllRead: (walletAddress: string) => this.request('/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({ walletAddress })
    }),
    create: (data: any) => this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => this.request(`/notifications/${id}`, {
      method: 'DELETE'
    }),
    clearRead: (walletAddress: string) => this.request('/notifications/clear', {
      method: 'DELETE',
      body: JSON.stringify({ walletAddress })
    }),
    stats: (walletAddress: string) => this.request(`/notifications/stats?wallet=${walletAddress}`),
    sendBatch: (data: any) => this.request('/notifications/send-batch', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  };

  // Authority endpoints
  authorities = {
    list: (params?: any) => this.request('/authorities', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    get: (id: string) => this.request(`/authorities/${id}`),
    create: (data: any) => this.request('/authorities', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => this.request(`/authorities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => this.request(`/authorities/${id}`, {
      method: 'DELETE'
    }),
    activate: (id: string) => this.request(`/authorities/${id}/activate`, {
      method: 'POST'
    }),
    deactivate: (id: string) => this.request(`/authorities/${id}/deactivate`, {
      method: 'POST'
    }),
    stats: () => this.request('/authorities/stats'),
    byWallet: (walletAddress: string) => this.request(`/authorities/by-wallet/${walletAddress}`),
    byCity: (city: string) => this.request(`/authorities/by-city/${city}`)
  };

  // Dashboard endpoints
  dashboard = {
    stats: (city?: string) => this.request(`/dashboard/stats${city ? `?city=${city}` : ''}`),
    recentActivities: (limit?: number, city?: string) =>
      this.request(`/dashboard/recent-activities?limit=${limit || 10}${city ? `&city=${city}` : ''}`),
    alerts: (city?: string) => this.request(`/dashboard/alerts${city ? `?city=${city}` : ''}`),
    trends: (days?: number, city?: string) =>
      this.request(`/dashboard/trends?days=${days || 30}${city ? `&city=${city}` : ''}`)
  };

  // Report endpoints
  reports = {
    generate: (params: any) => this.request('/reports', {
      method: 'GET',
      body: JSON.stringify(params)
    }),
    export: (params: any) => this.request('/reports/export', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  };
}

// Create default instance
export const api = new ApiClient();

// Example usage documentation
export const API_EXAMPLES = {
  licenses: {
    list: `
      import { getLicenses } from '@/api';
      
      const response = await getLicenses({
        page: 1,
        limit: 10,
        status: 'active',
        city: 'Hà Nội',
        search: 'Nguyễn'
      });
    `,
    create: `
      import { createLicense } from '@/api';
      
      const response = await createLicense({
        holderName: 'Nguyễn Văn A',
        idCard: '001234567890',
        licenseType: 'B2',
        city: 'Hà Nội',
        issuePlace: 'Sở GTVT Hà Nội'
      });
    `
  },
  violations: {
    pay: `
      import { payViolation } from '@/api';
      
      const response = await payViolation('vio_123', {
        paymentMethod: 'bank',
        transactionId: 'TXN123456'
      });
    `
  },
  dashboard: {
    stats: `
      import { getDashboardStats } from '@/api';
      
      const response = await getDashboardStats('Hà Nội');
      console.log(response.data.licenses.total);
    `
  }
};
