<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../../lib/api'

const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
const values = ref(new Array(hours.length).fill(0))

const fetchWorkload = async () => {
  const today = new Date().toISOString().split('T')[0]
  try {
    const res = await api.get('/orders', { params: { fecha_inicio: today, fecha_fin: today } })
    const orders = res.data?.orders || []
    
    const counts = new Array(hours.length).fill(0)
    orders.forEach((order: any) => {
      const hour = new Date(order.fecha_creacion).getHours()
      const index = Math.floor(hour / 2) - 3 
      if (index >= 0 && index < counts.length) counts[index]++
    })
    values.value = counts
  } catch (err) {
    console.error('Error al cargar carga de trabajo:', err)
  }
}

const maxVal = computed(() => Math.max(...values.value, 5))
const activeHour = computed(() => {
  const max = Math.max(...values.value)
  return max > 0 ? hours[values.value.indexOf(max)] : ''
})

onMounted(fetchWorkload)
</script>

<template>
  <div class="workload-card">
    <div class="workload-header">
      <h2 class="workload-title">Carga de Trabajo por Hora</h2>
      <p class="workload-subtitle">Volumen de pedidos proyectado para optimizar la preparación.</p>
    </div>

    <div class="chart-container">
      <div class="bars-row">
        <div v-for="(val, i) in values" :key="i" class="bar-col">
          <div class="bar-wrapper">
            <div v-if="val > 0 && hours[i] === activeHour" class="bar-icon">{{ val }}</div>
            <div
              class="bar"
              :class="{ 'bar--active': val > 0 && hours[i] === activeHour }"
              :style="{ height: `${(val / maxVal) * 100}%` }"
            />
          </div>
          <span class="bar-label" :class="{ 'bar-label--active': hours[i] === activeHour }">
            {{ hours[i] }}
          </span>
        </div>
      </div>
    </div>

    <div class="workload-alert">
      <span v-if="activeHour"><strong>Pico de actividad:</strong> Se espera mayor volumen a las {{ activeHour }}.</span>
      <span v-else>No hay actividad registrada para hoy.</span>
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

/* Encabezado con espaciado mejorado */
.workload-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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
  margin: 0; 
  line-height: 1.5;
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
</style>