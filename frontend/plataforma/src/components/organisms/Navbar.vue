<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { apiService } from '../../modules/service/api.service'

import BaseIcon from '../atoms/BaseIcon.vue'

const authStore = useAuthStore()
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
const allProducts = ref<any[]>([])
const searchLoading = ref(false)

const fetchProducts = async () => {
  if (allProducts.value.length > 0) return
  searchLoading.value = true
  try {
    const data = await apiService.get('/productos')
    allProducts.value = Array.isArray(data) ? data : (data.products || [])
  } catch (err) {
    console.error('Error fetching search products:', err)
  } finally {
    searchLoading.value = false
  }
}

const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return allProducts.value.filter(p => 
    (p.nombre || p.name || '').toLowerCase().includes(q)
  ).slice(0, 5)
})

const goToProduct = (p: any) => {
  const id = p.id || p.id_producto || p._id
  router.push(`/producto/${id}`)
  isSearchOpen.value = false
  searchQuery.value = ''
}

// Si el usuario está autenticado, lo lleva a su perfil, de lo contrario al login
const profileLink = computed(() => {
  return authStore.user ? '/perfil' : '/login'
})

const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value

  if (isSearchOpen.value) {
    await fetchProducts()
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    searchQuery.value = ''
  }
}

const handleClickOutside = (event: MouseEvent) => {

  if (
    navbarRef.value &&
    !navbarRef.value.contains(event.target as Node)
  ) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="navbar" ref="navbarRef">

    <!-- MENU -->
    <button
    
      class="icon-btn"
      @click="toggleMenu"
    >
      <BaseIcon name="menu" :size="20" />
    </button>

    <!-- LOGO -->
    <RouterLink 
      to="/home" 
      class="navbar-brand" 
      :class="{ 'logo-compact': isSearchOpen }"
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
                  <img :src="p.imagen_url || p.imagen || '/placeholder.png'" class="result-img" />
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
          >
            <BaseIcon name="search" :size="20" />
          </button>
        </Transition>
      </div>

      <!-- USER -->
      <RouterLink class="icon-btn" :to="profileLink">
        <BaseIcon name="user" :size="20" />
      </RouterLink>

      <!-- CART -->
      <RouterLink class="icon-btn" :to="{ name: 'carrito' }">
        <BaseIcon name="cart" :size="20" />
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
