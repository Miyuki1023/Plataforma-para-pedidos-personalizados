<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseStatusButton from '../atoms/BaseStatusButton.vue'

const props = defineProps<{
  orderId: string | number
  pickup?: string
  delivery?: string
  customerName: string
  items?: string
  image?: string
  status: 'pendiente' | 'preparacion' | 'listo' | 'entregado' | 'cancelado'
  currentStep?: number
  total?: number
}>()

const emit = defineEmits<{
  (e: 'update-status', payload: { orderId: string | number; status: 'pendiente' | 'preparacion' | 'listo' | 'entregado' | 'cancelado' }): void
  (e: 'view-details', orderId: string | number): void
}>()

const statusStepMap: Record<string, number> = {
  pendiente: 0,
  preparacion: 1,
  listo: 2,
  entregado: 3,
  cancelado: 0,
}

const step = ref(props.currentStep ?? statusStepMap[props.status] ?? 0)

watch(
  () => props.status,
  (value) => {
    step.value = statusStepMap[value] ?? 0
  }
)

const statusLabel: Record<string, { text: string; cls: string }> = {
  pendiente:    { text: 'PENDIENTE',     cls: 'badge--pending' },
  preparacion:  { text: 'PREPARACIÓN',   cls: 'badge--process' },
  listo:        { text: 'LISTO',         cls: 'badge--process' },
  entregado:    { text: 'ENTREGADO',     cls: 'badge--done' },
  cancelado:    { text: 'CANCELADO',     cls: 'badge--pending' },
}

const imageUrl = computed(() => props.image || 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=160&q=80')
const itemSummary = computed(() => {
  if (props.items) return props.items
  if (props.total != null) return `Total: S/ ${props.total.toFixed(2)}`
  return 'Pedido sin detalles'
})

function changeStatus(newStatus: typeof props.status) {
  if (props.status === newStatus) {
    return
  }
  step.value = statusStepMap[newStatus] ?? step.value
  emit('update-status', { orderId: props.orderId, status: newStatus })
}
</script>

<template>
  <div class="order-row" :class="{ 'order-row--done': status === 'entregado' || status === 'cancelado' }">
    <img :src="imageUrl" :alt="customerName" class="order-img" />

    <div class="order-body">
      <div class="order-meta">
        <span class="order-id-text">ID {{ orderId }}</span>
        <span v-if="pickup"   class="order-time-text">· Recogida: {{ pickup }}</span>
        <span v-if="delivery" class="order-time-text">· Envío: {{ delivery }}</span>
        <span class="order-status-badge" :class="statusLabel[status].cls">
          {{ statusLabel[status].text }}
        </span>
      </div>

      <p class="order-customer" :class="{ 'order-customer--done': status === 'entregado' || status === 'cancelado' }">
        {{ customerName }}
      </p>
      <p class="order-items-text">{{ itemSummary }}</p>

      <div v-if="status !== 'entregado' && status !== 'cancelado'" class="order-actions">
        <BaseStatusButton
          v-if="status === 'pendiente'"
          label="Iniciar Preparación"
          variant="iniciar"
          :active="false"
          @click="changeStatus('preparacion')"
        />
        <BaseStatusButton
          v-if="status === 'preparacion'"
          label="Marcar como Listo"
          variant="proceso"
          :active="false"
          @click="changeStatus('listo')"
        />
        <BaseStatusButton
          v-if="status === 'listo'"
          label="Marcar Entregado"
          variant="listo"
          :active="false"
          @click="changeStatus('entregado')"
        />
      </div>

      <a href="#" class="ver-boleta" @click.prevent="$emit('view-details', orderId)">Ver detalles de boleta</a>
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