<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="stat-chip">
    <span class="chip-label">{{ label }}</span>
    <span class="chip-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.stat-chip {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.chip-label {
  font-family: 'Lato', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9e8080;
  text-transform: uppercase;
}
.chip-value {
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2a1a1a;
}
</style>