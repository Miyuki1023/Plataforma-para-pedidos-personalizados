import axios from 'axios'

const api = axios.create({
  // Es preferible usar /api para aprovechar el proxy de Vite configurado en vite.config.ts
  // Esto evita problemas de CORS y discrepancias en las rutas durante el desarrollo.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

// Interceptor para adjuntar automáticamente el token JWT de localStorage en cada petición
api.interceptors.request.use((config) => {
  // Log para depurar qué está saliendo del frontend
  if (import.meta.env.DEV) {
    console.log(`[API] Enviando ${config.method?.toUpperCase()} a ${config.url}`, config.data);
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
