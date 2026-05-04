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

<style scoped>
.promo-card {
  background: #fff;
  border-radius: 35px;
  overflow: hidden;
  border: 2px solid #E89A3C;
  transition: box-shadow 0.2s;
}
.promo-card:hover { box-shadow: 0 6px 24px rgba(139,26,46,0.10); }

.promo-image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}
.promo-image { width: 100%; height: 100%; object-fit: cover; }
.promo-badge {
  position: absolute;
  top: 1.5rem; left: 1.5rem;
  background: #8b1a2e;
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 40px;
  width: 4.5rem;
}

.promo-body { padding: 2rem 3rem 2rem;
  text-align: start;  
}
.promo-title {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #7A1F26;
  margin: 0 0 0.1rem;
}
.promo-subtitle {
  font-family: 'Lato-Bold', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 0.1rem;
}
.promo-description {
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  color: #9e8080;
  margin: 0 0 1rem;
}
.promo-link {
  font-family: 'Lato-Bold', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #8b1a2e;
  text-decoration: none;
}
.promo-link:hover { text-decoration: underline; }
</style>