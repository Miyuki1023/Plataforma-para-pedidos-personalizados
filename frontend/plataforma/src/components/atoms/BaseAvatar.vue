<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  size?: number
}>()
</script>

<template>
  <div
    class="base-avatar"
    :style="{
      width: `${size || 40}px`,
      height: `${size || 40}px`,
      flexShrink: 0
    }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt || 'Avatar'"
      class="avatar-image"
    />

    <div v-else class="avatar-placeholder">
      {{ alt?.charAt(0)?.toUpperCase() || 'U' }}
    </div>
  </div>
</template>
