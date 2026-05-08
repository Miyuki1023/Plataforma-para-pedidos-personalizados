<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

defineProps<{
  name: string
  text: string
  stars?: number
  active?: boolean
}>()
</script>

<template>
  <div class="testimonial" :class="{ active }">
    <div class="testi-avatar">{{ name.charAt(0) }}</div>
    <p class="testi-name">{{ name }}</p>
    <div class="testi-stars">
      <BaseIcon
        v-for="i in 5" :key="i"
        name="star"
        :size="14"
        :color="i <= (stars ?? 5) ? '#f59e0b' : '#e5e7eb'"
      />
    </div>
    <p class="testi-text">"{{ text }}"</p>
  </div>
</template>

<style scoped>
.testimonial {
  background: #fff;
  border: 1px solid #f0e0e0;
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.testimonial.active {
  border-color: #8b1a2e;
  box-shadow: 0 4px 20px rgba(139,26,46,0.10);
}
.testi-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #3a1a1a;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  font-weight: 700;
}
.testi-name {
  font-family: 'Lato', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #2a1a1a;
  margin: 0;
}
.testi-stars { display: flex; gap: 2px; }
.testi-text {
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: #6b5050;
  line-height: 1.55;
  margin: 0;
}
</style>