<script setup lang="ts">
defineProps<{
  image: string
  badge?: string
  title: string
  subtitle: string
  desc:string
}>()
</script>

<template>
  <div class="promo-card">
    <div class="promo-image-wrapper">
      <img :src="image" :alt="title" class="promo-image" />
      <span v-if="badge" class="promo-badge">{{ badge }}</span>
    </div>
    <div class="promo-body">
      <h4 class="promo-title">{{ title }}</h4>
      <p class="promo-subtitle">{{ subtitle }}</p>
      <p class="promo-description">{{ desc }}</p>
      <a href="#" class="promo-link">Ver detalles</a>
    </div>
  </div>
</template>