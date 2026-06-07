<script setup lang="ts">
import EmployeeSidebar from '../components/organisms/EmployeeSidebar.vue'
import AppTopBar from '../components/organisms/AppTopBar.vue'
import WorkloadChart from '../components/molecules/WorkloadChart.vue'
import InventoryAttention from '../components/molecules/InventoryAttention.vue'
import RealTimeOrders from '../components/molecules/RealTimeOrders.vue'
</script>

<template>
  <div class="dashboard-page">
    <!-- Barra lateral de navegación -->
    <EmployeeSidebar />

    <div class="dashboard-content">
      <!-- Barra superior con usuario/notificaciones -->
      <AppTopBar />

      <main class="dashboard-main">
        <div class="dashboard-grid">
          
          <!-- 1. Carga de Trabajo (Ocupa todo el ancho superior) -->
          <section class="grid-item workload-section">
            <WorkloadChart />
          </section>

          <!-- 2. Inventario (Versión reducida/atención) -->
          <section class="grid-item inventory-section">
            <InventoryAttention />
          </section>

          <!-- 3. Pedidos en tiempo real (Últimos 3 + Exportar) -->
          <section class="grid-item orders-section">
            <RealTimeOrders />
          </section>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.dashboard-main {
  padding: 1.5rem 2.75rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.workload-section {
  grid-column: span 2;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .workload-section {
    grid-column: span 1;
  }
}
</style>