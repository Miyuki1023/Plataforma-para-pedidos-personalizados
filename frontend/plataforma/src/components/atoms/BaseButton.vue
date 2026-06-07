<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="base-button"
    :class="variant ? `base-button--${variant}` : ''"
  >
    <slot />
  </button>
</template>