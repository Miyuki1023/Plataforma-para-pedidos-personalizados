<script setup lang="ts">
import BaseButton from '../atoms/BaseButton.vue'

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

const emit = defineEmits(['add-to-cart', 'view-details'])

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}
</script>

<template>
  <div class="product-card" @click="emit('view-details', props.id)">
    <div class="image-wrapper">
      <span v-if="isNew" class="badge-new">Nuevo</span>
      <img :src="imageUrl" :alt="name" class="product-image" />
      <div class="overlay">
        <button class="quick-view">Vista rápida</button>
      </div>
    </div>

    <div class="product-info">
      <span v-if="category" class="category">{{ category }}</span>
      <h3 class="product-name">{{ name }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
      
      <div class="footer">
        <span class="price">{{ formatPrice(price) }}</span>
        <BaseButton @click.stop="emit('add-to-cart', props.id)" class="add-button">
          Añadir
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0e0d8;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(139, 26, 46, 0.1);
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fdf8f5;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.badge-new {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #8b1a2e;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #a08080;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.product-name {
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.description {
  font-size: 0.85rem;
  color: #6b5050;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #8b1a2e;
}

.add-button {
  width: auto !important;
  padding: 0.5rem 1.2rem !important;
  margin: 0 !important;
  font-size: 0.85rem !important;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .overlay {
  opacity: 1;
}

.quick-view {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>