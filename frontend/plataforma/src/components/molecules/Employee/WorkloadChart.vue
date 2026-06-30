<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '../../../lib/api'

const hours = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00']
const values = ref([0, 0, 0, 0, 0, 0, 0])

const fetchWorkload = async () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const today = `${y}-${m}-${d}`

  try {
    // Consultamos los pedidos de hoy para calcular la carga
    const res = await apiService.get(`/orders?fecha_inicio=${today}&fecha_fin=${today}`)
    const orders = res?.orders || []
    
    const counts = [0, 0, 0, 0, 0, 0, 0]
    orders.forEach((order: any) => {
      const hour = new Date(order.fecha_creacion).getHours()
      
      // Clasificamos el pedido en el bloque horario correspondiente
      if (hour >= 6 && hour < 8) counts[0]++
      else if (hour >= 8 && hour < 10) counts[1]++
      else if (hour >= 10 && hour < 12) counts[2]++
      else if (hour >= 12 && hour < 14) counts[3]++
      else if (hour >= 14 && hour < 16) counts[4]++
      else if (hour >= 16 && hour < 18) counts[5]++
      else if (hour >= 18) counts[6]++
    })
    values.value = counts
  } catch (err) {
    console.error('Error al cargar carga de trabajo:', err)
  }
}

const maxVal = computed(() => Math.max(...values.value, 1))
const activeHour = computed(() => {
  const max = Math.max(...values.value)
  if (max === 0) return ''
  return hours[values.value.indexOf(max)]
})

onMounted(fetchWorkload)
</script>

<template>
  <div class="workload-card">
    <div class="workload-header">
      <h2 class="workload-title">Carga de Trabajo por Hora</h2>
      <p class="workload-subtitle">Proyección de volumen para anticipar picos de procesamiento.</p>
    </div>

    <div class="chart-area">
      <!-- Barras -->
      <div class="bars-row">
        <div
          v-for="(val, i) in values"
          :key="i"
          class="bar-col"
        >
          <div class="bar-wrapper">
            <!-- Figura encima de la barra más alta -->
            <div v-if="hours[i] === activeHour && val > 0" class="bar-icon">{{ val }}</div>
            <div
              class="bar"
              :class="{ 'bar--active': hours[i] === activeHour }"
              :style="{ height: `${(val / maxVal) * 72}px` }"
            />
          </div>
          <span class="bar-label" :class="{ 'bar-label--active': hours[i] === activeHour }">
            {{ hours[i] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Alerta -->
    <div class="workload-alert">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#b45309"/></svg>
      <span v-if="activeHour">
        <strong>Alerta:</strong> Se detecta un pico de actividad proyectado a las {{ activeHour }}.
      </span>
      <span v-else>No se registran pedidos para la proyección de hoy.</span>
    </div>
  </div>
</template>

<style scoped>
.workload-card {
  background: #EDE8DE;
  border-radius: 24px;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 1rem;
  height: 100%;
}
.workload-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #3F0006;
  margin: 0;
}
.workload-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  color: #7C5730;
  margin: 0.3rem 0 0;
  line-height: 1.4;
}
.chart-area { flex: 1;
  padding-top: 1rem;
}
.bars-row {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  height: 140px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.bar-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100px;
}

.bar {
  width: 42px;
  background: #d7c8ba;
  border-radius: 999px 999px 0 0;
  transition: 0.4s ease;
}

.bar--active {
  background: #3F0006;
}

.bar-label {
  font-size: 0.75rem;
  color: #9b7a58;
  font-weight: 600;
}

.bar-label--active {
  color: #5b0008;
  font-weight: 700;
}

.bar-icon {
  position: absolute;
  top: -22px;

  width: 28px;
  height: 28px;

  border-radius: 50%;
  background: #3F0006;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 11px;
  font-weight: 700;
}

.workload-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff7a;
  border-radius: 24px;
  padding: 1rem 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.75rem;
  color: #92400e;
  line-height: 1.4;
}
.workload-alert strong { font-weight: 700; }
</style>