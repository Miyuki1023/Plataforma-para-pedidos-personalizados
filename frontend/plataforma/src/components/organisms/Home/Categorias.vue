<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import CategoryChip from '../../molecules/Category.vue'

const router = useRouter()

// Optimized Unsplash URLs: auto=format for WebP, fit=crop, exact display size (60px), q=75 for quality vs size balance
const categories = [
  { label: 'Promos', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=60&q=75' },
  { label: 'Tortas', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=60&q=75' },
  { label: 'Cupcake', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=60&q=75' },
  { label: 'Galletas', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=60&q=75' },
  { label: 'Bocaditos', image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=60&q=75' },
  { label: 'Pastelería Salada', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=60&q=75' },
  { label: 'Cheesecakes', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=60&q=75' }
]

const route = useRoute()

const getInitialCategory = () => {
  const queryCat = String(route.query.categoria || '').toUpperCase()
  return categories.find(c => c.label.toUpperCase() === queryCat)?.label || 'Tortas'
}

const activeCategory = ref(getInitialCategory())

watch(() => route.query.categoria, () => {
  activeCategory.value = getInitialCategory()
})

const goToCategory = (category: string) => {
  activeCategory.value = category
  router.push({
    path: '/catalogo',
    query: { categoria: category.toUpperCase() }
  })
}

const chipsRowRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const showScrollIndicator = ref(false)

// Batch reads using requestAnimationFrame to avoid forced reflow
const updateScrollProgress = () => {
  requestAnimationFrame(() => {
    const el = chipsRowRef.value
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth

    if (maxScroll > 0) {
      scrollProgress.value = (scrollLeft / maxScroll) * 100
      showScrollIndicator.value = true
    } else {
      scrollProgress.value = 0
      showScrollIndicator.value = false
    }
  })
}

const checkScrollability = () => {
  requestAnimationFrame(() => {
    const el = chipsRowRef.value
    if (!el) return

    showScrollIndicator.value = el.scrollWidth > el.clientWidth
    updateScrollProgress()
  })
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = chipsRowRef.value
  if (el) {
    el.addEventListener('scroll', updateScrollProgress, { passive: true })
  }

  // Use ResizeObserver instead of window resize for better performance
  if (el?.parentElement) {
    resizeObserver = new ResizeObserver(() => checkScrollability())
    resizeObserver.observe(el.parentElement)
  }

  checkScrollability()
})

onBeforeUnmount(() => {
  const el = chipsRowRef.value
  if (el) {
    el.removeEventListener('scroll', updateScrollProgress)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>
<template>
    <section class="categories-section">
      <div class="categories-container">
        <div class="categories-left">
          <span class="section-eyebrow">CATEGORÍAS</span>
          <h2 class="section-title-sm">Encuentra tu postre ideal</h2>
        </div>
        <div class="chips-row-wrapper"> 
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
          <div v-if="showScrollIndicator" class="scroll-indicator-container">
            <div class="scroll-progress-bar" :style="{ transform: 'scaleX(' + (scrollProgress / 100) + ')' }"></div>
          </div>
        </div>
      </div>
    </section>
</template>

<style scoped>
.categories-section {
  width: 100%;
  background-color: #fdf0e8;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.categories-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem 1.25rem;
  align-items: flex-start;
  box-sizing: border-box;
}

.categories-left {
  width: 100%;
  flex-shrink: 0;
  text-align: left;
}



.section-title-sm {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3f0006;
  margin: 0;
  line-height: 1.2;
}

.chips-row-wrapper {
  width: 100%;
  position: relative;
}

.chips-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0 1rem;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chips-row::-webkit-scrollbar {
  display: none;
}

.scroll-indicator-container {
  width: 100%;
  height: 3px;
  background: #f0ebe4;
  border-radius: 10px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.scroll-progress-bar {
  height: 100%;
  background: #8b1a2e;
  border-radius: 10px;
  transform-origin: left center;
  transition: transform 0.2s ease;
}

/* === RESPONSIVE DESIGN === */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .categories-container {
    flex-direction: row;
    align-items: center;
    padding: 3.5rem 2.5rem;
    gap: 3rem;
  }
  .categories-left {
    min-width: 200px;
    max-width: 240px;
  }
  .section-title-sm {
    font-size: 1.8rem;
  }
}

/* Laptop & Desktop (1024px+) */
@media (min-width: 1024px) {
  .categories-container {
    max-width: 1200px;
    padding: 4rem 2rem;
  }
  .section-title-sm {
    font-size: 2rem;
  }
}

/* Ultra Wide (1440px+) */
@media (min-width: 1440px) {
  .categories-container {
    max-width: 1400px;
    margin: 0 auto;
  }
  .categories-left {
    max-width: 320px;
  }
}
</style>