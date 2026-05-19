<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'

import ProductCard from '../../molecules/ProductCard.vue'
import BaseButton from '../../atoms/BaseButton.vue'
import BaseIcon from '../../atoms/BaseIcon.vue'
import { apiService } from '../../../modules/service/api.service'

const products = ref<any[]>([])
const loading = ref(true)

const currentIndex = ref(0)

/* CUÁNTOS SE VEN */
const visibleCount = 3

/* NEXT */
const nextSlide = () => {
  if (currentIndex.value < products.value.length - visibleCount) {
    currentIndex.value++
  }
}

/* PREV */
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

/* MOSTRAR FLECHAS SOLO SI HAY MÁS DE 3 */
const showArrows = computed(() => {
  return products.value.length > visibleCount
})

onMounted(async () => {
  try {
    loading.value = true

    const data = await apiService.get('/productos')

    const rawProducts = Array.isArray(data)
      ? data
      : (data.products || [])

    const today = new Date().toDateString()

    products.value = rawProducts.slice(1, 8).map((p: any) => {
      const imgSource =
        p.imagen_url ||
        p.imagen ||
        p.image ||
        p.imageUrl

      const finalImg = Array.isArray(imgSource)
        ? imgSource[0]
        : imgSource

      return {
        id: p.id || p.id_producto || p._id,
        name: p.nombre || p.name,
        price: Number(p.precio || p.price || 0),
        description: p.descripcion || p.description,
        category: String(
          p.categoria || p.category || 'OTROS'
        ).toUpperCase(),
        image: finalImg,
        imageUrl: finalImg,
        isNew: p.fecha_creacion
          ? new Date(p.fecha_creacion).toDateString() === today
          : false
      }
    })
  } catch (err) {
    console.error('Error al cargar recomendados:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="section testi-section">

    <!-- INTRO -->
    <div class="section-intro">

      <span class="section-eyebrow">
        SELECCIÓN ESPECIAL
      </span>

      <h2 class="section-heading">
        Recomendados para ti
      </h2>

    </div>

    <!-- CAROUSEL -->
    <div class="carousel-wrapper">

      <!-- LEFT -->
      <button
        v-if="showArrows"
        class="nav-btn"
        @click="prevSlide"
      >
        <BaseIcon
          name="arrow-left"
          :size="22"
          color="var(--primary)"
        />
      </button>

      <!-- CONTAINER -->
      <div class="carousel-container">

        <div
          v-if="loading"
          class="loading-placeholder"
        >
          Cargando recomendaciones...
        </div>

        <!-- TRACK -->
        <div
          v-else
          class="products-carousel"
          :style="{
            transform: `translateX(-${currentIndex * 33.33}%)`
          }"
        >

          <div
            v-for="p in products"
            :key="p.id"
            class="carousel-item"
          >

            <ProductCard
              v-bind="p"
              @add-to-cart="() => {}"
            />

          </div>

        </div>

        <!-- EMPTY -->
        <p
          v-if="!loading && products.length === 0"
          class="no-data"
        >
          No hay productos recomendados disponibles.
        </p>

      </div>

      <!-- RIGHT -->
      <button
        v-if="showArrows"
        class="nav-btn"
        @click="nextSlide"
      >
        <BaseIcon
          name="arrow-right"
          :size="22"
          color="var(--primary)"
        />
      </button>

    </div>

    <!-- BUTTON -->
    <div class="center-btn">

      <RouterLink to="/catalogo">

        <BaseButton variant="ghost">
          Explorar catálogo
        </BaseButton>

      </RouterLink>

    </div>

  </section>
</template>

<style scoped>

.products-section {
  width: 100%;
  padding: 4rem;
  margin: 7px auto;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 2rem auto;
}

.carousel-container {
  overflow: hidden;
  width: 100%;
}

/* TRACK */

.products-carousel {
  display: flex;
  transition: transform 0.5s ease;
  will-change: transform;
}

/* ITEMS */

.carousel-item {
  min-width: 100%;
  padding: 0 0.7rem;
  box-sizing: border-box;

  flex-shrink: 0;
}

/* TABLET */
@media (min-width: 768px) {

  .carousel-item {
    min-width: 50%;
  }

}

/* DESKTOP */
@media (min-width: 1024px) {

  .carousel-item {
    min-width: 33.33%;
  }

}



</style>