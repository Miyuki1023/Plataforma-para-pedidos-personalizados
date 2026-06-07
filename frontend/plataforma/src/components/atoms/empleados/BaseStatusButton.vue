<script setup lang="ts">
defineProps<{
  label: string
  variant: 'iniciar' | 'proceso' | 'listo' | 'entregado'
  active?: boolean
}>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button
    class="status-btn"
    :class="[`status-btn--${variant}`, { active }]"
    @click="$emit('click')"
  >
    <!-- Iniciar icon -->
    <svg v-if="variant === 'iniciar'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>
    </svg>
    <!-- Proceso icon -->
    <svg v-if="variant === 'proceso'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
    </svg>
    <!-- Listo icon -->
    <svg v-if="variant === 'listo'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/>
    </svg>
    <!-- Entregado icon -->
    <svg v-if="variant === 'entregado'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
    {{ label }}
  </button>
</template>

<style scoped>
.status-btn {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px; border: none;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
}
.status-btn:hover { opacity: 0.85; }
.status-btn:active { transform: scale(0.97); }

.status-btn--iniciar   { background: #2a1a1a; color: #fff; }
.status-btn--proceso   { background: #8b1a2e; color: #fff; }
.status-btn--listo     { background: #f5ece4; color: #6b4a2a; border: 1px solid #e8d5c8; }
.status-btn--entregado { background: #f5ece4; color: #6b4a2a; border: 1px solid #e8d5c8; }

.status-btn--proceso.active,
.status-btn--iniciar.active { box-shadow: 0 0 0 3px rgba(139,26,46,0.2); }
</style>