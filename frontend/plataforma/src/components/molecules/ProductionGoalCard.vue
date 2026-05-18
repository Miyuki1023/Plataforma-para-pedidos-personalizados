<script setup lang="ts">
import BaseProgressBar from '../atoms/BaseProgressBar.vue'
import BaseStatChip from '../atoms/BaseStatChip.vue'

defineProps<{
  current: number
  total: number
  percentLabel: string
  inOven: number
  cooling: number
  packing: number
}>()
</script>

<template>
  <div class="goal-card">
    <div class="goal-header">
      <div>
        <h2 class="goal-title">Meta de Producción Diaria</h2>
        <p class="goal-subtitle">
          Ritmo actual: <strong>Excelente.</strong>
          Faltan {{ total - current }} unidades para completar el despacho de la tarde.
        </p>
      </div>
    </div>

    <div class="goal-count-row">
      <span class="goal-count">{{ current }}</span>
      <span class="goal-total">/ {{ total }} pedidos</span>
      <span class="goal-badge">{{ percentLabel }}</span>
    </div>

    <BaseProgressBar
      :value="current"
      :max="total"
      color="#3F0006"
    />

    <div class="goal-stats">
      <BaseStatChip label="En Horno"   :value="`${inOven} unid.`" />
      <BaseStatChip label="Enfriando"  :value="`${cooling} unid.`" />
      <BaseStatChip label="Empaque"    :value="`${packing} unid.`" />
    </div>
  </div>
</template>

<style scoped>
.goal-card {
  background: #F8F3E9;
  border-radius: 24px;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 1.5rem;
}
.goal-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: #3F0006;
  margin: 0;
}
.goal-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem;
  color: #7C5730;
  margin: 0.3rem 0 0;
  line-height: 1.5;
}
.goal-subtitle strong { color: #2a1a1a; font-weight: 700; }

.goal-count-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.goal-count {
  font-family: 'Noto Serif', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: #3F0006;
  line-height: 1;
}
.goal-total {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.9rem;
  color: #9e8080;
  font-weight: 400;
}
.goal-badge {
  margin-left: auto;
  background: #f5ece4;
  color: #8b1a2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}
.goal-stats {
  display: flex;
  gap: 2rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f5ece4;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>