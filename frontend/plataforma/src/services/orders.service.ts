import { apiService } from '../lib/api';

export type OrderStatus = 'pendiente' | 'preparacion' | 'listo' | 'entregado' | 'cancelado';

export interface Order {
  id_pedido: number;
  cliente_nombre: string;
  trabajador_nombre?: string;
  fecha_creacion: string;
  total: number;
  estado_pedido: OrderStatus;
  direccion_manual?: string;
  usuario?: string;
}

export interface OrderDetail {
  id_pedido: number;
  cliente_nombre: string;
  total: number;
  estado_pedido: OrderStatus;
  detalle_pedido: OrderItemDetail[];
}

export interface OrderItemDetail {
  cantidad: number;
  subtotal: number;
  precio: number;
  opciones: any[];
}

export const ordersService = {
  getAll(params?: Record<string, any>) {
    return apiService.get<{ orders: Order[] }>('/orders', { params });
  },

  getById(id: string | number) {
    return apiService.get<{ order: OrderDetail }>(`/orders/${id}`);
  },

  updateStatus(id: string | number, status: OrderStatus) {
    return apiService.patch(`/orders/${id}/status`, { estado_pedido: status });
  },

  getStats(params?: Record<string, any>) {
    return apiService.get('/orders', { params });
  },
};