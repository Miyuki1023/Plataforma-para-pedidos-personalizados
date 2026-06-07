<script setup lang="ts">
defineProps<{
  image: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="feature-card">
    <img :src="image" class="feature-image" />

    <h3>{{ title }}</h3>

    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.feature-card {
  background: white;
  border: 1px solid #e5d2bf;
  border-radius: 24px;
  padding: 30px;
  width: 260px;
  min-height: 320px;
  transition: 0.3s;
}

.feature-card:hover {
  transform: translateY(-6px);
}

.feature-image {
  width: 90px;
  margin-bottom: 20px;
}

h3 {
  font-size: 28px;
  margin-bottom: 12px;
  font-weight: 700;
}

p {
  color: #666;
  line-height: 1.5;
}
</style>