import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../modules/service/api.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');

  const login = async (credentials: any) => {
    const data = await apiService.post('/auth/login', credentials);
    const profile = data.user || data;

    user.value = profile;
    token.value = data.token;

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(profile));
  };

  const logout = () => {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData: any) => {
    // Enviamos los datos al backend (usuario, email, password, etc.)
    return await apiService.post('/auth/register', userData);
  };

  const fetchProfile = async () => {
    const data = await apiService.get('/user/profile');
    const profile = data.user || data;
    user.value = profile;
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const updateProfile = async (updateData: any) => {
    const data = await apiService.put('/user/profile', updateData);
    const profile = data.user || data;
    user.value = profile;
    localStorage.setItem('user', JSON.stringify(profile));
    return data;
  };

  return {
    user,
    token,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
  };
});