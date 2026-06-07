<script setup lang="ts">
import { computed } from 'vue'

interface Opcion {
  id: number
  id_opcion: number
  nombre: string
  precio_adicional: number
}

interface DetallePedido {
  id: number
  id_pedido: number
  id_producto: number
  nombre: string
  cantidad: number
  subtotal: number
  observaciones?: string
  precio?: number
  opciones?: Opcion[]
}

interface OrderDetail {
  id_pedido: number
  cliente_nombre: string
  estado_pedido: string
  total: number
  fecha_creacion: string
  direccion_manual?: string
  direccion?: string
  referencia?: string
  detalle_pedido?: DetallePedido[]
}

const props = defineProps<{
  order: OrderDetail | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const formatDate = computed(() => {
  if (!props.order) return ''
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(props.order.fecha_creacion))
})

const statusText = computed(() => {
  const status: Record<string, string> = {
    pendiente: 'PENDIENTE',
    preparacion: 'PREPARACIÓN',
    listo: 'LISTO',
    entregado: 'ENTREGADO',
    cancelado: 'CANCELADO'
  }
  return props.order ? (status[props.order.estado_pedido] || props.order.estado_pedido) : ''
})

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-content">
        <button class="modal-close" @click="$emit('close')" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div v-if="order" class="modal-body">
          <!-- Header -->
          <div class="boleta-header">
            <h2 class="boleta-title">Detalles de Boleta</h2>
            <div class="boleta-id">
              <span class="label">Pedido:</span>
              <span class="value">#{{ order.id_pedido }}</span>
            </div>
          </div>

          <!-- Info Cliente -->
          <div class="boleta-section">
            <h3 class="section-title">Cliente</h3>
            <div class="info-row">
              <span class="label">Nombre:</span>
              <span class="value">{{ order.cliente_nombre }}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value status" :class="`status--${order.estado_pedido}`">
                {{ statusText }}
              </span>
            </div>
          </div>

          <!-- Info Entrega -->
          <div class="boleta-section">
            <h3 class="section-title">Entrega</h3>
            <div class="info-row">
              <span class="label">Fecha:</span>
              <span class="value">{{ formatDate }}</span>
            </div>
            <div v-if="order.direccion_manual" class="info-row">
              <span class="label">Dirección:</span>
              <span class="value">{{ order.direccion_manual }}</span>
            </div>
          </div>

          <!-- Items -->
          <div v-if="order.detalle_pedido && order.detalle_pedido.length > 0" class="boleta-section">
            <h3 class="section-title">Artículos Pedidos</h3>
            <div class="items-list">
              <div v-for="item in order.detalle_pedido" :key="item.id" class="item-card">
                <div class="item-header">
                  <div class="item-info">
                    <span class="item-name">{{ item.nombre }}</span>
                    <span class="item-qty">Cantidad: {{ item.cantidad }}</span>
                  </div>
                  <span class="item-price">S/ {{ Number(item.subtotal).toFixed(2) }}</span>
                </div>
                
                <!-- Especificaciones/Opciones -->
                <div v-if="item.opciones && item.opciones.length > 0" class="item-specs">
                  <div class="specs-title">Especificaciones:</div>
                  <ul class="specs-list">
                    <li v-for="opcion in item.opciones" :key="opcion.id" class="spec-item">
                      <span class="spec-name">{{ opcion.nombre }}</span>
                      <span v-if="Number(opcion.precio_adicional) > 0" class="spec-price">
                        +S/ {{ Number(opcion.precio_adicional).toFixed(2) }}
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Observaciones -->
                <div v-if="item.observaciones" class="item-observations">
                  <span class="obs-label">Notas:</span>
                  <span class="obs-text">{{ item.observaciones }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="boleta-section boleta-total">
            <div class="total-row">
              <span class="label">Total:</span>
              <span class="value">S/ {{ order.total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button class="btn-close" @click="$emit('close')" type="button">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9e8080;
  transition: color 0.2s;
  z-index: 10;
}

.modal-close:hover {
  color: #8b1a2e;
}

.modal-body {
  padding: 2rem;
}

.boleta-header {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f5ece4;
  padding-bottom: 1rem;
}

.boleta-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #2a1a1a;
  margin: 0 0 0.5rem 0;
}

.boleta-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.boleta-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #9e8080;
  text-transform: uppercase;
  margin: 0 0 0.75rem 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
}

.label {
  color: #9e8080;
  font-weight: 600;
}

.value {
  color: #2a1a1a;
  font-weight: 500;
}

.status {
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.status--pendiente {
  background: #fde8e8;
  color: #9b1c1c;
}

.status--preparacion {
  background: #fff4e0;
  color: #b45309;
}

.status--listo {
  background: #fff4e0;
  color: #b45309;
}

.status--entregado {
  background: #e6f4ee;
  color: #2e7d52;
}

.status--cancelado {
  background: #fde8e8;
  color: #9b1c1c;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  background: #ffffff;
  border: 1px solid #f5ece4;
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #8b1a2e;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  color: #2a1a1a;
  font-weight: 600;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
}

.item-qty {
  color: #9e8080;
  font-size: 0.85rem;
  font-family: 'Lato', sans-serif;
}

.item-price {
  color: #8b1a2e;
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
}

.item-specs {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #f8f3e9;
  border-radius: 8px;
}

.specs-title {
  color: #9e8080;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-family: 'Lato', sans-serif;
}

.specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
}

.spec-name {
  color: #2a1a1a;
  padding-left: 0.5rem;
}

.spec-price {
  color: #8b1a2e;
  font-weight: 600;
  font-size: 0.85rem;
}

.item-observations {
  margin: 0.75rem 0 0 0;
  padding: 0.75rem;
  background: #f8f3e9;
  border-radius: 8px;
  display: flex;
  gap: 0.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
}

.obs-label {
  color: #9e8080;
  font-weight: 700;
  flex-shrink: 0;
}

.obs-text {
  color: #2a1a1a;
  font-style: italic;
}

.boleta-total {
  background: #f5ece4;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
}

.total-row .value {
  color: #8b1a2e;
  font-size: 1.25rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f5ece4;
}

.btn-close {
  flex: 1;
  padding: 0.75rem;
  background: #8b1a2e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #6d1520;
}
</style>
