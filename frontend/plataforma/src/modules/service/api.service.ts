const API_URL = 'http://localhost:3000/api';

export const apiService = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      // Maneja respuestas vacías o errores HTML del backend
      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {
          message: `Error ${response.status}: ${response.statusText}`,
        };
      }

      // Error personalizado
      if (!response.ok) {
        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error.message);

      // Error de conexión
      if (error.name === 'TypeError') {
        throw new Error('No se pudo conectar con el servidor');
      }

      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint, {
      method: 'GET',
    });
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};