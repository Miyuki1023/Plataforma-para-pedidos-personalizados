<!-- CatalogView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

import ProductFilter from '../../molecules/FiltroCard.vue'
import ProductCard from '../../molecules/ProductCard.vue'

const search = ref('')

const selectedCategories = ref<string[]>([])
const minPrice = ref(20)
const maxPrice = ref(400)

const products = [
  {
    id: 1,
    image: new URL('../../../assets/recom1.png', import.meta.url).href,
    category: 'TORTAS',
    name: 'Torta de Primavera',
    description: 'Torta fresca y colorida, con sabores ligeros y relleno de frutas.',
    price: 60,
    isNew: true
  },

  {
    id: 2,
    image: new URL('../../../assets/recom2.png', import.meta.url).href,
    category: 'GALLETAS',
    name: 'Choco comi',
    description: 'Exquisita torta de chocolate con un toque especial de vainilla.',
    price: 40
  },

  {
    id: 3,
    image: new URL('../../../assets/recom3.png', import.meta.url).href,
    category: 'TORTAS',
    name: 'Torta de Helada',
    description: 'Postre frío y refrescante, con capas suaves de crema y fruta.',
    price: 55
  },

  {
    id: 4,
    image: new URL('../../../assets/recom1.png', import.meta.url).href,
    category: 'CHEESECAKES',
    name: 'Cheesecake Frutal',
    description: 'Base crocante y crema suave con topping de frutos.',
    price: 70
  },

  {
    id: 5,
    image: new URL('../../../assets/recom2.png', import.meta.url).href,
    category: 'GALLETAS',
    name: 'Cookies Deluxe',
    description: 'Galletas artesanales rellenas de chocolate.',
    price: 35
  },

  {
    id: 6,
    image: new URL('../../../assets/recom3.png', import.meta.url).href,
    category: 'TORTAS',
    name: 'Berry Cake',
    description: 'Sabores suaves con frutas frescas y crema.',
    price: 65
  }
]



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

  return products.filter((product) => {

    /* SEARCH */
    const matchesSearch =

      product.name
        .toLowerCase()
        .includes(search.value.toLowerCase())

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

        <div class="products-grid">

          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            v-bind="product"
            @add-to-cart="() => {}"
          />

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