<script setup lang="ts">
defineProps<{
  name: string
  size?: number | string
  color?: string
}>()
</script>

<template>
  <div class="icon-wrapper" :style="{ width: size + 'px', height: size + 'px', color: color }">
    <span style="font-size: 0.7em;">{{ name }}</span>
  </div>
</template>