<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <button class="primary-button">
    {{ text }}
  </button>
</template>

<style scoped>
.primary-button {
  background: #a63d40;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
}
</style>