<script setup lang="ts">

import { useRouter } from 'vue-router'

import BaseButton from '../atoms/BaseButton.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'
import { useFavoritesStore } from '../../stores/favorites'

interface Props {
  id: string | number
  name: string
  price: number
  description?: string
  imageUrl?: string
  image?: string
  category?: string
  isNew?: boolean
  metaTags?: string[]
}

const props = defineProps<Props>()

defineEmits([
  'add-to-cart',
  'view-details'
])

const router = useRouter()
const favStore = useFavoritesStore()

const goToProduct = () => {
  if (!props.id) return console.error("ID de producto no válido");
  
  router.push(
    `/producto/${String(props.id).replace('id:', '')}`
  )
}

const toggleFavorite = () => {
  favStore.toggleFavorite(props)
}
</script>

<template>

  <article class="product-card">

    <!-- IMAGE -->
    <div class="card-image-wrapper">

      <img
        :src="image || imageUrl"
        :alt="name"
        class="card-image"
      />

      <!-- BADGE -->
      <span
        v-if="isNew"
        class="badge-new"
      >
        NUEVO
      </span>

      <!-- FAVORITE -->
      <FavoriteIcon 
        :active="favStore.isFavorite(id)" 
        @click.stop="toggleFavorite"
        style="cursor: pointer"
      />

    </div>

    <!-- BODY -->
    <div class="card-body">

      <span class="card-category">
        {{ category }}
      </span>

      <h3 class="card-name">
        {{ name }}
      </h3>

      <p class="card-desc">
        {{ description }}
      </p>

      <div v-if="metaTags?.length" class="card-tags">
        <span v-for="tag in metaTags" :key="tag" class="card-tag">{{ tag }}</span>
      </div>

      <p class="card-price">
        S/{{ price }}
      </p>

      <BaseButton
        class="btn-card"
        @click="goToProduct"
      >
        Ver detalles
      </BaseButton>

    </div>

  </article>

</template>