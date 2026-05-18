<script setup lang="ts">
defineProps<{
  value: number
  max?: number
  label?: string
  color?: string
}>()
</script>

<template>
  <div class="progress-wrapper">
    <div v-if="label" class="progress-label">{{ label }}</div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{
          width: `${Math.min(100, (value / (max ?? 100)) * 100)}%`,
          background: color ?? '#8b1a2e'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-wrapper { display: flex; flex-direction: column; gap: 0.3rem; width: 100%; }
.progress-label { font-family: 'Lato', sans-serif; font-size: 0.75rem; color: #9e8080; }
.progress-track {
  width: 100%; height: 8px;
  background: #f0e0e0;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}
</style>