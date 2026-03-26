import axios from 'axios';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';

// Robust API_BASE calculation
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
// Ensure it always ends with /api but no double slash
export const API_BASE = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

// Global Axios Configuration for all components
axios.defaults.baseURL = API_BASE;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('tmc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const token    = localStorage.getItem('tmc_admin_token');
    const username = localStorage.getItem('tmc_admin_username');
    return token ? { token, username } : null;
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (admin?.token) {
      const s = io(SOCKET_URL, {
        reconnectionAttempts: 3,
        timeout: 5000,
        transports: ['websocket']
      });
      setSocket(s);
      return () => s.disconnect();
    }
  }, [admin]);

  const login = (token, username) => {
    localStorage.setItem('tmc_admin_token',    token);
    localStorage.setItem('tmc_admin_username', username);
    setAdmin({ token, username });
    // Force immediate axios reload or page refresh if needed
    window.location.reload(); 
  };

  const logout = () => {
    localStorage.removeItem('tmc_admin_token');
    localStorage.removeItem('tmc_admin_username');
    setAdmin(null);
    if (socket) socket.disconnect();
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, API_BASE, socket }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
