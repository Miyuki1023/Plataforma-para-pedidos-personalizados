<script setup lang="ts">
import { ref } from "vue";
import EmployeeSidebar from "../components/organisms/EmployeeSidebar.vue";
import ProductionGoalCard from "../components/molecules/ProductionGoalCard.vue";
import WorkloadChart from "../components/molecules/WorkloadChart.vue";
import AppTopBar from "../components/organisms/AppTopBar.vue";

const inventory = [
  {
    id: 1,
    name: "Sourdough Loaf",
    desc: "Traditional Hearth",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=60&q=80",
    stockLabel: "42 en stock",
    stockType: "ok",
    price: "S/50",
  },
  {
    id: 2,
    name: "Butter Croissant",
    desc: "Viennoserie",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=60&q=80",
    stockLabel: "8 en stock",
    stockType: "low",
    price: "S/50",
  },
  {
    id: 3,
    name: "Sea Salt Cookies",
    desc: "Daily Batch",
    img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=60&q=80",
    stockLabel: "Sin stock",
    stockType: "out",
    price: "S/50",
  },
];

const orders = [
  {
    id: "#ORD-8821",
    amount: "S/34.50",
    time: "2 mins",
    items: "2x Almond Croissant, 1x Vanilla Latte, 1x Sourdough",
    status: "PROCESO",
    statusType: "process",
  },
  {
    id: "#ORD-8819",
    amount: "S/12.00",
    time: "4 mins",
    items: "3x Chocolate Chunk Cookies",
    status: "FINALIZADO",
    statusType: "done",
  },
  {
    id: "#ORD-8815",
    amount: "S/46.10",
    time: "10 mins",
    items: "Mix hora",
    status: "ENTREGADO",
    statusType: "delivered",
  },
];

const toggles = ref<Record<number, boolean>>({ 1: true, 2: true, 3: false });
</script>

<template>
  <div class="emp-dashboard">
    <EmployeeSidebar />

    <main class="emp-main">
      <AppTopBar />
      <div class="emp-content">
        <!-- Page header -->
        <div class="page-header">
          <h1 class="page-title">Panel de control</h1>
          <p class="page-subtitle">Resumen en tiempo real de tu negocio</p>
        </div>

        <!-- Top cards -->
        <div class="top-cards">
          <ProductionGoalCard
            :current="158"
            :total="200"
            percent-label="79% Completado"
            :in-oven="24"
            :cooling="12"
            :packing="8"
          />
          <WorkloadChart />
        </div>

        <!-- Filters -->
        <div class="filters">
          <select class="filter-select">
            <option>Selecciona por periodo</option>
            <option>Hoy</option>
            <option>Esta semana</option>
            <option>Este mes</option>
          </select>
          <select class="filter-select">
            <option>Selecciona la categoría</option>
            <option>Panadería</option>
            <option>Repostería</option>
          </select>
          <select class="filter-select">
            <option>Selecciona los años</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>

        <!-- Bottom grid -->
        <div class="bottom-grid">
          <!-- Inventory -->
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="card-title">Inventario</h2>
                <p class="card-subtitle">Productos que requieren atención</p>
              </div>
              <a href="#" class="link-action">Ver todos</a>
            </div>

            <table class="inv-table">
              <thead>
                <tr>
                  <th>PRODUCTOS</th>
                  <th>STOCK</th>
                  <th>PRECIO</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inventory" :key="item.id">
                  <td>
                    <div class="prod-cell">
                      <img :src="item.img" :alt="item.name" class="prod-img" />
                      <div>
                        <div class="prod-name">{{ item.name }}</div>
                        <div class="prod-desc">{{ item.desc }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      class="stock-badge"
                      :class="`stock--${item.stockType}`"
                    >
                      {{ item.stockLabel }}
                    </span>
                  </td>
                  <td class="price-cell">{{ item.price }}</td>
                  <td>
                    <button
                      class="toggle"
                      :class="{ 'toggle--on': toggles[item.id] }"
                      @click="toggles[item.id] = !toggles[item.id]"
                    >
                      <span class="toggle-thumb" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Orders -->
          <div class="card orders-card">
            <h2 class="card-title">Pedidos en tiempo real</h2>

            <div class="order-list">
              <div v-for="order in orders" :key="order.id" class="order-item">
                <div class="order-top">
                  <span class="order-id">{{ order.id }}</span>
                  <span class="order-amount">{{ order.amount }}</span>
                </div>
                <div class="order-time">{{ order.time }} ago</div>
                <div class="order-items">{{ order.items }}</div>
                <div class="order-footer">
                  <span
                    class="order-badge"
                    :class="`badge--${order.statusType}`"
                  >
                    {{ order.status }}
                  </span>
                  <svg
                    v-if="order.statusType === 'delivered'"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9e8080"
                    stroke-width="2"
                    stroke-linecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            <button class="btn-download">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Report (.CSV)
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Lato:wght@300;400;600;700&family=Noto+Serif:wght@400;700&display=swap");

.emp-dashboard {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: "Lato", sans-serif;
}

/* Main */
.emp-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  overflow: auto;
}
.emp-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 1.75rem;
}

