<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'

import { useRouter } from 'vue-router'
import CategoryChip from '../../molecules/Category.vue'

const router = useRouter()

const categories = [

  {
    label: 'Promos',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=80'
  },

  {
    label: 'Tortas',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=120&q=80'
  },

  {
    label: 'Cupcake',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=120&q=80'
  },

  {
    label: 'Galletas',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=120&q=80'
  },

  {
    label: 'Bocaditos',
    image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=120&q=80'
  },

  {
    label: 'Pastelería Salada',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80'
  },

  {
    label: 'Cheesecakes',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=120&q=80'
  }
]

const activeCategory = ref('Tortas')

const goToCategory = (category: string) => {

  activeCategory.value = category

  router.push({
    path: '/catalogo',
    query: {
      categoria: category.toUpperCase()
    }
  })
}

const chipsRowRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const showScrollIndicator = ref(false)

const updateScrollProgress = () => {

  if (chipsRowRef.value) {

    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = chipsRowRef.value

    const maxScroll =
      scrollWidth - clientWidth

    if (maxScroll > 0) {

      scrollProgress.value =
        (scrollLeft / maxScroll) * 100

      showScrollIndicator.value = true

    } else {

      scrollProgress.value = 0
      showScrollIndicator.value = false
    }
  }
}

const checkScrollability = () => {

  nextTick(() => {

    if (chipsRowRef.value) {

      showScrollIndicator.value =
        chipsRowRef.value.scrollWidth >
        chipsRowRef.value.clientWidth

      updateScrollProgress()
    }
  })
}

onMounted(() => {

  if (chipsRowRef.value) {

    chipsRowRef.value.addEventListener(
      'scroll',
      updateScrollProgress
    )
  }

  window.addEventListener(
    'resize',
    checkScrollability
  )

  checkScrollability()
})

onBeforeUnmount(() => {

  if (chipsRowRef.value) {

    chipsRowRef.value.removeEventListener(
      'scroll',
      updateScrollProgress
    )
  }

  window.removeEventListener(
    'resize',
    checkScrollability
  )
})
</script>
<template>
    <section class="categories-section">
      
      <div class="categories-left">
        <span class="section-eyebrow">CATEGORÍAS</span>
        <h2 class="section-title-sm">Encuentra tu postre ideal</h2>
      </div>
      <div class="chips-row-wrapper"> <!-- Nuevo contenedor para la fila de chips y el indicador -->
        <div class="chips-row" ref="chipsRowRef">
        <CategoryChip
          v-for="cat in categories"
          :key="cat.label"
          :label="cat.label"
          :image="cat.image"
          :active="activeCategory === cat.label"
          @click="goToCategory(cat.label)"
        />
      </div>
      <div v-if="showScrollIndicator" class="scroll-indicator">
        <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
      </div>
      </div>
    </section>
    </template>