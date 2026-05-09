<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'promo' | 'success'
}>()
</script>

<template>
  <span
    class="base-badge"
    :class="variant ? `base-badge--${variant}` : ''"
  >
    <slot />
  </span>
</template>