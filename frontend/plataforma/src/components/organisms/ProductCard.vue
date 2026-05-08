<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '../atoms/BaseButton.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'

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

const emit = defineEmits([
  'add-to-cart',
  'view-details',
  'toggle-favorite'
])

const isFavorite = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value

  emit('toggle-favorite', {
    id: props.id,
    favorite: isFavorite.value
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
          :active="isFavorite"
          @click.stop="toggleFavorite"
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