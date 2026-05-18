<script setup lang="ts">
import { ref } from 'vue'
import BaseStatusButton from '../atoms/BaseStatusButton.vue'

const props = defineProps<{
  orderId: string
  pickup?: string
  delivery?: string
  customerName: string
  items: string
  image: string
  status: 'pendiente' | 'en_proceso' | 'completado'
  currentStep?: number
}>()

const step = ref(props.currentStep ?? 0)
// 0=iniciar, 1=proceso, 2=listo, 3=entregado

const statusLabel: Record<string, { text: string; cls: string }> = {
  pendiente:   { text: 'PENDIENTE',   cls: 'badge--pending' },
  en_proceso:  { text: 'EN PROCESO',  cls: 'badge--process' },
  completado:  { text: 'COMPLETADO',  cls: 'badge--done' },
}
</script>

<template>
  <div class="order-row" :class="{ 'order-row--done': status === 'completado' }">
    <img :src="image" :alt="customerName" class="order-img" />

    <div class="order-body">
      <div class="order-meta">
        <span class="order-id-text">ID {{ orderId }}</span>
        <span v-if="pickup"   class="order-time-text">· Recogida: {{ pickup }}</span>
        <span v-if="delivery" class="order-time-text">· Envío: {{ delivery }}</span>
        <span class="order-status-badge" :class="statusLabel[status].cls">
          {{ statusLabel[status].text }}
        </span>
      </div>

      <p class="order-customer" :class="{ 'order-customer--done': status === 'completado' }">
        {{ customerName }}
      </p>
      <p class="order-items-text">{{ items }}</p>

      <div v-if="status !== 'completado'" class="order-actions">
        <BaseStatusButton
          label="Iniciar"
          variant="iniciar"
          :active="step === 0"
          @click="step = 1"
        />
        <BaseStatusButton
          label="Proceso"
          variant="proceso"
          :active="step >= 1"
          @click="step = 2"
        />
        <BaseStatusButton
          label="Listo para Entrega"
          variant="listo"
          :active="step >= 2"
          @click="step = 3"
        />
        <BaseStatusButton
          label="Entregado"
          variant="entregado"
          :active="step >= 3"
          @click="step = 3"
        />
      </div>

      <a v-else href="#" class="ver-boleta">Ver detalles de boleta</a>
    </div>
  </div>
</template>

<style scoped>
.order-row {
  display: flex; gap: 1.1rem; align-items: flex-start;
  padding: 1.25rem;
  background: #fff;
  border-radius: 34px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.113);
  transition: box-shadow 0.2s;
}
.order-row:hover { box-shadow: 0 4px 16px rgba(139,26,46,0.07); }
.order-row--done { opacity: 0.72; }

.order-img {
  width: 150px; height: 150px;
  border-radius: 24px; object-fit: cover;
  flex-shrink: 0;
}

.order-body { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; text-align: start;}

.order-meta { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.order-id-text {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem; font-weight: 700; color: #9e8080;
}
.order-time-text {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem; color: #9e8080;
}
.order-status-badge {
  margin-left: auto;
  font-family: 'Lato', sans-serif;
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.65rem; border-radius: 20px;
}
.badge--pending { background: #fde8e8; color: #9b1c1c; }
.badge--process { background: #fff4e0; color: #b45309; }
.badge--done    { background: #e6f4ee; color: #2e7d52; }

.order-customer {
  font-family: 'Lato', sans-serif;
  font-size: 1rem; font-weight: 800; color: #2a1a1a;
  margin: 0;
}
.order-customer--done { text-decoration: line-through; color: #9e8080; }

.order-items-text {
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; color: #9e8080; margin: 0;
  line-height: 1.4;
}
.order-actions {
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  margin-top: 0.4rem;
  max-width: 350px;
}
.ver-boleta {
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  color: #8b1a2e; text-decoration: none;
  margin-top: 0.25rem;
}
.ver-boleta:hover { text-decoration: underline; }
</style>