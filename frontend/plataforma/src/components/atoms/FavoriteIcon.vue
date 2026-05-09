<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  active?: boolean
  size?: number
}>()

const emit = defineEmits<{
  (e: 'toggle', value: boolean): void
}>()

/* estado local */

const isFavorite = ref(props.active || false)

/* sincroniza si cambia desde afuera */

watch(
  () => props.active,
  (value) => {
    isFavorite.value = !!value
  }
)

/* toggle */

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value

  /* aquí luego puedes guardar en backend */
  emit('toggle', isFavorite.value)
}
</script>

<template>
  <button
    class="btn-fav"
    :class="{ active: isFavorite }"
    :style="{
      width: `${size || 44}px`,
      height: `${size || 44}px`,
      flexShrink: 0
    }"
    @click="toggleFavorite"
  >
    <svg
      viewBox="0 0 24 24"
      class="heart-icon"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 5.42 4.42 3 7.5 3
        c1.74 0 3.41.81 4.5 2.09
        C13.09 3.81 14.76 3 16.5 3
        19.58 3 22 5.42 22 8.5
        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  </button>
</template>

