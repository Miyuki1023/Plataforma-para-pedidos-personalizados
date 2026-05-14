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
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }
}
</style>