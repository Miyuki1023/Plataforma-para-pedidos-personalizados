import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../lib/api'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<any[]>([])
  const loading = ref(false)

  // 🔥 Cargar favoritos
  const fetchFavorites = async () => {
    try {
      loading.value = true
      const data = await api.get('/favorites')

      favorites.value = data?.data ?? data ?? []
    } catch (error) {
      console.error('Error fetching favorites:', error)
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // 🔥 Agregar
  const addFavorite = async (productId: string | number) => {
    if (!productId || productId === 'undefined') return false;
    const cleanId = String(productId).replace('id:', '').trim();
    if (isFavorite(cleanId)) return true; // Evitar llamada si ya es favorito localmente

    try {
      await api.post(`/favorites/${cleanId}`, {})
      await fetchFavorites()
      return true
    } catch (error) {
      console.error('Error adding favorite:', error)
      return false
    }
  }

  // 🔥 Eliminar
  const removeFavorite = async (productId: string | number) => {
    if (!productId || productId === 'undefined') return false;
    const cleanId = String(productId).replace('id:', '').trim();
    try {
      await api.delete(`/favorites/${cleanId}`)
      await fetchFavorites()
      return true
    } catch (error) {
      console.error('Error removing favorite:', error)
      return false
    }
  }

  // 🔥 Toggle
  const toggleFavorite = async (product: any) => {
    const id = String(product.id || product.id_producto || '').replace('id:', '').trim()
    if (!id || id === 'undefined') return

    const isFav = isFavorite(id)

    if (isFav) {
      await removeFavorite(id)
    } else {
      await addFavorite(id)
    }
  }

  // 🔥 check
  const isFavorite = (id: string | number) => {
    const searchId = String(id).replace('id:', '').trim();
    return favorites.value.some(p => {
      const pId = String(p.id || p.id_producto || '').replace('id:', '').trim();
      return pId === searchId;
    });
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  }
})