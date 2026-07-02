import { apiService } from '../lib/api'

export interface Product {
  id: number
  nombre: string
  precio: number
  categoria: string
  stock: number
  descripcion?: string
  imagen_url?: string[]
  vendidos?: number
  disponible?: boolean
}

export interface ProductOption {
  id?: number
  nombre: string
  precio_adicional: number
}

const productsService = {
  async fetchAll(): Promise<Product[]> {
    const response: any = await apiService.get('/productos')
    return Array.isArray(response) ? response : (response?.data || response?.products || [])
  },

  async create(payload: any): Promise<Product> {
    const response: any = await apiService.post('/admin/productos', payload)
    return response?.product || response
  },

  async update(id: number, payload: any): Promise<Product> {
    const response: any = await apiService.put(`/productos/${id}`, payload)
    return response?.product || response?.data || response
  },

  async delete(id: number): Promise<void> {
    await apiService.delete(`/productos/${id}`)
  },

  async toggleAvailability(id: number, disponible: boolean, product: Product): Promise<void> {
    await apiService.put(`/productos/${id}`, {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock: product.stock,
      imagenUrls: product.imagen_url,
      disponible
    })
  },

  async fetchOptions(productId: number): Promise<ProductOption[]> {
    const resp: any = await apiService.get(`/admin/productos/${productId}/options`)
    return resp?.data || resp || []
  },

  async createOption(productId: number, option: ProductOption): Promise<void> {
    await apiService.post(`/admin/productos/${productId}/options`, option)
  },

  async updateOption(productId: number, optionId: number, option: ProductOption): Promise<void> {
    await apiService.put(`/admin/productos/${productId}/options/${optionId}`, option)
  },

  async deleteOption(productId: number, optionId: number): Promise<void> {
    await apiService.delete(`/admin/productos/${productId}/options/${optionId}`)
  },

  async fetchCategories(): Promise<string[]> {
    try {
      const data: any = await apiService.get('/categories')
      const raw = Array.isArray(data) ? data : data?.categories || data?.data || []
      return raw.map((c: any) => c.nombre || c.name || c)
    } catch {
      return []
    }
  }
}

export default productsService