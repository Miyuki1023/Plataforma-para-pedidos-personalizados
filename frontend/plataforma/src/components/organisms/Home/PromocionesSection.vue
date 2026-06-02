<script setup lang="ts">
import PromoCard from '../../molecules/PromoCard.vue'
import BaseButton from '../../atoms/BaseButton.vue'
import BaseIcon from '../../atoms/BaseIcon.vue'

import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { apiService } from '../../../modules/service/api.service'

const router = useRouter()

const goToCatalog = () => {
  router.push('/catalogo')
}

interface PromoProduct {
  id: string | number
  nombre: string
  subtitulo?: string
  descripcion?: string
  imagen_url?: string[]
  precio?: number
  badge?: string
  categoria?: string
  disponible?: boolean
  stock?: number
}

const promos = ref<PromoProduct[]>([])
const carouselRef = ref<HTMLDivElement | null>(null)

const fetchPromos = async () => {
  try {
    const response = await apiService.get('/productos')

    const products = Array.isArray(response)
      ? response
      : response.rows ||
        response.productos ||
        response.products ||
        response.data ||
        []

    promos.value = products.filter(
      (product: PromoProduct) => {
        const category = String(
          product.categoria ||
          (product as any).category ||
          ''
        )
          .trim()
          .toUpperCase()

        return category === 'PROMOS'
      }
    )
  } catch (error) {
    console.error(
      'Error cargando promociones:',
      error
    )
  }
}

const scrollPromos = (
  direction: number
) => {
  if (!carouselRef.value) return

  const container = carouselRef.value

  let cardsPerView = 1

  if (window.innerWidth >= 1024) {
    cardsPerView = 3
  } else if (window.innerWidth >= 768) {
    cardsPerView = 2
  }

  const cardWidth =
    container.clientWidth / cardsPerView

  container.scrollBy({
    left:
      cardWidth *
      cardsPerView *
      direction,
    behavior: 'smooth'
  })
}

onMounted(fetchPromos)
</script>

<template>
  <section class="recomendados-section promos-section">

    <!-- INTRO -->
    <div class="section-intro">

      <span class="section-eyebrow">
        PROMOCIONES
      </span>

      <h2 class="section-heading">
        Nuestras promociones
      </h2>

      <p class="section-subtext">
        Aprovecha ofertas especiales
        en tus postres favoritos y
        disfruta algo dulce todos
        los días.
      </p>

    </div>

    <!-- CAROUSEL -->
    <div class="carousel-wrapper">

      <!-- LEFT -->
      <button
        v-if="promos.length > 1"
        class="nav-btn"
        type="button"
        @click="scrollPromos(-1)"
        aria-label="Anterior"
      >
        <BaseIcon
          name="arrow-left"
          :size="22"
          color="var(--primary)"
        />
      </button>

      <!-- SCROLL AREA -->
      <div
        ref="carouselRef"
        class="carousel-scroll-area"
      >

        <div
          v-if="promos.length > 0"
          class="products-carousel-track"
        >

          <div
            v-for="promo in promos"
            :key="promo.id"
            class="carousel-card-item"
          >

            <PromoCard
              :id="promo.id"
              :nombre="promo.nombre"
              :subtitulo="promo.subtitulo"
              :descripcion="promo.descripcion"
              :imagen_url="promo.imagen_url"
              :precio="promo.precio"
              :categoria="promo.categoria"
              :disponible="promo.disponible"
              :badge="promo.badge"
              :stock="promo.stock"
            />

          </div>

        </div>

        <!-- EMPTY -->
        <div
          v-else
          class="no-data"
        >
          No hay promociones disponibles.
        </div>

      </div>

      <!-- RIGHT -->
      <button
        v-if="promos.length > 1"
        class="nav-btn"
        type="button"
        @click="scrollPromos(1)"
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

      <BaseButton
        variant="primary"
        class="btn-explore"
        @click="goToCatalog"
      >
        Ver promociones
      </BaseButton>

    </div>

  </section>
</template>