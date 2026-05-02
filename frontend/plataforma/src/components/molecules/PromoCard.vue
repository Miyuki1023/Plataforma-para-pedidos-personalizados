<script setup lang="ts">
defineProps<{
  image: string
  badge?: string
  title: string
  subtitle: string
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
      <a href="#" class="promo-link">Ver detalles</a>
    </div>
  </div>
</template>

<style scoped>
.promo-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #f0e0e0;
  transition: box-shadow 0.2s;
}
.promo-card:hover { box-shadow: 0 6px 24px rgba(139,26,46,0.10); }

.promo-image-wrapper {
  position: relative;
  height: 150px;
  overflow: hidden;
}
.promo-image { width: 100%; height: 100%; object-fit: cover; }
.promo-badge {
  position: absolute;
  top: 0.6rem; left: 0.6rem;
  background: #8b1a2e;
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
}

.promo-body { padding: 0.85rem 1rem 1rem; }
.promo-title {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2a1a1a;
  margin: 0 0 0.2rem;
}
.promo-subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  color: #9e8080;
  margin: 0 0 0.5rem;
}
.promo-link {
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #8b1a2e;
  text-decoration: none;
}
.promo-link:hover { text-decoration: underline; }
</style>