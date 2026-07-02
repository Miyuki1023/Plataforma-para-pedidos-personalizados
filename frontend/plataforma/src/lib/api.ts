import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// ============================================================
// 1. TIPOS DE ERROR
// ============================================================
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ============================================================
// 2. INSTANCIA AXIOS
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API_BASE_URL is resolved with fallback

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// 3. INTERCEPTORES
// ============================================================

// Request — Inyectar token + logging en dev
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => Promise.reject(error)
);

// Response — Extraer data + errores consistentes
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      return Promise.reject(
        new ApiError(message, error.response.status, error.response.data)
      );
    }

    if (error.request) {
      return Promise.reject(new ApiError('No se pudo conectar con el servidor.', 0));
    }

    return Promise.reject(new ApiError('Ocurrió un error inesperado.', 0));
  }
);

// ============================================================
// 4. API SERVICE — Interfaz unificada con tipos genéricos
// ============================================================
export const apiService = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.get(url, config) as any;
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.post(url, data, config) as any;
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.put(url, data, config) as any;
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.patch(url, data, config) as any;
  },


  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete(url, config) as any;
  },
};

export default api;