<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}>()

const classes = computed(() => [
  'base-button',
  props.variant ? `base-button--${props.variant}` : '',
  { 'base-button--loading': props.loading }
])
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="classes"
  >
    <span v-if="loading" class="spinner" />
    <span v-else><slot /></span>
  </button>
</template>