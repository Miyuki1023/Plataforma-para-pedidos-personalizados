<script setup lang="ts">
import { ref, onMounted, computed, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'

import ProductCard from '../../molecules/ProductCard.vue'
import BaseButton from '../../atoms/BaseButton.vue'
import BaseIcon from '../../atoms/BaseIcon.vue'
import { apiService } from '../../../lib/api'

const products = shallowRef<any[]>([])
const loading = ref(true)
const carouselRef = ref<HTMLDivElement | null>(null)

const showArrows = computed(() => products.value.length > 1)

const scrollProducts = (direction: number) => {
  if (!carouselRef.value) return
  const scrollAmount = carouselRef.value.clientWidth
  carouselRef.value.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
}

onMounted(async () => {
  try {
    loading.value = true

    // Limit to 8 products from API to reduce payload
    const data = await apiService.get('/productos?limit=8')

    const rawProducts = Array.isArray(data)
      ? data
      : (data.products || [])

    const today = new Date().toDateString()

    products.value = rawProducts.slice(0, 7).map((p: any) => {
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
          ? new Date(p.fecha_creacion).
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
  <section class="recomendados-section">

    <!-- INTRO -->
    <div class="section-intro">
      <span class="section-eyebrow">
        SELECCIÓN ESPECIAL
      </span>
      <h2 class="section-heading">
        Recomendados para ti
      </h2>
      <p class="section-subtext">
        Descubre nuestra selección curada de postres artesanales, elegidos especialmente para deleitar tus sentidos.
      </p>
    </div>

    <!-- CAROUSEL -->
    <div class="carousel-wrapper">

      <!-- LEFT -->
      <button
        v-if="showArrows"
        class="nav-btn"
        @click="scrollProducts(-1)"
        aria-label="Anterior"
      >
        <BaseIcon
          name="arrow-left"
          :size="22"
          color="var(--primary)"
        />
      </button>

      <!-- CONTAINER -->
      <div class="carousel-scroll-area" ref="carouselRef">

        <div
          v-if="loading"
          class="loading-placeholder"
        >
          Cargando recomendaciones...
        </div>

        <!-- TRACK -->
        <div v-else class="products-carousel-track">

          <div
            v-for="p in products"
            :key="p.id"
            class="carousel-card-item"
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
        @click="scrollProducts(1)"
        aria-label="Siguiente"
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
        <BaseButton variant="primary" class="btn-explore">
          Explorar catálogo
        </BaseButton>
      </RouterLink>
    </div>

  </section>
</template>
