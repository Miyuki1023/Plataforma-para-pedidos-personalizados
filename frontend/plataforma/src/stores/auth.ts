import { defineStore } from "pinia";
import { ref } from "vue";
import { apiService } from "../lib/api";

export interface User {
  id: number;
  email: string;
  usuario?: string;
  apellido?: string;
  name?: string;
  foto_perfil?: string;
  id_rol?: number;
  activo?: boolean;
  telefono?: string;
  fecha_registro?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const token = ref(localStorage.getItem("token") || "");

  const login = async (credentials: { email: string; password: string }) => {
    const data = await apiService.post<LoginResponse>("/auth/login", credentials);
    const profile = data.user;
    user.value = profile;
    token.value = data.token;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(profile));
  };

  const logout = () => {
    user.value = null;
    token.value = "";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const register = async (userData: Record<string, any>) => {
    return await apiService.post("/auth/register", userData);
  };

  const fetchProfile = async () => {
    const data = await apiService.get<{ user: User }>("/user/profile");
    const profile = data.user;
    user.value = profile;
    localStorage.setItem("user", JSON.stringify(profile));
    return profile;
  };

  const updateProfile = async (updateData: Partial<User>) => {
    const data = await apiService.put<{ user: User }>("/user/profile", updateData);
    const profile = data.user;
    user.value = profile;
    localStorage.setItem("user", JSON.stringify(profile));
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