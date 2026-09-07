import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function assetUrl(fileName: string): string {
  const trimmed = fileName.replace(/^\/+/, '');
  return `${API_BASE_URL}/assets/inmuebles/${trimmed}`;
}

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const headers = authHeader();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});
