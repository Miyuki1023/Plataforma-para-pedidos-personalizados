<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api                 from '../lib/api'
import AdminSidebar      from '../components/organisms/AdminSidebar.vue'
import AppTopBar         from '../components/organisms/AppTopBar.vue'
import DashboardFilters  from '../components/organisms/DashboardFilters.vue'
// CAMBIO: Importamos el componente autónomo que sí funciona
import InventoryAttention from '../components/molecules/InventoryAttention.vue' 
import RealtimeOrders    from '../components/molecules/RealTimeOrders.vue'

const orders = ref<any[]>([])
const currentPeriod = ref('Hoy')

const activeFilters = ref({
  period: 'Hoy',
  category: '',
  year: ''
})

const stats = ref({
  sales: 'S/ 0.00',
  orderCount: 0,
  avgTicket: '0.00',
  completionRate: 0
})

// Ahora esta función solo se encarga de las órdenes y las estadísticas del panel
const fetchDashboardData = async (filters: any = {}) => {
  try {
    const orderParams: any = {}

    if (filters.period) {
      const now = new Date()
      let start = new Date()
      start.setHours(0, 0, 0, 0)

      if (filters.period === 'Esta semana') {
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1)
        start.setDate(diff)
      } else if (filters.period === 'Este mes') {
        start.setDate(1)
      } else if (filters.period === 'Este año') {
        start.setMonth(0, 1)
      }
      
      orderParams.fecha_inicio = start.toISOString().split('T')[0]
      orderParams.fecha_fin = now.toISOString().split('T')[0]
    }

    // Eliminamos la petición de productos de aquí, ya que el componente hijo la hará sola
    const [recentOrdersRes, statsOrdersRes] = await Promise.all([
      api.get('/orders', { params: { limit: 5 } }),
      api.get('/orders', { params: orderParams })  
    ])

    // 1. Lista de pedidos recientes
    const recentRaw = recentOrdersRes?.orders || recentOrdersRes?.data || []
    orders.value = recentRaw.map((o: any) => ({
      id: `#ORD-${o.id}`,
      amount: `S/ ${Number(o.total).toFixed(2)}`,
      time: formatRelativeTime(o.fecha_creacion),
      items: o.usuario || 'Cliente Invitado',
      status: o.estado_pedido?.toUpperCase() || 'PROCESO',
      statusType: o.estado_pedido === 'entregado' ? 'delivered' : (o.estado_pedido === 'finalizado' ? 'done' : 'process')
    }))

    // 2. Cálculos para las Stat Cards
    const statsOrders = statsOrdersRes?.orders || statsOrdersRes?.data || []
    const totalValue = statsOrders.reduce((acc: number, o: any) => acc + Number(o.total), 0)
    stats.value = {
      sales: `S/ ${totalValue.toFixed(2)}`,
      orderCount: statsOrders.length,
      avgTicket: statsOrders.length > 0 ? (totalValue / statsOrders.length).toFixed(2) : '0.00',
      completionRate: statsOrders.length > 0 
        ? Math.round((statsOrders.filter((o:any) => o.estado_pedido === 'entregado').length / statsOrders.length) * 100) 
        : 0
    }
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  }
}

const handleFilterChange = (filter: { type: string, value: string }) => {
  if (filter.value.includes('Selecciona')) return
  activeFilters.value[filter.type as keyof typeof activeFilters.value] = filter.value
  
  if (filter.type === 'period') {
    currentPeriod.value = filter.value
  }
  fetchDashboardData(activeFilters.value)
}

