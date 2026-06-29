<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EmployeeSidebar from '../components/organisms/EmployeeSidebar.vue'
import OrderStatCard from '../components/molecules/OrderStatCard.vue'
import MiniCalendar from '../components/molecules/MiniCalendar.vue'
import OrderRow from '../components/molecules/OrderRow.vue'
import OrderDetailModal from '../components/organisms/OrderDetailModal.vue'
import api from '../lib/api'

type OrderStatus = 'pendiente' | 'preparacion' | 'listo' | 'entregado' | 'cancelado'

type OrderItem = {
  id_pedido: number
  cliente_nombre: string
  trabajador_nombre?: string
  fecha_creacion: string
  direccion_manual?: string
  total: number
  estado_pedido: OrderStatus
}

const orders = ref<OrderItem[]>([])
const loading = ref(false)
const errorMessage = ref('')
const selectedStatus = ref<'all' | OrderStatus>('all')
const selectedDate = ref<string | null>(null)
const isModalOpen = ref(false)
const selectedOrderDetails = ref<any>(null)

const statusTabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Preparación', value: 'preparacion' },
  { label: 'Listos', value: 'listo' },
  { label: 'Entregados', value: 'entregado' },
]

const statusCounts = computed(() => ({
  pendiente: orders.value.filter((order) => order.estado_pedido === 'pendiente').length,
  preparacion: orders.value.filter((order) => order.estado_pedido === 'preparacion').length,
  listo: orders.value.filter((order) => order.estado_pedido === 'listo').length,
  entregado: orders.value.filter((order) => order.estado_pedido === 'entregado').length,
  cancelado: orders.value.filter((order) => order.estado_pedido === 'cancelado').length,
}))

const stats = computed(() => [
  { label: 'PENDIENTES', value: statusCounts.value.pendiente, note: 'Pedidos nuevos pendientes', variant: 'default', watermark: '📋' },
  { label: 'PREPARACIÓN', value: statusCounts.value.preparacion, note: 'En proceso en cocina', variant: 'active', watermark: '⚙️' },
  { label: 'LISTOS', value: statusCounts.value.listo, note: 'Preparados para entrega', variant: 'warning', watermark: '✓' },
  { label: 'ENTREGADOS', value: statusCounts.value.entregado, note: 'Entregas completadas', variant: 'neutral', watermark: '🚚' },
])

const visibleOrders = computed(() => {
  return orders.value.filter((order) => {
    return selectedStatus.value === 'all' || order.estado_pedido === selectedStatus.value
  })
})

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}

function normalizeStatus(status: string): OrderStatus {
  const value = String(status).toLowerCase()
  if (value === 'preparando' || value === 'preparacion') return 'preparacion'
  if (value === 'pendiente') return 'pendiente'
  if (value === 'listo') return 'listo'
  if (value === 'entregado') return 'entregado'
  if (value === 'cancelado') return 'cancelado'
  return 'pendiente'
}

function normalizeOrder(order: any): OrderItem {
  return {
    ...order,
    id_pedido: Number(order.id_pedido),
    total: Number(order.total) || 0,
    estado_pedido: normalizeStatus(order.estado_pedido),
    fecha_creacion: String(order.fecha_creacion),
  }
}

const orderDates = computed<string[]>(() =>
  orders.value
    .map((order) => {
      const d = new Date(order.fecha_creacion)
      if (isNaN(d.getTime())) return null
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    })
    .filter((date): date is string => Boolean(date))
)

function mapOrder(order: OrderItem) {
  return {
    orderId: `#${order.id_pedido}`,
    customerName: order.cliente_nombre,
    items: `Total: S/ ${order.total.toFixed(2)}`,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=160&q=80',
    status: order.estado_pedido,
    currentStep: order.estado_pedido === 'pendiente' ? 0 : order.estado_pedido === 'preparacion' ? 1 : order.estado_pedido === 'listo' ? 2 : 3,
    pickup: formatDate(order.fecha_creacion),
    delivery: order.direccion_manual || undefined,
    total: order.total,
  }
}

const mappedOrders = computed(() => visibleOrders.value.map(mapOrder))

async function fetchOrders() {
  loading.value = true
  errorMessage.value = ''

  try {
    const params: Record<string, string> = {}
    if (selectedStatus.value !== 'all') {
      params.estado_pedido = selectedStatus.value
    }
    if (selectedDate.value) {
      params.fecha_inicio = selectedDate.value
      params.fecha_fin = selectedDate.value
    }

    const response: any = await api.get('/orders', { params })
    orders.value = Array.isArray(response?.orders)
      ? response.orders.map(normalizeOrder)
      : (Array.isArray(response?.data) ? response.data.map(normalizeOrder) : [])
  } catch (error) {
    console.error(error)
    const err = error as any
    if (err?.response?.status === 401) {
      errorMessage.value = 'No estás autenticado. Inicia sesión para ver los pedidos o agrega un token válido.'
    } else {
      errorMessage.value = 'No se pudieron cargar los pedidos. Vuelve a intentar.'
    }
    orders.value = []
  } finally {
    loading.value = false
  }
}

function handleStatusTabChange(value: typeof statusTabs[number]['value']) {
  selectedStatus.value = value as typeof selectedStatus.value
  fetchOrders()
}

function handleCalendarSelect(date: string | null) {
  selectedDate.value = date
  fetchOrders()
}

