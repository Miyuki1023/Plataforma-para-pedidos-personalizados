import { apiService } from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  usuario: string;
  email: string;
  password: string;
  fecha_nacimiento?: string;
  sexo?: string;
  telefono?: string;
}

export interface User {
  id: number;
  usuario: string;
  email: string;
  id_rol: number;
  activo: boolean;
}

export const authService = {
  login(credentials: LoginCredentials) {
    return apiService.post<{ user: User; token: string }>('/auth/login', credentials);
  },

  register(userData: RegisterData) {
    return apiService.post('/auth/register', userData);
  },

  getProfile() {
    return apiService.get<{ user: User }>('/user/profile');
  },

  updateProfile(data: Partial<User>) {
    return apiService.put<{ user: User }>('/user/profile', data);
  },
};