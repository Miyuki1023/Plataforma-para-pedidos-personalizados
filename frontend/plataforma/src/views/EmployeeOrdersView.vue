<script setup lang="ts">
import EmployeeSidebar from '../components/organisms/EmployeeSidebar.vue'
import AppTopBar from '../components/organisms/AppTopBar.vue'
import OrderStatCard from '../components/molecules/OrderStatCard.vue'
import MiniCalendar from '../components/molecules/MiniCalendar.vue'
import OrderRow from '../components/molecules/OrderRow.vue'

const stats = [
  { label: 'INICIAR',    value: 12, note: '+2 recibidos hoy', variant: 'default',  watermark: '📋' },
  { label: 'EN PROCESO', value: '05', note: 'Capacidad al 50%', variant: 'active',   watermark: '⚙️' },
  { label: 'FINALIZADO', value: '08', note: 'Próxima ruta: 15:00', variant: 'warning',  watermark: '✓' },
  { label: 'ENTREGADO',  value: 24, note: 'Meta diaria: 30', variant: 'neutral',  watermark: '🚚' },
]

const orders = [
  {
    orderId: '#4529',
    pickup: '14:30PM',
    customerName: 'Clara Montes',
    items: '1x Torta de Frutos Rojos (Mediana), 12x Macarons de Vainilla',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=160&q=80',
    status: 'pendiente' as const,
    currentStep: 0,
  },
  {
    orderId: '#4530',
    delivery: '16:00PM',
    customerName: 'Roberto Gómez',
    items: '24x Galletas Artesanales, 1x Pan de Canela Familiar',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=160&q=80',
    status: 'en_proceso' as const,
    currentStep: 1,
  },
  {
    orderId: '#4525',
    delivery: 'Entregado 10:45AM',
    customerName: 'Elena Ruiz',
    items: '1x Torta Sacher Personalizada (Sin Gluten)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&q=80',
    status: 'completado' as const,
    currentStep: 3,
  },
]
</script>

<template>
  <div class="orders-page">
    <EmployeeSidebar />

    <div class="orders-content">
      <AppTopBar />

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
            <p class="orders-subtitle">Mostrando 12 pedidos activos priorizados por entrega</p>
          </div>
          <div class="orders-actions">
            <button class="btn-organize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Organizar Envíos
            </button>
            <div class="filter-tabs">
              <button class="filter-tab active">Todos</button>
              <button class="filter-tab">Urgentes</button>
              <button class="filter-tab">Personalizados</button>
            </div>
          </div>
        </div>

        <!-- Calendar -->
        <MiniCalendar />

        <!-- Order list -->
        <div class="order-list">
          <OrderRow
            v-for="order in orders"
            :key="order.orderId"
            v-bind="order"
          />
        </div>

      </main>
    </div>
  </div>
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