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