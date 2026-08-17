import axios from 'axios';
import type { AuthResponse, User } from '@/types';

const API_URL = '/api';

let accessToken: string | null = localStorage.getItem('accessToken');
let refreshToken: string | null = localStorage.getItem('refreshToken');

export function getAccessToken() { return accessToken; }
export function getRefreshToken() { return refreshToken; }

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token!));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data.data;
        setTokens(newAccess, newRefresh);
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH
// ============================================================
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),
  logout: () => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get<{ success: boolean; data: User }>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put<{ success: boolean; data: User }>('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// ============================================================
// PRODUCTS
// ============================================================
export const productAPI = {
  getProducts: (params?: Record<string, unknown>) =>
    api.get<{ success: boolean; data: any[]; pagination?: any }>('/products', { params }),
  getProduct: (idOrSlug: string) =>
    api.get<{ success: boolean; data: any }>(`/products/${idOrSlug}`),
  getFeatured: () => api.get<{ success: boolean; data: any[] }>('/products/featured'),
  getNewArrivals: () => api.get<{ success: boolean; data: any[] }>('/products/new-arrivals'),
  getPopular: () => api.get<{ success: boolean; data: any[] }>('/products/popular'),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ============================================================
// CATEGORIES
// ============================================================
export const categoryAPI = {
  getCategories: (activeOnly = true) =>
    api.get<{ success: boolean; data: any[] }>('/categories', { params: activeOnly ? { active: 'true' } : {} }),
  getCategory: (idOrSlug: string) =>
    api.get<{ success: boolean; data: any }>(`/categories/${idOrSlug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ============================================================
// ORDERS
// ============================================================
export const orderAPI = {
  create: (data: any) => api.post<{ success: boolean; data: any }>('/orders', data),
  getMyOrders: () => api.get<{ success: boolean; data: any[] }>('/orders/my'),
  getOrder: (id: string) => api.get<{ success: boolean; data: any }>(`/orders/${id}`),
  cancel: (id: string) => api.patch<{ success: boolean; data: any }>(`/orders/${id}/cancel`),
};

// ============================================================
// ADMIN
// ============================================================
export const adminAPI = {
  getStats: () => api.get<{ success: boolean; data: any }>('/admin/stats'),
  getOrders: (params?: Record<string, unknown>) =>
    api.get<{ success: boolean; data: any[]; pagination?: any }>('/admin/orders', { params }),
  getOrder: (id: string) => api.get<{ success: boolean; data: any }>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch<{ success: boolean; data: any }>(`/admin/orders/${id}/status`, { orderStatus: status }),
  getCustomers: (params?: Record<string, unknown>) =>
    api.get<{ success: boolean; data: any[]; pagination?: any }>('/admin/customers', { params }),
  getCustomer: (id: string) => api.get<{ success: boolean; data: any }>(`/admin/customers/${id}`),
  toggleCustomerActive: (id: string) =>
    api.patch<{ success: boolean; data: any }>(`/admin/customers/${id}/toggle-active`),
  getProducts: () => api.get<{ success: boolean; data: any[] }>('/admin/products'),
};

// ============================================================
// UPLOADS
// ============================================================
export const uploadAPI = {
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    return api.post<{ success: boolean; data: { url: string; publicId: string }[] }>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId: string) => api.delete('/uploads/image', { data: { publicId } }),
};

// ============================================================
// SETTINGS
// ============================================================
export const settingsAPI = {
  get: () => api.get<{ success: boolean; data: any }>('/settings'),
  update: (data: any) => api.put<{ success: boolean; data: any }>('/settings', data),
};

export default api;
