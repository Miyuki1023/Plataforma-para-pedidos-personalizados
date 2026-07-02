<script setup lang="ts">
defineProps<{
  label: string
  image: string
  active?: boolean
}>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="chip" :class="{ active }" @click="$emit('click')">
    <div class="chip-img-wrapper">
      <img :src="image" :alt="label" class="chip-img" width="60" height="60" loading="lazy" decoding="async" />
    </div>
    <span class="chip-label">{{ label }}</span>
  </button>
</template>

