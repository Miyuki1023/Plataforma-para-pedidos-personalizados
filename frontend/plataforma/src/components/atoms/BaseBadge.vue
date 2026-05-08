<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'primary' | 'promo' | 'tag'
}>()
</script>

<template>
  <span class="badge" :class="`badge--${variant ?? 'tag'}`">
    {{ label }}
  </span>
</template>