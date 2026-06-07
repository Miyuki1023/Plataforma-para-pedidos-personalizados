<script setup lang="ts">
defineProps<{
  label: string
  detail: string
  active?: boolean
}>()

defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>

  <button
    class="size-chip"
    :class="{ active }"
    @click="$emit('select')"
  >

    <span class="size-chip-title">
      {{ label }}
    </span>

    <span class="size-chip-detail">
      {{ detail }}
    </span>

  </button>

</template>