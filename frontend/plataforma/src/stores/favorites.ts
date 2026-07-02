import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../lib/api'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ Garantiza que favorites SIEMPRE sea un array
  const ensureArray = (data: any): any[] => {
    if (Array.isArray(data)) return data
    if (data === null || data === undefined) return []
    if (typeof data === 'object' && data !== null) {
      // Podría ser un objeto con propiedad data o results
      if (Array.isArray(data.data)) return data.data
      if (Array.isArray(data.results)) return data.results
      // Podría ser un objeto plano -> convertirlo a array de un solo elemento no tiene sentido, mejor []
      return []
    }
    return []
  }

  // ✅ Normaliza un producto de favorito para evitar undefined en propiedades clave
  const normalizeProduct = (p: any): any => {
    if (!p || typeof p !== 'object') return null
    return {
      ...p,
      id: p.id ?? p.id_producto ?? p.id_promocion ?? 0,
      id_producto: p.id_producto ?? p.id ?? null,
      nombre: p.nombre ?? p.name ?? 'Sin nombre',
      name: p.name ?? p.nombre ?? 'Sin nombre',
      precio: p.precio ?? p.price ?? 0,
      price: p.price ?? p.precio ?? 0,
      imagen_url: p.imagen_url ?? p.imageUrl ?? p.image ?? p.foto ?? '',
      imageUrl: p.imageUrl ?? p.imagen_url ?? p.image ?? p.foto ?? '',
    }
  }

  // 🔥 Cargar favoritos
  const fetchFavorites = async () => {
    try {
      loading.value = true
      error.value = null
      const raw = await apiService.get<any>('/favorites')
      const arr = ensureArray(raw)
      favorites.value = arr.map(normalizeProduct).filter(Boolean)
    } catch (err) {
      console.error('[FavoritesStore] Error fetching favorites:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar favoritos'
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // 🔥 Agregar
  const addFavorite = async (productId: string | number) => {
    if (!productId || productId === 'undefined') return false
    const cleanId = String(productId).replace('id:', '').trim()
    if (!cleanId) return false
    if (isFavorite(cleanId)) return true

    try {
      await apiService.post(`/favorites/${cleanId}`, {})
      await fetchFavorites()
      return true
    } catch (err) {
      console.error('[FavoritesStore] Error adding favorite:', err)
      return false
    }
  }

  // 🔥 Eliminar
  const removeFavorite = async (productId: string | number) => {
    if (!productId || productId === 'undefined') return false
    const cleanId = String(productId).replace('id:', '').trim()
    if (!cleanId) return false
    try {
      await apiService.delete(`/favorites/${cleanId}`)
      await fetchFavorites()
      return true
    } catch (err) {
      console.error('[FavoritesStore] Error removing favorite:', err)
      return false
    }
  }

  // 🔥 Toggle
  const toggleFavorite = async (product: any) => {
    if (!product) return
    const id = String(product.id || product.id_producto || '').replace('id:', '').trim()
    if (!id || id === 'undefined') return

    if (isFavorite(id)) {
      await removeFavorite(id)
    } else {
      await addFavorite(id)
    }
  }

  // 🔥 isFavorite — Robusto contra null/undefined/object
  const isFavorite = (id: string | number): boolean => {
    if (!id || id === 'undefined') return false
    const searchId = String(id).replace('id:', '').trim()
    if (!searchId) return false

    // Protección: favorites.value SIEMPRE es un array
    const list = Array.isArray(favorites.value) ? favorites.value : []
    return list.some((p: any) => {
      if (!p || typeof p !== 'object') return false
      const pId = String(p.id || p.id_producto || '').replace('id:', '').trim()
      return pId === searchId
    })
  }

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  }
})
