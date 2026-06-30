import { apiService } from '../lib/api';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  categoria?: string;
  activo?: boolean;
}

export const productsService = {
  getAll(params?: Record<string, any>) {
    return apiService.get<{ products: Product[] } | Product[]>('/productos', { params });
  },

  getById(id: string | number) {
    return apiService.get<Product>(`/productos/${id}`);
  },

  create(data: Partial<Product>) {
    return apiService.post<Product>('/productos', data);
  },

  update(id: string | number, data: Partial<Product>) {
    return apiService.put<Product>(`/productos/${id}`, data);
  },

  delete(id: string | number) {
    return apiService.delete(`/productos/${id}`);
  },
};