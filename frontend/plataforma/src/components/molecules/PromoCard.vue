<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '../atoms/BaseBadge.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'
import { useFavoritesStore } from '../../stores/favorites'

export type ImageSource = string | string[] | null | undefined

interface Props {
  id: string | number
  nombre: string
  subtitulo?: string
  descripcion?: string
  imagen_url?: ImageSource
  precio?: number | string
  categoria?: string
  disponible?: boolean
  badge?: string

  stock?: number
}

const props = withDefaults(defineProps<Props>(), {
  subtitulo: '',
  descripcion: '',
  imagen_url: '',
  precio: 0,
  badge: '',
  categoria: '',
  disponible: true,
  stock: 0
})

const favStore = useFavoritesStore()

const placeholderImage =
  'https://via.placeholder.com/400x300?text=Sin+Imagen'

/* PRODUCT ROUTE */
const productId = computed(() =>
  String(props.id).replace(/^id:/, '').trim()
)

const productRoute = computed(() =>
  `/producto/${productId.value}`
)

/* IMAGE */
const displayImage = computed(() => {
  const source = props.imagen_url

  if (Array.isArray(source)) {
    const firstValid = source.find(
      (item) => typeof item === 'string' && item.trim()
    )

    return firstValid?.trim() || placeholderImage
  }

  if (typeof source === 'string' && source.trim()) {
    return source.trim()
  }

  return placeholderImage
})

/* PRICE */
const displayPrice = computed(() => {
  const rawPrice =
    typeof props.precio === 'string'
      ? Number(props.precio.replace(',', '.'))
      : Number(props.precio)

  if (!Number.isFinite(rawPrice)) {
    return '0.00'
  }

  return rawPrice.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

/* FAVORITES */
const toggleFavorite = () => {
  favStore.toggleFavorite(props)
}

/* TEXTS */
const displaySubtitle = computed(() =>
  props.subtitulo?.trim() || ''
)

const displayDescription = computed(() =>
  props.descripcion?.trim() ||
  'Descripción no disponible.'
)

const displayCategory = computed(() =>
  props.categoria?.trim() || ''
)


</script>

<template>
  <article
    class="promo-card"
    role="group"
    :aria-label="`Producto ${props.nombre}`"
  >

    <!-- IMAGE -->
    <div class="promo-image-wrapper">

      <img
        :src="displayImage"
        :alt="`Imagen de ${props.nombre}`"
        class="promo-image"
        loading="lazy"
      />

      <!-- BADGES -->
      <div class="promo-image-badges">

        <!-- PROMO BADGE -->
        <BaseBadge
          variant="promo"
        >
          {{ props.badge }}
        </BaseBadge>

        <!-- FAVORITE -->
        <FavoriteIcon
          :active="favStore.isFavorite(props.id)"
          @click.stop="toggleFavorite"
          style="cursor: pointer"
        />


      </div>

    </div>

    <!-- CONTENT -->
    <div class="promo-body">

      <div class="promo-texts">

        <span class="card-category">
          {{ displayCategory }}
        </span>

        <h3 class="promo-title">
          {{ props.nombre }}
        </h3>

        <p
          v-if="displaySubtitle"
          class="promo-subtitle"
        >
          {{ displaySubtitle }}
        </p>

        <p class="promo-description">
          {{ displayDescription }}
        </p>

      </div>

      <!-- FOOTER -->
      <div class="promo-meta">

        <p
          class="promo-price"
          aria-label="Precio"
        >
          S/ {{ displayPrice }}
        </p>

        <router-link
          :to="productRoute"
          class="promo-link"
          :aria-label="`Ver detalles del producto ${props.nombre}`"
        >
          Ver detalles

          <svg
            class="promo-link-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>

        </router-link>

      </div>

    </div>

  </article>
</template>