<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed, shallowRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { apiService } from '../../lib/api'

import { useCartStore } from '../../stores/cart'
import BaseIcon from '../atoms/BaseIcon.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)

const navbarRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const searchQuery = ref('')
const allProducts = shallowRef<any[]>([])
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const fetchSearchResults = async (query: string) => {
  if (!query.trim()) {
    allProducts.value = []
    return
  }
  try {
    // Use search endpoint that limits results server-side instead of fetching all
    const data = await apiService.get(`/productos?limit=8&search=${encodeURIComponent(query)}`)
    const items = Array.isArray(data) ? data : (data.products || [])
    allProducts.value = items.slice(0, 5)
  } catch {
    // Fallback to empty on error
    allProducts.value = []
  }
}

const debouncedSearch = (query: string) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchSearchResults(query), 300)
}

const filteredResults = computed(() => allProducts.value)

const goToProduct = (p: any) => {
  const id = p.id || p.id_producto || p._id
  if (!id) return
  router.push(`/producto/${id}`)
  isSearchOpen.value = false
  searchQuery.value = ''
  allProducts.value = []
}

const profileLink = computed(() => {
  return authStore.user ? '/perfil' : '/login'
})

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value

  if (!isSearchOpen.value) {
    searchQuery.value = ''
    allProducts.value = []
  } else {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    navbarRef.value &&
    !navbarRef.value.contains(event.target as Node)
  ) {
    isSearchOpen.value = false
    searchQuery.value = ''
    allProducts.value = []
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
  <header class="navbar" ref="navbarRef">

    <!-- MENU -->
    <button
      class="icon-btn"
      @click="toggleMenu"
      aria-label="Abrir menú de navegación"
    >
      <BaseIcon name="menu" :size="20" />
    </button>

    <!-- LOGO -->
    <RouterLink 
      to="/home" 
      class="navbar-brand" 
      :class="{ 'logo-compact': isSearchOpen }"
      aria-label="Ir a inicio"
      style="padding: 0.5rem 0;"
    >Vainilla y miel</RouterLink>

    <!-- ACTIONS -->
    <div class="navbar-actions">

       <!-- SEARCH -->
      <div class="search-wrapper">
        <Transition name="search-pop" mode="out-in">
          <!-- INPUT (Se muestra si está abierto) -->
          <div
            v-if="isSearchOpen"
            key="search-box"
            class="search-box"
          >
            <BaseIcon
              name="search"
              :size="18"
              class="search-inside-icon"
            />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar..."
              class="search-input"
              aria-label="Buscar productos"
              @input="debouncedSearch(searchQuery)"
            />

            <!-- RESULTADOS DE BÚSQUEDA -->
            <div v-if="searchQuery.length > 0" class="search-results">
              <template v-if="filteredResults.length > 0">
                <button
                  v-for="p in filteredResults"
                  :key="p.id"
                  class="result-item"
                  @click="goToProduct(p)"
                >
                  <img :src="p.imagen_url || p.imagen || '/placeholder.png'" class="result-img" alt="" width="44" height="44" loading="lazy" decoding="async" />
                  <div class="result-info">
                    <span class="result-name">{{ p.nombre || p.name }}</span>
                    <span class="result-price">S/ {{ p.precio || p.price }}</span>
                  </div>
                  <span class="result-arrow">›</span>
                </button>
              </template>
              <div v-else class="no-results">
                No hay resultados para "{{ searchQuery }}"
              </div>
            </div>
          </div>

          <!-- BOTÓN (Se muestra si está cerrado) -->
          <button
            v-else
            key="search-button"
            class="icon-btn"
            @click.stop="toggleSearch"
            aria-label="Abrir búsqueda"
          >
            <BaseIcon name="search" :size="20" />
          </button>
        </Transition>
      </div>

      <!-- USER / LOGIN -->
       <!-- USER -->
      <RouterLink class="icon-btn" :to="profileLink" :aria-label="authStore.user ? 'Ir a mi perfil' : 'Iniciar sesión'">
        <BaseIcon name="user" :size="20" />
      </RouterLink>

      <!-- CART -->
      <RouterLink class="icon-btn cart-btn" :to="{ name: 'carrito' }" aria-label="Ir al carrito">
        <BaseIcon name="cart" :size="20" />
        <span v-if="cartStore.totalItems > 0" class="cart-badge animate-bounceIn">
          {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
        </span>
      </RouterLink>
    </div>
  </header>
<!-- SIDEBAR -->
<transition name="slide">

  <aside
    v-if="isMenuOpen"
    class="sidebar"
  >

    <div class="sidebar-header">

      <h2>
        Vainilla y miel
      </h2>

      <button
        class="close-btn"
        @click="toggleMenu"
        aria-label="Cerrar menú"
      >
        ✕
      </button>

    </div>

    <nav class="sidebar-nav">

      <!-- HOME -->
      <RouterLink
        to="/home"
        class="sidebar-link"
        @click="closeMenu"
      >
        Inicio
      </RouterLink>

      <!-- CATALOGO -->
      <RouterLink
        to="/catalogo"
        class="sidebar-link"
        @click="closeMenu"
      >
        Antojitos
      </RouterLink>

      <!-- ABOUT -->
      <RouterLink
        to="/sobre-nosotros"
        class="sidebar-link"
        @click="closeMenu"
      >
        Sobre nosotros
      </RouterLink>

    </nav>

  </aside>

</transition>
  <!-- OVERLAY -->
  <div
    v-if="isMenuOpen"
    class="overlay"
    @click="toggleMenu"
  />
</template>

<style scoped>
.cart-btn {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 6px rgba(139,26,46,0.3);
  pointer-events: none;
}

.search-wrapper {
  position: relative;
}

.search-results {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  border: 1px solid #ead8c8;
  overflow: hidden;
  z-index: 1000;
  animation: slideDown .2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: #fdf8f5;
}

.result-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2f2f2f;
}

.result-price {
  font-size: 0.8rem;
  color: #8b3134;
  font-weight: 600;
}

.result-arrow {
  color: #ead8c8;
  font-size: 1.2rem;
}

.no-results {
  padding: 1.2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #857871;
}
</style>
