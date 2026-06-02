<script setup lang="ts">
import EmployeeSidebar      from '../components/organisms/EmployeeSidebar.vue'
import AppTopBar            from '../components/organisms/AppTopBar.vue'
import DashboardFilters     from '../components/organisms/DashboardFilters.vue'
import InventoryTable       from '../components/organisms/InventoryTable.vue'
import RealtimeOrders       from '../components/organisms/RealTimeOrders.vue'
import ProductionGoalCard   from '../components/molecules/ProductionGoalCard.vue'
import WorkloadChart        from '../components/molecules/WorkloadChart.vue'

const inventory = [
  { id: 1, name: 'Sourdough Loaf',   desc: 'Traditional Hearth', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=60&q=80', stockLabel: '42 en stock', stockType: 'ok'  as const, price: 'S/50' },
  { id: 2, name: 'Butter Croissant', desc: 'Viennoserie',        img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=60&q=80', stockLabel: '8 en stock',  stockType: 'low' as const, price: 'S/50' },
  { id: 3, name: 'Sea Salt Cookies', desc: 'Daily Batch',        img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=60&q=80', stockLabel: 'Sin stock',   stockType: 'out' as const, price: 'S/50' },
]

const orders = [
  { id: '#ORD-8821', amount: 'S/34.50', time: '2 mins',  items: '2x Almond Croissant, 1x Vanilla Latte, 1x Sourdough', status: 'PROCESO',    statusType: 'process'   as const },
  { id: '#ORD-8819', amount: 'S/12.00', time: '24 mins', items: '3x Chocolate Chunk Cookies',                           status: 'FINALIZADO', statusType: 'done'      as const },
  { id: '#ORD-8815', amount: 'S/46.10', time: '45 mins', items: 'Mix hora',                                             status: 'ENTREGADO',  statusType: 'delivered' as const },
]
</script>

<template>
  <div class="emp-dashboard">
    <EmployeeSidebar />

    <main class="emp-main">
      <AppTopBar />

      <div class="emp-content">
        <div class="page-header">
          <h1 class="page-title">Panel de control</h1>
          <p class="page-subtitle">Resumen en tiempo real de tu negocio</p>
        </div>
      
        <div class="top-cards">
          <ProductionGoalCard
            :current="158" :total="200"
            percent-label="79% Completado"
            :in-oven="24" :cooling="12" :packing="8"
          />
          <WorkloadChart />
        </div>

        <DashboardFilters />

        <div class="bottom-grid">
          <InventoryTable :items="inventory" />
          <RealtimeOrders :orders="orders" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Lato:wght@300;400;600;700&display=swap');

.emp-dashboard { display: flex; min-height: 100vh; background: #fff; font-family: 'Lato', sans-serif; }
.emp-main { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.emp-content { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.25rem 2.75rem; text-align: start; }

.page-title { font-family: "Noto Serif", sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #3f0006;
  margin: 0;}
.page-subtitle { font-size: 0.8rem;
  color: #7c5730;
  margin: 0; }

.top-cards { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem; }
.bottom-grid { display: grid; grid-template-columns: 1fr 280px; gap: 1rem; align-items: start; }

@media (max-width: 900px) {
  .top-cards, .bottom-grid { grid-template-columns: 1fr; }
  .emp-content { padding: 1rem; }
}
</style>