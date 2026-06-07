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
  category?: string
  isNew?: boolean
}

const props = defineProps<Props>()

const router = useRouter()
const favStore = useFavoritesStore()

const goToProduct = () => {
  if (!props.id) return
  router.push(`/producto/${props.id}`)
}

// 🔥 Lógica centralizada en Pinia
const toggleFavorite = () => {
  favStore.toggleFavorite({
    id: props.id,
    name: props.name,
    price: props.price,
    imageUrl: props.imageUrl
  })
}
</script>

<template>
  <article class="product-card">

    <!-- IMAGE -->
    <div class="card-image-wrapper">

      <img
        :src="props.imageUrl"
        :alt="props.name"
        class="card-image"
        loading="lazy"
      />

      <span v-if="props.isNew" class="badge-new">
        NUEVO
      </span>

      <!-- ❤️ FAVORITO (FIX FINAL) -->
      <FavoriteIcon
        :active="favStore.isFavorite(props.id)"
        @toggle="toggleFavorite"
        class="fav-icon"
      />

    </div>

    <!-- BODY -->
    <div class="card-body">

      <span v-if="props.category" class="card-category">
        {{ props.category }}
      </span>

      <h3 class="card-name">
        {{ props.name }}
      </h3>

      <p v-if="props.description" class="card-desc">
        {{ props.description }}
      </p>

      <p class="card-price">
        S/ {{ props.price }}
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