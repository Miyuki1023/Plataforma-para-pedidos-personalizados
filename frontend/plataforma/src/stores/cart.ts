import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface CartItem {
  id: string | number
  image: string
  name: string
  description: string
  size: string
  avoidIngredient: string
  toppings: string[]
  message: string
  quantity: number
  price: number
  unitPrice: number
  stock: number
  preparationTime: string
  customizations: string
  personalized: boolean
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  /* ── Persistencia LocalStorage ── */
  const STORAGE_KEY = 'vainilla-cart'

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        items.value = JSON.parse(saved)
      }
    } catch {
      items.value = []
    }
  }

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  // Auto-persist on change
  watch(items, saveToStorage, { deep: true })

  /* ── Computed ── */
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const deliveryPrice = computed(() => {
    // Envío gratis sobre S/80
    return subtotal.value >= 80 ? 0 : 10
  })

  const savings = computed(() => {
    // Simular ahorro si hay promociones
    let total = 0
    items.value.forEach(item => {
      if (item.quantity >= 3) {
        total += item.unitPrice * item.quantity * 0.1 // 10% descuento por volumen
      }
    })
    return total
  })

  const total = computed(() => subtotal.value + deliveryPrice.value - savings.value)

  const freeShippingProgress = computed(() => {
    if (subtotal.value >= 80) return 100
    return Math.round((subtotal.value / 80) * 100)
  })

  const freeShippingRemaining = computed(() => {
    const remaining = 80 - subtotal.value
    return remaining > 0 ? remaining : 0
  })

  /* ── Actions ── */
  const addItem = (product: CartItem) => {
    const existing = items.value.find(
      i => i.id === product.id && i.size === product.size &&
           JSON.stringify(i.toppings) === JSON.stringify(product.toppings) &&
           i.message === product.message &&
           i.avoidIngredient === product.avoidIngredient
    )

    if (existing) {
      existing.quantity += product.quantity
    } else {
      items.value.push({ ...product })
    }
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  const removeItem = (id: string | number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  const hasItem = (id: string | number) => {
    return items.value.some(i => i.id === id)
  }

  // Initialize
  loadFromStorage()

  return {
    items,
    totalItems,
    subtotal,
    deliveryPrice,
    savings,
    total,
    freeShippingProgress,
    freeShippingRemaining,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    hasItem,
    loadFromStorage
  }
})