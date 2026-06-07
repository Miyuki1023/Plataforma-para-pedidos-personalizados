<script setup lang="ts">
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

const props = defineProps<Props>()
const favStore = useFavoritesStore()

const emit = defineEmits([
  'add-to-cart',
  'view-details',
  'toggle-favorite'
])

const toggleFavorite = () => {
  favStore.toggleFavorite({
    id: props.id,
    name: props.name,
    price: props.price,
    imageUrl: props.imageUrl
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
    class="product-card"
    @click="emit('view-details', props.id)"
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
          :active="favStore.isFavorite(props.id)"
          @toggle="toggleFavorite"
        />
      </div>

      <img
        :src="imageUrl"
        :alt="name"
        class="card-image"
      />
    </div>

    <div class="card-body">

      <span
        v-if="category"
        class="badge badge--tag"
      >
        {{ category }}
      </span>

      <h3 class="card-name">
        {{ name }}
      </h3>

      <p
        v-if="description"
        class="card-desc"
      >
        {{ description }}
      </p>

      <p class="card-price">
        {{ formatPrice(price) }}
      </p>

      <BaseButton
        class="btn-card"
        @click.stop="emit('add-to-cart', props.id)"
      >
        Añadir
      </BaseButton>

    </div>

  </div>
</template>