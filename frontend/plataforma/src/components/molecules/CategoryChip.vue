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
      <img :src="image" :alt="label" class="chip-img" />
    </div>
    <span class="chip-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
.chip-img-wrapper {
  width: 80px; height: 80px;
  border-radius: 25%;
  overflow: hidden;
  border: 2.5px solid transparent;
  transition: border-color 0.2s;
}
.chip.active .chip-img-wrapper,
.chip:hover .chip-img-wrapper {
  border-color: #8b1a2e;
}
.chip-img { width: 100%; height: 100%; object-fit: cover; }
.chip-label {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2a1a1a;
  text-align: center;
  white-space: nowrap;
}
</style>