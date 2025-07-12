// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Laravel or any backend
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const api2 = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token dynamically — only in the browser
if (typeof window !== 'undefined') {
  api2.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
