<script setup lang="ts">
import BaseBadge from '../atoms/BaseBadge.vue'
import BaseButton from '../atoms/BaseButton.vue'
import BaseIcon from '../atoms/BaseIcon.vue'

defineProps<{
  image: string
  category: string
  name: string
  description: string
  price: string
  isNew?: boolean
}>()

defineEmits<{ (e: 'add-to-cart'): void }>()
</script>

<template>
  <div class="product-card">
    <div class="card-image-wrapper">
      <img :src="image" :alt="name" class="card-image" />
      <span v-if="isNew" class="badge-new">Nuevo</span>
      <button class="btn-fav">
        <BaseIcon name="heart" :size="16" color="#8b1a2e" />
      </button>
    </div>
    <div class="card-body">
      <BaseBadge :label="category" variant="tag" />
      <h3 class="card-name">{{ name }}</h3>
      <p class="card-desc">{{ description }}</p>
      <p class="card-price">{{ price }}</p>
      <BaseButton  class="btn-card" type="button" variant="primary" @click="$emit('add-to-cart')">
        Añadir al carrito
      </BaseButton>
    </div>
  </div>
</template>