async function handleUpdateStatus(payload: { orderId: string | number; status: OrderStatus }) {
  try {
    const orderId = String(payload.orderId).replace('#', '')
    await api.patch(`/orders/${orderId}/status`, {
      estado_pedido: payload.status
    })

    const order = orders.value.find((item) => item.id_pedido === Number(orderId))
    if (order) {
      order.estado_pedido = payload.status
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'No se pudo actualizar el estado del pedido.'
  }
}

async function handleViewDetails(orderId: string | number) {
  try {
    const id = String(orderId).replace('#', '')
    const response: any = await api.get(`/orders/${id}`)
    const orderData = response?.order || response?.data
    if (orderData) {
      // Normalizar datos numéricos
      selectedOrderDetails.value = {
        ...orderData,
        id_pedido: Number(orderData.id_pedido),
        total: Number(orderData.total) || 0,
        detalle_pedido: Array.isArray(orderData.detalle_pedido)
          ? orderData.detalle_pedido.map((item: any) => ({
              ...item,
              cantidad: Number(item.cantidad),
              subtotal: Number(item.subtotal),
              precio: Number(item.precio),
              opciones: Array.isArray(item.opciones)
                ? item.opciones.map((op: any) => ({
                    ...op,
                    precio_adicional: Number(op.precio_adicional) || 0
                  }))
                : []
            }))
          : []
      }
      isModalOpen.value = true
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = 'No se pudieron cargar los detalles del pedido.'
  }
}

function handleCloseModal() {
  isModalOpen.value = false
  selectedOrderDetails.value = null
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="orders-page">
    <EmployeeSidebar />

    <div class="orders-content">

      <main class="orders-main">

        <!-- Page header -->
        <div class="page-header">
          <h1 class="page-title">Gestión de pedido</h1>
        </div>

        <!-- Stat cards -->
        <div class="stats-row">
          <OrderStatCard
            v-for="s in stats"
            :key="s.label"
            :label="s.label"
            :value="s.value"
            :note="s.note"
            :variant="s.variant as any"
          >
            <template #watermark>{{ s.watermark }}</template>
          </OrderStatCard>
        </div>

        <!-- Orders header -->
        <div class="orders-header">
          <div>
            <h2 class="orders-title">Pedidos de Hoy</h2>
            <p class="orders-subtitle">Mostrando {{ visibleOrders.length }} pedidos activos{{ selectedDate ? ` en ${selectedDate}` : '' }}</p>
            <p v-if="selectedDate" class="orders-date-filter">Filtrando por fecha: {{ selectedDate }}</p>
          </div>
          <div class="orders-actions">
            <button class="btn-organize" type="button" @click="fetchOrders">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Actualizar pedidos
            </button>
            <div class="filter-tabs">
              <button
                v-for="tab in statusTabs"
                :key="tab.value"
                type="button"
                class="filter-tab"
                :class="{ 'active': selectedStatus === tab.value }"
                @click="handleStatusTabChange(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="orders-error-message">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- Calendar -->
        <MiniCalendar :busy-dates="orderDates" @update:selectedDate="handleCalendarSelect" />

        <!-- Order list -->
        <div class="order-list">
          <OrderRow
            v-if="!loading"
            v-for="order in mappedOrders"
            :key="order.orderId"
            v-bind="order"
            @update-status="handleUpdateStatus"
            @view-details="handleViewDetails"
          />
          <p v-if="!loading && mappedOrders.length === 0" class="no-orders-text">No hay pedidos para mostrar.</p>
          <p v-if="loading" class="no-orders-text">Cargando pedidos...</p>
        </div>

      </main>
    </div>
  </div>

  <!-- Modal de detalles -->
  <OrderDetailModal :order="selectedOrderDetails" :is-open="isModalOpen" @close="handleCloseModal" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700;800&display=swap');

.orders-page {
  display: flex; min-height: 100vh;
  background: #ffffff;
  font-family: 'Lato', sans-serif;
}
.orders-content {
  flex: 1; display: flex;
  flex-direction: column;
  overflow: auto;
}
.orders-main {
  flex: 1;
  padding: 1.5rem 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Page header */
.page-title {
  font-family: Noto Serif, sans-serif;
  font-size: 40px; font-weight: 400;
  color: #3f0006; margin: 0;
  text-align: start;
  padding-bottom: 1rem;
}

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

/* Orders header */
.orders-header {
  display: flex; align-items: flex-start;
  text-align: start;
  padding-top: 20px;
  justify-content: space-between; flex-wrap: wrap; gap: 1rem;
}
.orders-title {
  font-family: Noto Serif, sans-serif;
  font-size: 1.5rem; font-weight: 800;
  color: #2a1a1a; margin: 0;
}
.orders-subtitle {
  font-family: Jakarta Sans, sans-serif;
  font-size: 0.78rem; color: #9e8080;
  margin: 0.2rem 0 0;
}
.orders-actions { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }

.btn-organize {
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.5rem 1rem;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 600;
  color: #2a1a1a; cursor: pointer;
  transition: border-color 0.2s;
}
.btn-organize:hover { border-color: #8b1a2e; color: #8b1a2e; }

.filter-tabs { display: flex; gap: 0.35rem; }
.filter-tab {
  padding: 0.4rem 0.85rem;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 20px;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  color: #9e8080; cursor: pointer;
  transition: all 0.2s;
}
.filter-tab:hover { border-color: #8b1a2e; color: #8b1a2e; }
.filter-tab.active {
  background: #8b1a2e; border-color: #8b1a2e;
  color: #fff;
}

/* Order list */
.order-list {
  display: flex; flex-direction: column; gap: 1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .orders-header { flex-direction: column; }
}
@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .orders-main { padding: 1rem; }
}
</style>