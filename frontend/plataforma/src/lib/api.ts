import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
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

// Interceptor de respuesta para unificar con el sistema de tu compañera
// Esto permite que 'await api.get()' devuelva directamente el contenido de los datos
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

export const apiService = api
export default api