const downloadAllOrdersCSV = async () => {
  try {
    const res = await api.get('/orders', { params: { limit: 100 } })
    const allOrders = res?.orders || res?.data || []
    
    if (allOrders.length === 0) return

    const headers = ['ID Pedido', 'Cliente', 'Fecha', 'Total', 'Estado']
    const csvContent = [
      headers.join(','),
      ...allOrders.map((o: any) => [
        o.id_pedido || o.id,
        `"${o.cliente_nombre || o.usuario || 'Invitado'}"`,
        o.fecha_creacion,
        o.total,
        o.estado_pedido
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte_ventas_vainilla_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  } catch (error) {
    console.error('Error al generar el reporte CSV:', error)
  }
}

const formatRelativeTime = (dateStr: string) => {
  const diffMins = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000)
  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `${diffMins} mins`
  return `${Math.floor(diffMins / 60)}h`
}

onMounted(() => fetchDashboardData(activeFilters.value))
</script>

<template>
  <div class="admin-dashboard">
    <AdminSidebar />

    <main class="admin-main">
      <AppTopBar placeholder="Buscar..." />

      <div class="admin-content">

        <div class="page-header">
          <h1 class="page-title">Panel de control</h1>
          <p class="page-subtitle">Resumen en tiempo real de tu negocio</p>
        </div>

        <DashboardFilters
          :periods="['Hoy','Esta semana','Este mes','Este año']"
          :categories="['Tortas','Cupcakes','Galletas','Bocaditos','Pastelería Salada','Cheesecakes']"
          :years="['2025','2024','2023']"
          @filter-change="handleFilterChange"
        />

        <div class="stats-grid">
          <div class="stat-card stat-card--light">
            <div class="stat-header">
              <span class="stat-label">VENTAS ({{ currentPeriod.toUpperCase() }})</span>
              <span class="material-symbols-outlined stat-icon">trending_up</span>
            </div>
            <div class="stat-value">{{ stats.sales }}</div>
            <div class="stat-bars">
              <div class="bar" style="height:18px"></div>
              <div class="bar" style="height:28px"></div>
              <div class="bar" style="height:22px"></div>
              <div class="bar" style="height:38px"></div>
              <div class="bar" style="height:26px"></div>
              <div class="bar bar--active" style="height:46px"></div>
            </div>
            <div class="stat-footer stat-footer--up">↑ Actualizado ahora</div>
          </div>

          <div class="stat-card stat-card--light">
            <div class="stat-header">
              <span class="stat-label">{{ currentPeriod.toUpperCase() }}</span>
              <span class="material-symbols-outlined stat-icon">calendar_month</span>
            </div>
            <div class="stat-value">{{ stats.orderCount }} pedidos</div>
            <svg class="mini-chart" viewBox="0 0 120 50" fill="none">
              <path d="M0 40 C20 38,30 10,50 15 C70 20,80 35,100 8 C110 2,115 5,120 5" stroke="#8b1a2e" stroke-width="2" fill="none"/>
            </svg>
            <div class="stat-footer">Ticket promedio: S/ {{ stats.avgTicket }}</div>
          </div>

          <div class="stat-card stat-card--dark">
            <div class="stat-header">
              <span class="stat-label-light">OPERACIONES ({{ currentPeriod.toUpperCase() }})</span>
              <span class="material-symbols-outlined stat-icon-light">receipt_long</span>
            </div>
            <div class="stat-value-dark">{{ stats.orderCount }} totales</div>
            <div class="progress-row">
              <span class="progress-label-light">Proceso</span>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" :style="{ width: stats.completionRate + '%' }"></div>
              </div>
              <span class="progress-label-light">{{ stats.completionRate }}% Terminado</span>
            </div>
          </div>
        </div>

        <div class="bottom-grid">
          <InventoryAttention />
          <RealtimeOrders :orders="orders" @download="downloadAllOrdersCSV" />
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Tu CSS se mantiene exactamente igual */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Noto+Serif:wght@400;700&family=Lato:wght@300;400;600;700&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal; font-style: normal;
  line-height: 1; letter-spacing: normal;
  text-transform: none; display: inline-block;
  white-space: nowrap; direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.admin-dashboard { display: flex; min-height: 100vh; background: #fff; font-family: 'Lato', sans-serif; }
.admin-main { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.admin-content { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.25rem 2.75rem; text-align: start; }

.page-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; font-weight: 700; color: #3f0006; margin: 0; }
.page-subtitle { font-size: 0.8rem; color: #7c5730; margin: 0; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
.stat-card { border-radius: 14px; padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.stat-card--light { background: #fef9ef; border: 1px solid #e8d5d5; }
.stat-card--dark  { background: #8b1a2e; border: none; }

.stat-header { display: flex; align-items: center; justify-content: space-between; }
.stat-label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; color: #9e8080; }
.stat-label-light { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); }

.stat-icon { font-size: 18px !important; color: #8b1a2e; }
.stat-icon-light { font-size: 18px !important; color: rgba(255,255,255,0.7); }

.stat-value { font-family: 'Noto Serif', serif; font-size: 1.7rem; font-weight: 700; color: #3f0006; line-height: 1.1; }
.stat-value-dark { font-family: 'Noto Serif', serif; font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.1; }

.stat-bars { display: flex; align-items: flex-end; gap: 4px; height: 50px; margin-top: 0.25rem; }
.bar { flex: 1; background: #e8d5c8; border-radius: 3px 3px 0 0; }
.bar--active { background: #8b1a2e; }

.mini-chart { width: 100%; height: 50px; margin-top: 0.25rem; }

.stat-footer { font-size: 0.72rem; color: #9e8080; }
.stat-footer--up { color: #2e7d52; font-weight: 700; }

.progress-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
.progress-label-light { font-size: 0.68rem; color: rgba(255,255,255,0.75); white-space: nowrap; }
.progress-bar-track { flex: 1; height: 5px; background: rgba(255,255,255,0.25); border-radius: 10px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: rgba(255,255,255,0.85); border-radius: 10px; }

.bottom-grid { display: grid; grid-template-columns: 1fr 280px; gap: 1rem; align-items: start; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-card--dark { grid-column: span 2; }
}
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr; }
  .stat-card--dark { grid-column: span 1; }
  .bottom-grid { grid-template-columns: 1fr; }
  .admin-content { padding: 1rem; }
}
</style>