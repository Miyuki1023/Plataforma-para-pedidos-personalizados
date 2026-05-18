<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  note?: string
  variant?: 'default' | 'active' | 'warning' | 'success' | 'neutral'
}>()
</script>

<template>
  <div class="order-stat" :class="`order-stat--${variant ?? 'default'}`">
    <!-- Decorative watermark -->
    <div class="stat-watermark" aria-hidden="true">
      <slot name="watermark" />
    </div>
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ value }}</span>
    <span v-if="note" class="stat-note">{{ note }}</span>
  </div>
</template>

<style scoped>
.order-stat {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  text-align: start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.stat-watermark {
  position: absolute;
  right: -8px; bottom: -8px;
  opacity: 0.08;
  font-size: 5rem;
  pointer-events: none;
  line-height: 1;
}
.stat-label {
  font-family: 'Lato', sans-serif;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.stat-value {
  font-family: 'Lato', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
}
.stat-note {
  font-family: 'Lato', sans-serif;
  font-size: 0.72rem;
  margin-top: 0.2rem;
}

/* Variants */
.order-stat--default {
  background: #fff;
  border-color: #e8d5d5;
}
.order-stat--default .stat-label { color: #9e8080; }
.order-stat--default .stat-value  { color: #2a1a1a; }
.order-stat--default .stat-note   { color: #bfa8a8; }

.order-stat--active {
  background: #6b1222;
  border-color: transparent;
}
.order-stat--active .stat-label { color: rgb(255, 255, 255); }
.order-stat--active .stat-value  { color: #fff; }
.order-stat--active .stat-note   { color: rgb(255, 255, 255); }

.order-stat--warning {
  background: #fedca5;
  border-color: #fde8b0;
}
.order-stat--warning .stat-label { color: #b45309; }
.order-stat--warning .stat-value  { color: #92400e; }
.order-stat--warning .stat-note   { color: #b45309; }

.order-stat--success {
  background: #f0faf4;
  border-color: #c6e8d5;
}
.order-stat--success .stat-label { color: #2e7d52; }
.order-stat--success .stat-value  { color: #1a5c3a; }
.order-stat--success .stat-note   { color: #2e7d52; }

.order-stat--neutral {
  background: #EDE8DE;
  border-color: #e8ddd5;
}
.order-stat--neutral .stat-label { color: #9e8080; }
.order-stat--neutral .stat-value  { color: #2a1a1a; }
.order-stat--neutral .stat-note   { color: #bfa8a8; }
</style>