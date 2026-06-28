<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmployeeSidebar    from '../components/organisms/EmployeeSidebar.vue'
import InventoryAttention   from '../components/molecules/InventoryAttention.vue'
import RealTimeOrders       from '../components/molecules/RealTimeOrders.vue'
import WorkloadChart        from '../components/molecules/WorkloadChart.vue'

const router = useRouter()

function handleNewSale() {
  router.push('/')
}
</script>

<template>
  <div class="emp-dashboard">
    <EmployeeSidebar />

    <main class="emp-main">
      <div class="emp-content">
        <header class="page-header">
          <div class="header-titles">
            <h1 class="page-title">Panel de control</h1>
            <p class="page-subtitle">Resumen en tiempo real de tu negocio</p>
          </div>
          <button class="btn-new-sale" @click="handleNewSale">
            <span class="material-symbols-rounded">shopping_cart</span>
            Nueva venta
          </button>
        </header>

        <section class="main-chart">
          <WorkloadChart />
        </section>

        <section class="bottom-grid">
          <InventoryAttention />
          <RealTimeOrders />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Lato:wght@300;400;600;700&display=swap');

.emp-dashboard { display: flex; min-height: 100vh; background: #fff; font-family: 'Lato', sans-serif; }
.emp-main { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.emp-content { display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem 2.75rem; text-align: start; }

.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem; }

.page-title { 
  font-family: "Noto Serif", serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #3f0006;
  margin: 0;
}
.page-subtitle { 
  font-size: 0.85rem;
  color: #7c5730;
  margin: 0.25rem 0 0; 
}

.btn-new-sale {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: #8b1a2e;
  color: #fff; border: none; border-radius: 12px;
  font-family: 'Lato', sans-serif; font-size: 0.85rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s;
}
.btn-new-sale:hover { background: #721525; }

/* Sección principal de gráfico */
.main-chart { width: 100%; }

/* Grid inferior equilibrado */
.bottom-grid { 
  display: grid; 
  grid-template-columns: 1fr 320px; 
  gap: 1.5rem; 
  align-items: start; 
}

@media (max-width: 1024px) {
  .bottom-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .emp-content { padding: 1.5rem; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>