/* Topbar */
.emp-topbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #e8d5d5;
  border-radius: 50px;
  padding: 0.4rem 1rem;
}
.search-box input {
  border: none;
  outline: none;
  font-family: "Lato", sans-serif;
  font-size: 0.82rem;
  color: #2a1a1a;
  background: transparent;
  width: 160px;
}
.search-box input::placeholder {
  color: #bfa8a8;
}
.icon-btn {
  width: 34px;
  height: 34px;
  background: #fff;
  border: 1px solid #e8d5d5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9e8080;
  transition: border-color 0.2s;
}
.icon-btn:hover {
  border-color: #8b1a2e;
  color: #8b1a2e;
}

/* Page header */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  justify-content: center;
  text-align: start;
}
.page-title {
  font-family: "Noto Serif", sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #3f0006;
  margin: 0;
}
.page-subtitle {
  font-size: 0.8rem;
  color: #7c5730;
  margin: 0;
}

/* Top cards */
.top-cards {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
}

/* Filters */
.filters {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.filter-select {
  padding: 0.6rem 2rem 0.6rem 0.85rem;
  border: 1px solid #e89a3c;
  border-radius: 12px;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%239e8080' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")
    no-repeat right 0.6rem center;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
  color: #2a1a1a;
  cursor: pointer;
  outline: none;
  appearance: none;
}

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1rem;
  align-items: start;
}

/* Card */
.card {
  background: #fef9ef;
  border: 1px solid #e8d5d5;
  border-radius: 14px;
  padding: 1.25rem;
}
.card-header {
  display: flex;
  align-items: flex-start;
  text-align: start;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.card-title {
    font-family: Noto Serif, serif;
  font-size: 24px;
  font-weight: 700;
  color: #3F0006;
  margin: 0;
}
.card-subtitle {
    font-family: Plus Jakarta Sans, sans-serif;
  font-size: 0.75rem;
  color: #9e8080;
  margin: 0.15rem 0 0;
}
.link-action {
  font-size: 0.78rem;
  color: #8b1a2e;
  font-weight: 700;
  text-decoration: none;
}

/* Inventory table */
.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  table-layout: fixed;
}
.inv-table th,
.inv-table td {
  text-align: left;
  padding: 0.75rem 0.5rem;
}
.inv-table th {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #574140;
  border-bottom: 1px solid #e8d5d5;
}
.inv-table td {
  border-bottom: 1px solid #fdf6f0;
  vertical-align: middle;
}
.inv-table tr:last-child td {
  border-bottom: none;
}
.inv-table th:nth-child(1),
.inv-table td:nth-child(1) {
  width: 45%;
}
.inv-table th:nth-child(2),
.inv-table td:nth-child(2) {
  width: 18%;
}
.inv-table th:nth-child(3),
.inv-table td:nth-child(3) {
  width: 18%;
}
.inv-table th:nth-child(4),
.inv-table td:nth-child(4) {
  width: 19%;
}
.prod-cell {
  display: flex;
  align-items: center;
  text-align: start;
  gap: 0.6rem;
}
.prod-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.prod-name {
  font-weight: 700;
  color: #2a1a1a;
  font-size: 0.82rem;
}
.prod-desc {
  font-size: 0.7rem;
  color: #9e8080;
}
.stock-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
}
.stock--ok {
  background: #e6f4ee;
  color: #2e7d52;
}
.stock--low {
  background: #fff4e0;
  color: #b45309;
}
.stock--out {
  background: #fde8e8;
  color: #9b1c1c;
}
.price-cell {
  font-weight: 700;
  color: #2a1a1a;
}
.toggle {
  width: 34px;
  height: 19px;
  background: #ddd;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  transition: background 0.25s;
  padding: 0;
}
.toggle--on {
  background: #8b1a2e;
}
.toggle-thumb {
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s;
  display: block;
}
.toggle--on .toggle-thumb {
  transform: translateX(15px);
}

/* Orders */
.orders-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0.75rem 0;
  text-align: start;
}
.order-item {
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  border-left: 3px solid #e8d5d5;
}
.order-item:first-child {
  border-left-color: #c28c18;
}
.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-id {
  font-weight: 800;
  font-size: 0.82rem;
  color: #3F0006;
}
.order-amount {
  font-weight: 700;
  font-size: 0.82rem;
  color: #2a1a1a;
}
.order-time {
  font-size: 0.68rem;
  color: #bfa8a8;
}
.order-items {
  font-size: 0.72rem;
  color: #9e8080;
  line-height: 1.4;
}
.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
}
.order-badge {
  display: inline-block;
  padding: 0.18rem 0.55rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}
.badge--process {
  background: #fff4e0;
  color: #b45309;
}
.badge--done {
  background: #e6f4ee;
  color: #2e7d52;
}
.badge--delivered {
  background: #f0e0e0;
  color: #9e8080;
}
.btn-download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.55rem;
  background: transparent;
  border: 1px solid #e8d5d5;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  font-size: 0.75rem;
  color: #9e8080;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-download:hover {
  border-color: #8b1a2e;
  color: #8b1a2e;
}

@media (max-width: 900px) {
  .top-cards {
    grid-template-columns: 1fr;
  }
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
