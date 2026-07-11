import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const isAdminPage = window.location.pathname.startsWith('/admin');
    const token = isAdminPage
      ? localStorage.getItem('superAdminToken') || localStorage.getItem('token')
      : localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAdminPage = window.location.pathname.startsWith('/admin');
      if (isAdminPage) {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdmin_user');
        localStorage.removeItem('role');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API (Citizen)
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Super Admin API
export const superAdminAPI = {
  login: (data) => api.post('/admin/login', data),
  register: (data) => api.post('/admin/register', data),
  getMe: () => api.get('/admin/me'),
};

// Complaints API
export const complaintsAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/complaints', data);
  },
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  assign: (id, data) => api.put(`/complaints/${id}/assign`, data),
  upvote: (id) => api.post(`/complaints/${id}/upvote`),
  feedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
  checkDuplicate: (data) => api.post('/complaints/check-duplicate', data),
  getNearby: (params) => api.get('/complaints/nearby', { params }),
};

// Departments API
export const departmentsAPI = {
  getAll: (params) => api.get('/departments', { params }),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Officers API
export const officersAPI = {
  list: (params) => api.get('/officers', { params }),
  create: (data) => api.post('/officers', data),
  getById: (id) => api.get(`/officers/${id}`),
  update: (id, data) => api.put(`/officers/${id}`, data),
  delete: (id) => api.delete(`/officers/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Rewards API
export const rewardsAPI = {
  getAll: (params) => api.get('/rewards', { params }),
  getLeaderboard: () => api.get('/rewards/leaderboard'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMyStats: () => api.get('/analytics/my-stats'),
  getDepartment: (params) => api.get('/analytics/department', { params }),
  getUsers: (params) => api.get('/analytics/users', { params }),
};

// AI API (via backend proxy)
export const aiAPI = {
  analyzeText: (data) => api.post('/ai/analyze-text', data),
  checkDuplicate: (data) => api.post('/ai/check-duplicate', data),
};

export default api;