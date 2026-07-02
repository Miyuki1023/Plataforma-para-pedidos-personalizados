/**
 * Shared composable to cache product data and avoid duplicate API requests.
 * When multiple components need the same product data, they share the cache.
 */
import { ref } from 'vue'
import { apiService } from '../lib/api'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()
const CACHE_TTL = 60000 // 60 seconds

function isCacheValid(key: string): boolean {
  const entry = cache.get(key)
  if (!entry) return false
  return Date.now() - entry.timestamp < CACHE_TTL
}

export function useProductCache() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getProducts = async <T>(queryString: string): Promise<T[]> => {
    const cacheKey = `products:${queryString}`

    if (isCacheValid(cacheKey)) {
      return cache.get(cacheKey)!.data as T[]
    }

    loading.value = true
    error.value = null

    try {
      const response = await apiService.get(`/productos${queryString}`)
      const data = Array.isArray(response) ? response : (response.products || [])
      
      cache.set(cacheKey, { data, timestamp: Date.now() })
      return data as T[]
    } catch (err: any) {
      error.value = err.message || 'Error fetching products'
      return []
    } finally {
      loading.value = false
    }
  }

  const clearCache = () => cache.clear()

  return { getProducts, loading, error, clearCache }
}