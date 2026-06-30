<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'
import { useFavoritesStore } from '../../stores/favorites'

interface Props {
  id: string | number
  name: string
  price: number
  description?: string
  imageUrl: string
  category?: string
  isNew?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  name: 'Producto',
  price: 0,
  description: '',
  imageUrl: '',
  category: '',
  isNew: false
})

const favStore = useFavoritesStore()

const emit = defineEmits([
  'add-to-cart',
  'view-details',
  'toggle-favorite'
])

// ✅ Sanitize: valores seguros nunca undefined
const safeId = computed(() => String(props.id ?? 0).replace('id:', ''))
const safeName = computed(() => props.name || 'Producto')
const safePrice = computed(() => Number(props.price) || 0)
const safeImageUrl = computed(() => props.imageUrl || '')
const safeCategory = computed(() => props.category || '')
const safeDescription = computed(() => props.description || '')

const toggleFavorite = () => {
  favStore.toggleFavorite({
    id: safeId.value,
    name: safeName.value,
    price: safePrice.value,
    imageUrl: safeImageUrl.value
  })
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}
</script>

<template>
  <div
    v-if="safeId && safeId !== '0'"
    class="product-card"
    @click="emit('view-details', safeId)"
  >
    
    <div class="card-image-wrapper">

      <span
        v-if="isNew"
        class="badge-new"
      >
        Nuevo
      </span>

      <div class="favorite-wrapper">
        <FavoriteIcon
          :active="favStore.isFavorite(safeId)"
          @toggle="toggleFavorite"
        />
      </div>

      <img
        v-if="safeImageUrl"
        :src="safeImageUrl"
        :alt="safeName"
        class="card-image"
      />
      <div
        v-else
        class="card-image-placeholder"
      >
        <span>📸</span>
      </div>
    </div>

    <div class="card-body">

      <span
        v-if="safeCategory"
        class="badge badge--tag"
      >
        {{ safeCategory }}
      </span>

      <h3 class="card-name">
        {{ safeName }}
      </h3>

      <p
        v-if="safeDescription"
        class="card-desc"
      >
        {{ safeDescription }}
      </p>

      <p class="card-price">
        {{ formatPrice(safePrice) }}
      </p>

      <BaseButton
        class="btn-card"
        @click.stop="emit('add-to-cart', safeId)"
      >
        Añadir
      </BaseButton>

    </div>

  </div>
</template>
