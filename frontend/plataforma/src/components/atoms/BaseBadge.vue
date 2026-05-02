<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'primary' | 'promo' | 'tag'
}>()
</script>

<template>
  <span class="badge" :class="`badge--${variant ?? 'tag'}`">
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  font-family: 'Lato', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border-radius: 20px;
  padding: 0.25rem 0.65rem;
}
.badge--tag {
  background: #f5ece4;
  color: #8b1a2e;
}
.badge--primary {
  background: #8b1a2e;
  color: #fff;
}
.badge--promo {
  background: #fff4e0;
  color: #b45309;
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
}
</style>