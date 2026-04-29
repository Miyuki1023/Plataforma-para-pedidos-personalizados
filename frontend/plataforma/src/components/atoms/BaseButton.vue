<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="base-button"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 2.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
  width: 100%;
  background: #1a1a1a;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(26, 26, 26, 0.25);
}
.base-button:hover:not(:disabled) {
  background: #2e2e2e;
  box-shadow: 0 6px 20px rgba(26, 26, 26, 0.35);
}
.base-button:active {
  transform: scale(0.98);
}
.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>