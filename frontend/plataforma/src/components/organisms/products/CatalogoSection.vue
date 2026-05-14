<!-- CatalogView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import ProductFilter from '../../molecules/FiltroCard.vue'
import ProductCard from '../../molecules/ProductCard.vue'
import { apiService } from '../../../modules/service/api.service'
const search = ref('')

const selectedCategories = ref<string[]>([])
const minPrice = ref(20)
const maxPrice = ref(400)
const loading = ref(true)
const error = ref('')

const products = ref<any[]>([])

onMounted(async () => {
  try {
    loading.value = true
    // Cambiamos a /productos para coincidir con el lenguaje de tu base de datos
    const data = await apiService.get('/productos')
    
    console.log('Datos recibidos del backend:', data)

    // Verificamos si data es un arreglo o si viene dentro de una propiedad
    const rawProducts = Array.isArray(data) ? data : (data.products || [])

    products.value = rawProducts.map((p: any) => ({
      id: p.id,
      name: p.nombre || p.name || 'Producto sin nombre',
      // Aseguramos que el precio sea un número para los filtros
      price: Number(p.precio || p.price || 0),
      description: p.descripcion || p.description || '',
      // Normalizamos la categoría a mayúsculas para el filtrado
      category: String(p.categoria || p.category || 'OTROS').toUpperCase(),
      image: p.imagen_url || p.imagen || p.image || p.imageUrl,
      isNew: p.es_nuevo || p.isNew || false
    }))
  } catch (err: any) {
    error.value = `Error: ${err.message || 'No se pudo conectar con el servidor'}`
    console.error(err)
  } finally {
    loading.value = false
  }
})

const toggleCategory = (category: string) => {

  if (selectedCategories.value.includes(category)) {

    selectedCategories.value =
      selectedCategories.value.filter(c => c !== category)

  } else {

    selectedCategories.value.push(category)
  }
}
/* =========================
   CatalogoSection.vue
   PAGINATION + FILTERS
========================= */

const currentPage = ref(1)

/* 12 productos por página
   (3 columnas x 4 filas) */
const productsPerPage = 12

/* FILTERED PRODUCTS */
const filteredProducts = computed(() => {

  return products.value.filter((product: any) => {

    /* SEARCH */
    const searchTerm = search.value.toLowerCase()
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(searchTerm) ||
      (product.description || '').toLowerCase().includes(searchTerm)

    /* CATEGORY */
    const matchesCategory =

      selectedCategories.value.length === 0 ||

      selectedCategories.value.includes(
        product.category
      )

    /* PRICE */
    const matchesPrice =

      product.price >= minPrice.value &&
      product.price <= maxPrice.value

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice
    )
  })
})

/* TOTAL PAGES */
const totalPages = computed(() => {

  return Math.ceil(
    filteredProducts.value.length /
    productsPerPage
  )
})

/* PRODUCTS PAGINATED */
const paginatedProducts = computed(() => {

  const start =
    (currentPage.value - 1)
    * productsPerPage

  const end =
    start + productsPerPage

  return filteredProducts.value.slice(
    start,
    end
  )
})

/* CHANGE PAGE */
const changePage = (page: number) => {
  currentPage.value = page
}
</script>

<template>

  <section class="catalog-view">

    <!-- HERO -->
    <div class="catalog-hero">

      <h1 class="catalog-title">
        Dulces que alegran tu día
      </h1>

      <p class="catalog-subtitle">
        Encuentra tus postres favoritos,
        hechos con los mejores ingredientes
      </p>

      <!-- SEARCH -->
      <div class="catalog-search">

        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            stroke-width="2"
          />

          <path
            d="M20 20L17 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre o categoría"
        />

        <button
          v-if="search"
          class="clear-btn"
          @click="search = ''"
        >
          ×
        </button>

      </div>

    </div>

    <!-- CONTENT -->
    <div class="catalog-layout">

      <!-- FILTER -->
      <aside class="catalog-sidebar">

        <ProductFilter
        v-model:min-price="minPrice"
        v-model:max-price="maxPrice"
        :selected-categories="selectedCategories"
        @toggle-category="toggleCategory"
/>

      </aside>

      <!-- PRODUCTS -->
      <div class="catalog-products">

        <h2 class="products-title">
          Descubre nuestros favoritos
        </h2>

        <div v-if="loading" class="loading-state">
          <p>Cargando delicias desde la cocina...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <div v-else class="products-grid">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            v-bind="product"
            @add-to-cart="() => {}"
          />
          <p v-if="paginatedProducts.length === 0" class="no-results">
            No se encontraron productos con estos filtros.
          </p>
        </div>

        
        <!-- PAGINATION -->
<div
  v-if="totalPages > 1"
  class="pagination"
>

  <button
    class="page-btn"
    :disabled="currentPage === 1"
    @click="changePage(currentPage - 1)"
  >
    ‹
  </button>

  <button
    v-for="page in totalPages"
    :key="page"
    class="page-btn"
    :class="{
      active: currentPage === page
    }"
    @click="changePage(page)"
  >
    {{ page }}
  </button>

  <button
    class="page-btn"
    :disabled="currentPage === totalPages"
    @click="changePage(currentPage + 1)"
  >
    ›
  </button>

</div>

      </div>

    </div>

  </section>

</template>