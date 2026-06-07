<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../../lib/api'

interface Order {
  id_pedido: number
  cliente_nombre: string
  total: number
  estado_pedido: string
  fecha_creacion: string
}

const orders = ref<Order[]>([])
const loading = ref(false)

const fetchOrders = async () => {
  loading.value = true
  try {
    // Traemos los últimos 10 para tener margen, aunque solo mostremos 3
    const res = await api.get('/orders', { params: { limit: 10 } })
    orders.value = res?.orders || []
  } catch (err) {
    console.error('Error al cargar pedidos en tiempo real:', err)
  } finally {
    loading.value = false
  }
}

const latestOrders = computed(() => orders.value.slice(0, 3))

const getStatusType = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'pendiente' || s === 'preparacion') return 'process'
  if (s === 'listo') return 'done'
  if (s === 'entregado') return 'delivered'
  return 'process'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'AHORA'
  if (diffInMinutes < 60) return `${diffInMinutes} MINS`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} HORAS`
  return date.toLocaleDateString()
}

const downloadCSV = () => {
  if (orders.value.length === 0) return

  const headers = "ID Pedido,Cliente,Total,Estado,Fecha\n"
  const rows = orders.value.map(o => 
    `${o.id_pedido},"${o.cliente_nombre}",${o.total},${o.estado_pedido},${o.fecha_creacion}`
  ).join("\n")

  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `pedidos_export_${new Date().toISOString().slice(0,10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(fetchOrders)
</script>

<template>
  <div class="orders-card">
    <div class="card-header">
      <div class="header-text">
        <h2 class="card-title">Pedidos en tiempo real</h2>
      </div>
    </div>

    <div class="order-list">
      <div
        v-for="(order, i) in latestOrders"
        :key="order.id_pedido"
        class="order-item"
        :class="{ 'order-item--first': i === 0 }"
      >
        <div class="order-top">
          <span class="order-id">#ORD-{{ order.id_pedido }}</span>
          <span class="order-amount">S/ {{ Number(order.total).toFixed(2) }}</span>
        </div>
        <div class="order-time">{{ formatTimeAgo(order.fecha_creacion) }} AGO</div>
        <div class="order-items">Cliente: {{ order.cliente_nombre }}</div>
        <div class="order-footer">
          <span class="order-badge" :class="`badge--${getStatusType(order.estado_pedido)}`">
            {{ order.estado_pedido.toUpperCase() }}
          </span>
          <span
            v-if="order.estado_pedido === 'entregado'"
            class="material-symbols-outlined delivered-icon"
          >done_all</span>
        </div>
      </div>

      <div v-if="!loading && latestOrders.length === 0" class="empty-state">
        No hay pedidos recientes para mostrar.
      </div>
      <div v-if="loading" class="empty-state">
        Cargando pedidos...
      </div>
    </div>

    <button class="btn-download" @click="downloadCSV" :disabled="orders.length === 0">
      <span class="material-symbols-outlined" style="font-size:15px">download</span>
      Download Report (.CSV)
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Noto+Serif:wght@700&family=Lato:wght@400;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal; font-style: normal;
  line-height: 1; letter-spacing: normal;
  text-transform: none; display: inline-block;
  white-space: nowrap; direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.orders-card { background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; text-align: start; }
.card-title { font-family: 'Noto Serif', serif; font-size: 20px; font-weight: 700; color: #3f0006; margin: 0 0 0.25rem; }

.order-list { display: flex; flex-direction: column; gap: 0.65rem; margin: 0.75rem 0; }
.order-item { padding: 0.75rem; background: #fff; border-radius: 10px; display: flex; flex-direction: column; gap: 0.2rem; border-left: 3px solid #e8d5d5; }
.order-item--first { border-left-color: #c28c18; }

.order-top { display: flex; justify-content: space-between; align-items: center; }
.order-id { font-weight: 800; font-size: 0.82rem; color: #3f0006; }
.order-amount { font-weight: 700; font-size: 0.82rem; color: #2a1a1a; }
.order-time { font-size: 0.68rem; color: #bfa8a8; text-transform: uppercase; letter-spacing: 0.04em; }
.order-items { font-size: 0.72rem; color: #9e8080; line-height: 1.4; }
.order-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.2rem; }

.order-badge { display: inline-block; padding: 0.18rem 0.55rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em; }
.badge--process   { background: #fff4e0; color: #b45309; }
.badge--done      { background: #e6f4ee; color: #2e7d52; }
.badge--delivered { background: #f0e0e0; color: #9e8080; }

.delivered-icon { font-size: 16px !important; color: #9e8080; }

.btn-download { display: flex; align-items: center; justify-content: center; gap: 0.4rem; width: 100%; padding: 0.55rem; background: transparent; border: 1px solid #e8d5d5; border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 0.75rem; color: #9e8080; cursor: pointer; transition: border-color 0.2s, color 0.2s; margin-top: auto; }
.btn-download:hover:not(:disabled) { border-color: #8b1a2e; color: #8b1a2e; }
.btn-download:disabled { opacity: 0.5; cursor: not-allowed; }

.empty-state { text-align: center; padding: 1rem; color: #9e8080; font-size: 0.8rem; font-style: italic; }
</style>