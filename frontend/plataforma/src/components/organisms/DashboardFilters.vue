<script setup lang="ts">
defineProps<{
  periods?:    string[]
  categories?: string[]
  years?:      string[]
}>()

const emit = defineEmits(['filter-change'])

const onChange = (type: string, event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit('filter-change', { type, value })
}
</script>

<template>
  <div class="filters">
    <select class="filter-select" @change="onChange('period', $event)" aria-label="Seleccionar periodo">
      <option>Selecciona por periodo</option>
      <option v-for="p in (periods ?? ['Hoy','Esta semana','Este mes'])" :key="p">{{ p }}</option>
    </select>
    <select class="filter-select" @change="onChange('category', $event)" aria-label="Seleccionar categoría">
      <option>Selecciona la categoría</option>
      <option v-for="c in (categories ?? ['Panadería','Repostería'])" :key="c">{{ c }}</option>
    </select>
    <select class="filter-select" @change="onChange('year', $event)" aria-label="Seleccionar año">
      <option>Selecciona los años</option>
      <option v-for="y in (years ?? ['2025','2024'])" :key="y">{{ y }}</option>
    </select>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 2rem; flex-wrap: wrap; }
.filter-select {
  padding: 0.6rem 2rem 0.6rem 0.85rem;
  border: 1px solid #e89a3c;
  border-radius: 12px;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%239e8080' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 0.6rem center;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem; color: #2a1a1a;
  cursor: pointer; outline: none; appearance: none;
}
</style>