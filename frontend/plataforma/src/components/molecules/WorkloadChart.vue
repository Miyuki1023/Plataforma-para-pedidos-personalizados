<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployeeAnalytics } from '../../composables/useEmployeeAnalytics'

const {
  activeRange,
  activeHours,
  activeValues,
  loading,
  error,
  maxVal,
  peakHour,
  hasActivity,
  fetchWorkload,
  TIME_RANGE_OPTIONS,
} = useEmployeeAnalytics()

onMounted(() => fetchWorkload('today'))
</script>

<template>
  <div class="workload-card">
    <div class="workload-header">
      <div class="header-top">
        <div>
          <h2 class="workload-title">Carga de Trabajo por Hora</h2>
          <p class="workload-subtitle">Volumen de pedidos proyectado para optimizar la preparación.</p>
        </div>
        <div class="filter-group" role="group" aria-label="Filtro de tiempo">
          <button
            v-for="opt in TIME_RANGE_OPTIONS"
            :key="opt.value"
            class="filter-btn"
            :class="{ 'filter-btn--active': activeRange === opt.value }"
            @click="fetchWorkload(opt.value)"
            :aria-pressed="activeRange === opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="chart-loading">
      <div class="spinner" />
      <p>Cargando datos…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="chart-error">
      <p>⚠️ {{ error }}</p>
      <button class="retry-btn" @click="fetchWorkload()">Reintentar</button>
    </div>

    <!-- Chart -->
    <div v-else class="chart-container">
      <div class="bars-row">
        <div
          v-for="(val, i) in activeValues"
          :key="activeHours[i]"
          class="bar-col"
        >
          <div class="bar-wrapper">
            <div
              v-if="val > 0 && activeHours[i] === peakHour"
              class="bar-icon"
            >{{ val }}</div>
            <div
              class="bar"
              :class="{ 'bar--active': val > 0 && activeHours[i] === peakHour }"
              :style="{ height: `${(val / maxVal) * 100}%` }"
            />
          </div>
          <span
            class="bar-label"
            :class="{ 'bar-label--active': activeHours[i] === peakHour }"
          >
            {{ activeHours[i] }}
          </span>
        </div>
      </div>
    </div>

    <div class="workload-alert">
      <span v-if="hasActivity">
        <strong>Pico de actividad:</strong> Se espera mayor volumen a las {{ peakHour }}.
      </span>
      <span v-else>No hay actividad registrada para el período seleccionado.</span>
    </div>
  </div>
</template>

<style scoped>
.workload-card {
  background: #EDE8DE;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.workload-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.workload-title {
  font-size: 1.5rem;
  color: #3F0006;
  margin: 0;
  font-family: 'Noto Serif', serif;
}

.workload-subtitle {
  font-size: 0.9rem;
  color: #7C5730;
  margin: 0.25rem 0 0;
  line-height: 1.5;
}

/* Filter group */
.filter-group {
  display: flex;
  gap: 0.25rem;
  background: #ffffff7a;
  border-radius: 12px;
  padding: 0.25rem;
}

.filter-btn {
  padding: 0.4rem 0.85rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #7C5730;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #d7c8ba;
  color: #3F0006;
}

.filter-btn--active {
  background: #8b1a2e;
  color: #fff;
}

.chart-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.bars-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 140px;
  min-width: 600px;
  gap: 1rem;
}

.bar-col { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex: 1; }

.bar-wrapper {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 100%;
  max-width: 40px;
  background: #d7c8ba;
  border-radius: 8px 8px 0 0;
  transition: height 0.6s cubic-bezier(0.17, 0.67, 0.5, 1);
}

.bar--active { background: #8b1a2e; }

.bar-label { font-size: 0.75rem; color: #9b7a58; font-weight: 600; }
.bar-label--active { color: #8b1a2e; font-weight: 700; }

.bar-icon {
  position: absolute; top: -30px;
  background: #3F0006; color: white;
  width: 24px; height: 24px;
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
}

.workload-alert {
  background: #ffffff7a; border-radius: 12px;
  padding: 1rem; font-size: 0.85rem; color: #92400e;
}

/* Loading / Error states */
.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 0.75rem;
  color: #7C5730;
}

.retry-btn {
  padding: 0.4rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: #8b1a2e;
  color: #fff;
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #ede8de;
  border-top-color: #8b1a2e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-top { flex-direction: column; }
  .filter-group { width: 100%; overflow-x: auto; }
}
</style>