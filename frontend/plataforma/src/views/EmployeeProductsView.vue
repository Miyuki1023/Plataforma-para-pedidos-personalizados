<script setup lang="ts">
import { ref, computed } from 'vue'
import EmployeeSidebar from '../components/organisms/EmployeeSidebar.vue'
import AppTopBar       from '../components/organisms/AppTopBar.vue'

/* ── Data ── */
const products = ref([
  { id: 1, name: 'Tarta de Ganache Intenso',      sku: 'SKU:CROC-001', category: 'Tortas',           stock: 42, stockType: 'ok',  price: 'S/50', active: true,  img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&q=80' },
  { id: 2, name: 'Croissant de Mantequilla',       sku: 'SKU:BAK-042',  category: 'Pastelería Salada', stock: 8,  stockType: 'low', price: 'S/50', active: true,  img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&q=80' },
  { id: 3, name: 'Tartaleta de Frutas de Estación',sku: 'SKU:FRUT-109', category: 'Cheesecakes',       stock: 5,  stockType: 'low', price: 'S/50', active: true,  img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=80&q=80' },
  { id: 4, name: 'Red Velvet Editorial',           sku: 'SKU:REDV-88',  category: 'Tortas',            stock: 0,  stockType: 'out', price: 'S/50', active: false, img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=80&q=80' },
])

const selected = ref<number[]>([])
const currentPage = ref(1)
const totalItems = 128

/* ── Selection ── */
const allSelected = computed(() =>
  products.value.length > 0 && selected.value.length === products.value.length
)
function toggleAll() {
  selected.value = allSelected.value ? [] : products.value.map(p => p.id)
}
function toggleRow(id: number) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter(s => s !== id)
    : [...selected.value, id]
}

/* ── Stats ── */
const totalStock  = computed(() => products.value.reduce((s, p) => s + p.stock, 0))
const soldPercent = 84
</script>

<template>
  <div class="products-page">
    <EmployeeSidebar />

    <div class="products-content">
      <AppTopBar />

      <main class="products-main">

        <!-- Hero banner -->
        <div class="hero-banner">
          <div class="hero-text">
            <h1 class="hero-title">Editor de Productos</h1>
            <p class="hero-subtitle">
              Gestiona la vitrina digital de tu pastelería. Cada creación es
              un testimonio de artesanía y sabor.
            </p>
          </div>
          <!-- Decorative pretzel watermark -->
          <div class="hero-watermark" aria-hidden="true">🥐</div>

          <!-- Inspiración del día -->
          <div class="inspiration-card">
            <button class="insp-edit-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <p class="insp-label">Inspiración del día</p>
            <p class="insp-quote">
              "La repostería es un arte donde la precisión se encuentra con la pasión."
            </p>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn-primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva producto
            </button>
            <button class="btn-secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>
          <button
            class="btn-danger"
            :disabled="selected.length === 0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Eliminar
          </button>
        </div>

        <!-- Table -->
        <div class="table-card">
          <table class="prod-table">
            <thead>
              <tr>
                <th class="th-check">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" class="checkbox" />
                </th>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>STOCK</th>
                <th>PRECIO</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in products"
                :key="p.id"
                class="prod-row"
                :class="{ 'prod-row--selected': selected.includes(p.id) }"
              >
                <td class="td-check">
                  <input
                    type="checkbox"
                    :checked="selected.includes(p.id)"
                    @change="toggleRow(p.id)"
                    class="checkbox"
                  />
                </td>
                <td>
                  <div class="prod-cell">
                    <img :src="p.img" :alt="p.name" class="prod-img" />
                    <div>
                      <p class="prod-name">{{ p.name }}</p>
                      <p class="prod-sku">{{ p.sku }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="category-pill">{{ p.category }}</span>
                </td>
                <td>
                  <span class="stock-badge" :class="`stock--${p.stockType}`">
                    {{ p.stock > 0 ? `${p.stock} en stock` : 'Sin stock' }}
                  </span>
                </td>
                <td class="price-cell">{{ p.price }}</td>
                <td>
                  <button
                    class="toggle"
                    :class="{ 'toggle--on': p.active }"
                    @click="p.active = !p.active"
                  >
                    <span class="toggle-thumb" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="table-footer">
            <span class="table-count">
              Mostrando {{ products.length }} de {{ totalItems }} creaciones
            </span>
            <div class="pagination">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button
                v-for="n in 3" :key="n"
                class="page-btn"
                :class="{ 'page-btn--active': currentPage === n }"
                @click="currentPage = n"
              >{{ n }}</button>
              <span class="page-ellipsis">›</span>
              <button class="page-btn" @click="currentPage++">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom widgets -->
        <div class="bottom-widgets">

          <!-- Total stock -->
          <div class="widget-card">
            <div class="widget-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b1a2e" stroke-width="1.8" stroke-linecap="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <span class="widget-value">{{ totalStock }}</span>
            <span class="widget-label">TOTAL STOCK</span>
          </div>

          <!-- Vendidos -->
          <div class="widget-card">
            <div class="widget-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b1a2e" stroke-width="1.8" stroke-linecap="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <span class="widget-value">{{ soldPercent }}%</span>
            <span class="widget-label">VENDIDOS</span>
          </div>

          <!-- CTA catálogo -->
          <div class="widget-card widget-card--cta">
            <div class="cta-text">
              <p class="cta-title">¿Necesitas un nuevo catálogo?</p>
              <p class="cta-subtitle">Exporta tus productos en formato PDF editorial para tus clientes.</p>
            </div>
            <button class="cta-btn">
              Generar<br/>Catálogo
            </button>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Lato:wght@400;600;700;800&display=swap');

.products-page {
  display: flex; min-height: 100vh;
  background: #fdf6f0; font-family: 'Lato', sans-serif;
}
.products-content { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.products-main { flex: 1; padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }

/* ── Hero banner ── */
.hero-banner {
  background: #f5ece4;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}
.hero-text { flex: 1; }
.hero-title {
  font-family: 'Lato', sans-serif;
  font-size: 1.5rem; font-weight: 800;
  color: #2a1a1a; margin: 0 0 0.5rem;
}
.hero-subtitle {
  font-size: 0.82rem; color: #6b5050;
  line-height: 1.6; margin: 0; max-width: 280px;
}
.hero-watermark {
  font-size: 7rem; opacity: 0.12;
  position: absolute; right: 200px; top: -10px;
  pointer-events: none; transform: rotate(-15deg);
}

/* Inspiración */
.inspiration-card {
  background: #8b1a2e;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  max-width: 200px;
  flex-shrink: 0;
  position: relative;
}
.insp-edit-btn {
  position: absolute; top: 0.6rem; right: 0.6rem;
  background: rgba(255,255,255,0.15);
  border: none; border-radius: 6px;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.8);
  transition: background 0.2s;
}
.insp-edit-btn:hover { background: rgba(255,255,255,0.25); }
.insp-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.08em; color: rgba(255,255,255,0.65);
  margin: 0 0 0.5rem; text-transform: uppercase;
}
.insp-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; font-weight: 600;
  color: #fff; line-height: 1.5; margin: 0;
  font-style: italic;
}

/* ── Toolbar ── */
.toolbar {
  display: flex; align-items: center;
  justify-content: space-between; gap: 0.75rem;
}
.toolbar-left { display: flex; gap: 0.65rem; }

.btn-primary {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  background: #2a1a1a; color: #fff;
  border: none; border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: background 0.2s;
}
.btn-primary:hover { background: #8b1a2e; }

.btn-secondary {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  background: #fff; color: #2a1a1a;
  border: 1px solid #e8d5d5; border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: border-color 0.2s;
}
.btn-secondary:hover { border-color: #8b1a2e; color: #8b1a2e; }

.btn-danger {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  background: #fff; color: #9b1c1c;
  border: 1px solid #f0c0c0; border-radius: 8px;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-danger:hover:not(:disabled) { background: #fde8e8; border-color: #9b1c1c; }
.btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Table ── */
.table-card {
  background: #fff;
  border: 1px solid #e8d5d5;
  border-radius: 14px;
  overflow: hidden;
}
.prod-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.prod-table th {
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.08em; color: #9e8080;
  text-align: left; padding: 0.85rem 1rem;
  border-bottom: 1px solid #f0e0e0;
  background: #fdf6f0;
}
.th-check { width: 40px; }
.prod-table td { padding: 0.85rem 1rem; border-bottom: 1px solid #fdf6f0; vertical-align: middle; }
.prod-table tr:last-child td { border-bottom: none; }
.prod-row { transition: background 0.15s; }
.prod-row:hover { background: #fdf0e8; }
.prod-row--selected { background: #fdf0e8; }

.checkbox {
  width: 15px; height: 15px;
  accent-color: #8b1a2e; cursor: pointer;
}

.prod-cell { display: flex; align-items: center; gap: 0.75rem; }
.prod-img { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.prod-name { font-weight: 700; color: #2a1a1a; margin: 0; font-size: 0.85rem; }
.prod-sku  { font-size: 0.68rem; color: #bfa8a8; margin: 0.1rem 0 0; }

.category-pill {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  background: #f5ece4; color: #8b1a2e;
  border-radius: 20px;
  font-size: 0.72rem; font-weight: 700;
}

.stock-badge {
  display: inline-block;
  padding: 0.22rem 0.65rem;
  border-radius: 20px;
  font-size: 0.72rem; font-weight: 700;
  white-space: nowrap;
}
.stock--ok  { background: #e6f4ee; color: #2e7d52; }
.stock--low { background: #fff4e0; color: #b45309; }
.stock--out { background: #fde8e8; color: #9b1c1c; }

.price-cell { font-weight: 700; color: #2a1a1a; }

.toggle {
  width: 34px; height: 19px;
  background: #ddd; border: none;
  border-radius: 20px; cursor: pointer;
  position: relative; transition: background 0.25s; padding: 0;
}
.toggle--on { background: #8b1a2e; }
.toggle-thumb {
  position: absolute; top: 2.5px; left: 2.5px;
  width: 14px; height: 14px;
  background: #fff; border-radius: 50%;
  transition: transform 0.25s; display: block;
}
.toggle--on .toggle-thumb { transform: translateX(15px); }

/* ── Pagination ── */
.table-footer {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-top: 1px solid #f0e0e0;
}
.table-count { font-size: 0.78rem; color: #9e8080; }
.pagination { display: flex; align-items: center; gap: 0.3rem; }
.page-btn {
  width: 28px; height: 28px;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  color: #6b5050; cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { border-color: #8b1a2e; color: #8b1a2e; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn--active { background: #8b1a2e; border-color: #8b1a2e; color: #fff; }
.page-ellipsis { font-size: 0.85rem; color: #9e8080; padding: 0 0.2rem; }

/* ── Bottom widgets ── */
.bottom-widgets {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
}
.widget-card {
  background: #fff;
  border: 1px solid #e8d5d5;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.35rem; text-align: center;
}
.widget-icon {
  width: 40px; height: 40px;
  background: #f5ece4; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.25rem;
}
.widget-value { font-size: 1.75rem; font-weight: 800; color: #2a1a1a; }
.widget-label {
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.1em; color: #9e8080;
}

.widget-card--cta {
  background: #8b1a2e;
  flex-direction: row; text-align: left;
  gap: 1.25rem; align-items: center;
}
.cta-text { flex: 1; }
.cta-title {
  font-size: 0.9rem; font-weight: 800;
  color: #fff; margin: 0 0 0.3rem;
  line-height: 1.3;
}
.cta-subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.7); margin: 0; line-height: 1.4; }
.cta-btn {
  background: #fff; color: #8b1a2e;
  border: none; border-radius: 10px;
  padding: 0.65rem 1rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 800;
  cursor: pointer; white-space: nowrap;
  text-align: center; line-height: 1.4;
  transition: opacity 0.2s; flex-shrink: 0;
}
.cta-btn:hover { opacity: 0.9; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .bottom-widgets { grid-template-columns: 1fr 1fr; }
  .widget-card--cta { grid-column: span 2; }
  .hero-watermark { display: none; }
  .inspiration-card { display: none; }
}
@media (max-width: 600px) {
  .products-main { padding: 1rem; }
  .bottom-widgets { grid-template-columns: 1fr; }
  .widget-card--cta { grid-column: span 1; flex-direction: column; text-align: center; }
}
</style>