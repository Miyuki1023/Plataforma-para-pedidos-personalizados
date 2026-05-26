<script setup lang="ts">
import AdminSidebar      from '../components/organisms/AdminSidebar.vue'
import AppTopBar         from '../components/organisms/AppTopBar.vue'
import DashboardFilters  from '../components/organisms/DashboardFilters.vue'
import InventoryTable    from '../components/organisms/InventoryTable.vue'
import RealtimeOrders    from '../components/organisms/RealTimeOrders.vue'

const inventory = [
  { id: 1, name: 'Sourdough Loaf',   desc: 'Traditional Hearth', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=60&q=80', stockLabel: '42 en stock', stockType: 'ok'  as const, price: 'S/50' },
  { id: 2, name: 'Butter Croissant', desc: 'Viennoserie',        img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=60&q=80', stockLabel: '8 en stock',  stockType: 'low' as const, price: 'S/50' },
  { id: 3, name: 'Sea Salt Cookies', desc: 'Daily Batch',        img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=60&q=80', stockLabel: 'Sin stock',   stockType: 'out' as const, price: 'S/50' },
]

const orders = [
  { id: '#ORD-8821', amount: 'S/34.50', time: '10 mins', items: '2x Almond Croissant, 1x Vanilla Latte, 1x Sourdough', status: 'PROCESO',    statusType: 'process'   as const },
  { id: '#ORD-8819', amount: 'S/12.00', time: '24 mins', items: '3x Chocolate Chunk Cookies',                           status: 'FINALIZADO', statusType: 'done'      as const },
  { id: '#ORD-8815', amount: 'S/46.10', time: '45 mins', items: 'Mix hora',                                             status: 'ENTREGADO',  statusType: 'delivered' as const },
]
</script>

<template>
  <div class="admin-dashboard">
    <AdminSidebar />

    <main class="admin-main">
      <AppTopBar placeholder="Buscar..." />

      <div class="admin-content">

        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Panel de control</h1>
          <p class="page-subtitle">Resumen en tiempo real de tu negocio</p>
        </div>

        <!-- Filters -->
        <DashboardFilters
          :periods="['Hoy','Esta semana','Este mes','Este año']"
          :categories="['Tortas','Cupcakes','Galletas','Bocaditos','Pastelería Salada','Cheesecakes']"
          :years="['2025','2024','2023']"
        />

        <!-- Stat cards -->
        <div class="stats-grid">

          <div class="stat-card stat-card--light">
            <div class="stat-header">
              <span class="stat-label">VENTAS DE HOY</span>
              <span class="material-symbols-outlined stat-icon">trending_up</span>
            </div>
            <div class="stat-value">S/ 240.50</div>
            <div class="stat-bars">
              <div class="bar" style="height:18px"></div>
              <div class="bar" style="height:28px"></div>
              <div class="bar" style="height:22px"></div>
              <div class="bar" style="height:38px"></div>
              <div class="bar" style="height:26px"></div>
              <div class="bar bar--active" style="height:46px"></div>
            </div>
            <div class="stat-footer stat-footer--up">↑2% vs yesterday</div>
          </div>

          <div class="stat-card stat-card--light">
            <div class="stat-header">
              <span class="stat-label">ESTE MES</span>
              <span class="material-symbols-outlined stat-icon">calendar_month</span>
            </div>
            <div class="stat-value">890</div>
            <svg class="mini-chart" viewBox="0 0 120 50" fill="none">
              <path d="M0 40 C20 38,30 10,50 15 C70 20,80 35,100 8 C110 2,115 5,120 5" stroke="#8b1a2e" stroke-width="2" fill="none"/>
            </svg>
            <div class="stat-footer">Average ticket: S/24.20</div>
          </div>

          <div class="stat-card stat-card--dark">
            <div class="stat-header">
              <span class="stat-label-light">PEDIDOS DE HOY</span>
              <span class="material-symbols-outlined stat-icon-light">receipt_long</span>
            </div>
            <div class="stat-value-dark">24 pedidos</div>
            <div class="progress-row">
              <span class="progress-label-light">Proceso</span>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width:82%"></div>
              </div>
              <span class="progress-label-light">82% Terminado</span>
            </div>
          </div>

        </div>

        <!-- Bottom grid -->
        <div class="bottom-grid">
          <InventoryTable :items="inventory" />
          <RealtimeOrders :orders="orders" />
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
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

/* Header */
.page-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; font-weight: 700; color: #3f0006; margin: 0; }
.page-subtitle { font-size: 0.8rem; color: #7c5730; margin: 0; }

/* Stats */
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

/* Bottom */
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