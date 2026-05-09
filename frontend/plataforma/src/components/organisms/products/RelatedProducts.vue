<script setup lang="ts">

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import ProductCard from '../../molecules/ProductCard.vue'

const relatedProducts = [

  {
    id: 1,

    image: new URL('../../../assets/recom1.png', import.meta.url).href,

    category: 'TORTAS',

    name: 'Torta de Primavera',

    description:
      'Torta fresca y colorida, con sabores ligeros y frutales.',

    price: 60,

    isNew: true
  },

  {
    id: 2,

    image: new URL('../../../assets/recom2.png', import.meta.url).href,

    category: 'GALLETAS',

    name: 'Choco comi',

    description:
      'Exquisita torta de chocolate con un toque cremoso.',

    price: 40
  },

  {
    id: 3,

    image: new URL('../../../assets/recom3.png', import.meta.url).href,

    category: 'TORTAS',

    name: 'Torta de Helada',

    description:
      'Postre frío y refrescante.',

    price: 55
  },

  {
    id: 4,

    image: new URL('../../../assets/recom1.png', import.meta.url).href,

    category: 'CHEESECAKES',

    name: 'Cheesecake Premium',

    description:
      'Cheesecake suave con frutos rojos.',

    price: 70
  },

  {
    id: 5,

    image: new URL('../../../assets/recom2.png', import.meta.url).href,

    category: 'GALLETAS',

    name: 'Cookies Deluxe',

    description:
      'Galletas artesanales rellenas.',

    price: 35
  },

  {
    id: 6,

    image: new URL('../../../assets/recom3.png', import.meta.url).href,

    category: 'TORTAS',

    name: 'Berry Cake',

    description:
      'Torta con crema y frutas frescas.',

    price: 65
  }
]

/* RESPONSIVE */

const cardsPerView = ref(4)

const updateCardsPerView = () => {

  const width = window.innerWidth

  /* DESKTOP */
  if (width >= 1400) {

    cardsPerView.value = 4
  }

  /* TABLET GRANDE */
  else if (width >= 1024) {

    cardsPerView.value = 4
  }

  /* TABLET */
  else if (width >= 768) {

    cardsPerView.value = 3
  }

  /* MOBILE */
  else {

    cardsPerView.value = 1
  }
}

onMounted(() => {

  updateCardsPerView()

  window.addEventListener(
    'resize',
    updateCardsPerView
  )
})

onBeforeUnmount(() => {

  window.removeEventListener(
    'resize',
    updateCardsPerView
  )
})

/* SLIDER */

const currentIndex = ref(0)

const maxIndex = computed(() => {

  return Math.max(
    relatedProducts.length - cardsPerView.value,
    0
  )
})

const visibleProducts = computed(() => {

  return relatedProducts.slice(
    currentIndex.value,
    currentIndex.value + cardsPerView.value
  )
})

const nextSlide = () => {

  if (currentIndex.value < maxIndex.value) {

    currentIndex.value++
  }
}

const prevSlide = () => {

  if (currentIndex.value > 0) {

    currentIndex.value--
  }
}
</script>

<template>

  <section class="related-products">

    <h2 class="related-title">
      Productos Relacionados
    </h2>

    <div class="related-wrapper">

      <!-- LEFT -->
      <button
        class="nav-btn"
        @click="prevSlide"
        :disabled="currentIndex === 0"
      >
        ‹
      </button>

      <!-- SLIDER -->
      <div class="slider-container">

        <TransitionGroup
          name="slide"
          tag="div"
          class="related-grid"
        >

          <ProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            v-bind="product"
          />

        </TransitionGroup>

      </div>

      <!-- RIGHT -->
      <button
        class="nav-btn"
        @click="nextSlide"
        :disabled="currentIndex >= maxIndex"
      >
        ›
      </button>

    </div>

  </section>

</template>

