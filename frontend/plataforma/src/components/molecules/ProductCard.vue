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
      <BaseButton type="button" variant="primary" @click="$emit('add-to-cart')">
        Añadir al carrito
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #f0e0e0;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.product-card:hover { box-shadow: 0 6px 12px rgba(70, 16, 26, 0.123); }

.card-image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}
.card-image {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.35s;
}
.product-card:hover .card-image { transform: scale(1.04); }

.badge-new {
  position: absolute;
  top: 0.6rem; left: 0.6rem;
  background: #8b1a2e;
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}
.btn-fav {
  position: absolute;
  top: 0.6rem; right: 0.6rem;
  width: 30px; height: 30px;
  background: #fff;
  border: none;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}
.card-name {
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2a1a1a;
  margin: 0;
}
.card-desc {
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem;
  color: #9e8080;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}
.card-price {
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #8b1a2e;
  margin: 0;
}
</style>