import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/$/, '')}/api`;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('tmc_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tmc_admin_token');
      localStorage.removeItem('tmc_admin_username');
      const base = import.meta.env.MODE === 'production' ? '/admin/' : '/';
      window.location.href = base;
    }
    return Promise.reject(err);
  }
);

export default api;
