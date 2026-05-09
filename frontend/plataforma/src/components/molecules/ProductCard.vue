<script setup lang="ts">

import { useRouter } from 'vue-router'

import BaseButton from '../atoms/BaseButton.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'

interface Props {
  id: string | number
  name: string
  price: number
  description?: string
  imageUrl?: string
  image?: string
  category?: string
  isNew?: boolean
}

const props = defineProps<Props>()

defineEmits([
  'add-to-cart',
  'view-details'
])

const router = useRouter()

const goToProduct = () => {

  router.push(
    `/producto/${props.id}`
  )
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
      <FavoriteIcon />

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

      <p class="card-price">
        S/{{ price }}
      </p>

      <BaseButton
        class="btn-card"
        @click="goToProduct"
      >
        Agregar al carrito
      </BaseButton>

    </div>

  </article>

</template>