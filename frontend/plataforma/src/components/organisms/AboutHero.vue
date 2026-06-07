<script setup lang="ts">
import HistoryContent from '../molecules/HistoryContent.vue'
</script>

<template>
  <section class="hero-about">
    <img src="../../assets/image.png" class="hero-image" />

    <HistoryContent />
  </section>
</template>

<style scoped>
.hero-about {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 100px 8%;
  background: #fff;
}

.hero-image {
  width: 500px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 900px) {
  .hero-about {
    flex-direction: column;
    gap: 40px;
    padding: 60px 5%;
    text-align: center;
  }

  .hero-image {
    width: 100%;
    max-width: 400px;
    order: -1; /* La imagen aparece arriba en móviles */
  }
}
</style>