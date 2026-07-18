import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://exxample.in/api';

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the JWT bearer token from Zustand auth store
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to intercept global errors (e.g. 401 Unauthorized session invalidations)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      
      // If unauthorized, invalidate local session and redirect
      if (status === 401) {
        await useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
