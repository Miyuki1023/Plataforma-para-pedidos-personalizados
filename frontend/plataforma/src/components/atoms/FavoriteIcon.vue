<script setup lang="ts">
const props = withDefaults(defineProps<{
  active?: boolean
  size?: number
}>(), {
  active: false,
  size: 44
})

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <button
    class="btn-fav"
    :class="{ active: props.active }"
    :style="{
      width: `${props.size}px`,
      height: `${props.size}px`,
      flexShrink: 0
    }"
    @click.stop="emit('toggle')"
    :aria-label="props.active ? 'Quitar de favoritos' : 'Agregar a favoritos'"
  >
    <!-- ACTIVE: corazón relleno rojo -->
    <svg
      v-if="props.active"
      viewBox="0 0 24 24"
      class="heart-icon heart-icon--filled"
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
    <!-- INACTIVE: corazón solo borde -->
    <svg
      v-else
      viewBox="0 0 24 24"
      class="heart-icon heart-icon--outline"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 5.42 4.42 3 7.5 3
        c1.74 0 3.41.81 4.5 2.09
        C13.09 3.81 14.76 3 16.5 3
        19.58 3 22 5.42 22 8.5
        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  </button>
</template>

<style scoped>
.btn-fav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-fav:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-fav:active {
  transform: scale(0.95);
}

.heart-icon {
  width: 60%;
  height: 60%;
}

.heart-icon--filled {
  fill: #e74c3c;
  color: #e74c3c;
}

.heart-icon--outline {
  color: #888;
}

.btn-fav.active {
  background: rgba(231, 76, 60, 0.1);
}

.btn-fav.active:hover {
  background: rgba(231, 76, 60, 0.2);
}
</style>
