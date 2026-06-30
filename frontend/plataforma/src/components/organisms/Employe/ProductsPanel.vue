<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductCreateModal from "./ProductCreateModal.vue";
import ProductEditModal from "./ProductEditModal.vue";
import { apiService } from '../../../lib/api'

interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  descripcion?: string;
  imagen_url?: string[];
  vendidos?: number;
  disponible?: boolean;
}

const products = ref<Product[]>([]);
const selected = ref<number[]>([]);
const currentPage = ref(1);
const loading = ref(false);
const error = ref("");

// Modal states
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedProductForEdit = ref<Product | null>(null);

const dailyQuote = ref("La repostería es un arte donde la precisión se encuentra con la pasión.");
const isQuoteModalOpen = ref(false);
const editedQuote = ref("");

const ITEMS_PER_PAGE = 8;

const totalItems = computed(() => products.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));

const allSelected = computed(
  () =>
    products.value.length > 0 &&
    selected.value.length === products.value.length
);

function toggleAll() {
  selected.value = allSelected.value ? [] : products.value.map((p) => p.id);
}

function toggleRow(id: number) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((s) => s !== id)
    : [...selected.value, id];
}

const totalStock = computed(() =>
  products.value.reduce((s, p) => s + p.stock, 0)
);

const totalSold = computed(() =>
  products.value.reduce((s, p) => s + (p.vendidos || 0), 0)
);

const soldPercent = computed(() => {
  const sold = totalSold.value;
  const stock = totalStock.value;
  const total = sold + stock;
  
  if (total === 0) return 0;
  return Math.round((sold / total) * 100);
});

// Fetch products from backend
async function fetchProducts() {
  loading.value = true;
  error.value = "";
  try {
    const response = await apiService.get("/productos");
    // Normalizamos la respuesta: el backend puede devolver un array o un objeto { products: [] }
    products.value = Array.isArray(response) ? response : (response.products || response.data || []);
  } catch (err) {
    console.error(err);
    error.value = "Error al cargar productos";
  } finally {
    loading.value = false;
  }
}

// Handle create product
function handleOpenCreateModal() {
  isCreateModalOpen.value = true;
}

function handleProductCreated(product: Product) {
  products.value.push(product);
  selected.value = [];
}

// Handle edit product
function handleEditProduct() {
  if (selected.value.length !== 1) {
    error.value = "Selecciona un producto para editar";
    return;
  }
  const productId = selected.value[0];
  selectedProductForEdit.value = products.value.find((p) => p.id === productId) || null;
  if (selectedProductForEdit.value) {
    isEditModalOpen.value = true;
  }
}

function handleProductUpdated(updatedProduct: Product) {
  const index = products.value.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products.value[index] = updatedProduct;
  }
  selected.value = [];
}

// Handle delete products
async function handleDeleteProducts() {
  if (selected.value.length === 0) return;
  
  if (!confirm(`¿Estás seguro de que deseas eliminar ${selected.value.length} producto(s)?`)) {
    return;
  }

  loading.value = true;
  error.value = "";
  try {
    for (const productId of selected.value) {
      await apiService.delete(`/productos/${productId}`);
    }
    products.value = products.value.filter((p) => !selected.value.includes(p.id));
    selected.value = [];
  } catch (err: any) {
    error.value = err.response?.data?.message || "Error al eliminar productos";
  } finally {
    loading.value = false;
  }
}

// Handle toggle product availability
async function handleToggleProduct(product: Product) {
  try {
    const response = await apiService.put(`/productos/${product.id}`, {
      disponible: product.disponible === false ? true : false
    });
    
    const updated = response.product || response;
    
    const index = products.value.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updated };
    }
  } catch (err: any) {
    error.value = err.message || "Error al actualizar producto";
  }
}

function openQuoteModal() {
  editedQuote.value = dailyQuote.value;
  isQuoteModalOpen.value = true;
}

function generateCatalog() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para generar el catálogo.');
    return;
  }

  const itemsHtml = products.value.map(p => `
    <div style="border-bottom: 1px solid #f5ece4; padding: 20px 0; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid;">
      <div style="max-width: 75%;">
        <h3 style="margin: 0; color: #3F0006; font-family: 'Noto Serif', serif; font-size: 20px;">${p.nombre}</h3>
        <p style="margin: 4px 0; font-size: 12px; color: #8b1a2e; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${p.categoria}</p>
        <p style="margin: 6px 0 0; font-size: 14px; color: #6b5050; line-height: 1.5;">${p.descripcion || 'Una deliciosa creación artesanal de nuestra casa.'}</p>
      </div>
      <div style="font-size: 22px; font-weight: 700; color: #3F0006; font-family: 'Lato', sans-serif;">S/ ${Number(p.precio || 0).toFixed(2)}</div>
    </div>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Catálogo Vainilla y Miel</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Lato', sans-serif; padding: 60px; color: #2a1a1a; background: #fff; }
          .header { text-align: center; margin-bottom: 60px; border-bottom: 4px double #8b1a2e; padding-bottom: 40px; }
          h1 { font-family: 'Noto Serif', serif; font-size: 48px; color: #3F0006; margin: 0; }
          .subtitle { font-size: 18px; color: #7c5730; margin-top: 12px; font-style: italic; }
          .footer { text-align: center; font-size: 11px; color: #9e8080; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Vainilla y Miel</h1>
          <div class="subtitle">Catálogo Exclusivo de Repostería Artesanal</div>
        </div>
        ${itemsHtml}
        <div class="footer">Vainilla y Miel - Pedidos Personalizados</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}

function saveQuote() {
  dailyQuote.value = editedQuote.value;
  localStorage.setItem('dailyInspiration', dailyQuote.value);
  isQuoteModalOpen.value = false;
}

// Computed for display
const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  return products.value
    .slice(start, end)
    .map((p) => {
      // Mapeo flexible de la imagen (soporta array, string o nombres alternos)
      const imgSource = p.imagen_url || (p as any).image;
      const finalImage = Array.isArray(imgSource) ? imgSource[0] : imgSource;

      return {
        ...p,
        sku: `SKU:${p.id}`,
        stockType: p.stock > 10 ? "ok" : p.stock > 0 ? "low" : "out",
        price: `S/${Number(p.precio || 0).toFixed(2)}`,
        img: finalImage || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&q=80",
        active: p.disponible !== false
      };
    });
});

onMounted(() => {
  fetchProducts();
  const savedQuote = localStorage.getItem('dailyInspiration');
  if (savedQuote) dailyQuote.value = savedQuote;
});
</script>

<template>
  <main class="products-main">
    <!-- ── Hero: 2 cards separadas ── -->
    <div class="hero-row">
      <!-- Card izquierda: título + watermark -->
      <div class="hero-card hero-card--main">
        <div class="hero-text">
          <h1 class="hero-title">Editor de Productos</h1>
          <p class="hero-subtitle">
            Gestiona la vitrina digital de tu pastelería. Cada creación es un
            testimonio de artesanía y sabor.
          </p>
        </div>
        <!-- Watermark decorativo -->
        <div class="hero-watermark" aria-hidden="true"></div>
      </div>

      <!-- Card derecha: inspiración del día -->
      <div class="hero-card hero-card--inspiration">
        <button class="insp-edit-btn" title="Editar inspiración" @click="openQuoteModal">
          <span class="material-symbols-rounded" style="font-size: 14px">edit</span>
        </button>
        <p class="insp-label">Inspiración del día</p>
        <p class="insp-quote">
          "{{ dailyQuote }}"
        </p>
      </div>
    </div>

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn-primary" @click="handleOpenCreateModal">
          <span class="material-symbols-rounded">add</span>
          Nueva producto
        </button>
        
        <button 
          class="btn-secondary"
          :disabled="selected.length !== 1"
          @click="handleEditProduct"
        >
          <span class="material-symbols-rounded">edit</span>
          Editar
        </button>
      </div>
      <button 
        class="btn-danger" 
        :disabled="selected.length === 0"
        @click="handleDeleteProducts"
      >
        <span class="material-symbols-rounded">delete</span>
        Eliminar
      </button>
    </div>

    <!-- ── Table ── -->
    <div class="table-card">
      <table class="prod-table">
        <thead>
          <tr>
            <th class="th-check">
              <label class="check-wrap">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleAll"
                  class="checkbox-input"
                />
                <span class="checkbox-custom" aria-hidden="true"></span>
              </label>
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
            v-for="p in displayProducts"
            :key="p.id"
            class="prod-row"
            :class="{ 'prod-row--selected': selected.includes(p.id) }"
          >
            <td>
              <label class="check-wrap">
                <input
                  type="checkbox"
                  :checked="selected.includes(p.id)"
                  @change="toggleRow(p.id)"
                  class="checkbox-input"
                />
                <span class="checkbox-custom" aria-hidden="true"></span>
              </label>
            </td>
            <td>
              <div class="prod-cell">
                <img :src="p.img" :alt="p.nombre" class="prod-img" />
                <div>
                  <p class="prod-name">{{ p.nombre }}</p>
                  <p class="prod-sku">{{ p.sku }}</p>
                </div>
              </div>
            </td>
            <td>
              <span class="category-pill">{{ p.categoria }}</span>
            </td>
            <td>
              <span class="stock-badge" :class="`stock--${p.stockType}`">
                {{ p.stock > 0 ? `${p.stock} en stock` : "Sin stock" }}
              </span>
            </td>
            <td class="price-cell">{{ p.price }}</td>
            <td>
              <button
                class="toggle"
                :class="{ 'toggle--on': p.active }"
                @click="handleToggleProduct(p)"
              >
                <span class="toggle-thumb" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="table-footer">
        <span class="table-count"
          >Mostrando {{ displayProducts.length }} de {{ totalItems }} creaciones</span
        >
        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <span class="material-symbols-rounded" style="font-size: 14px"
              >chevron_left</span
            >
          </button>
          
          <button
            v-for="n in totalPages"
            :key="n"
            v-show="n >= currentPage - 1 && n <= currentPage + 1"
            class="page-btn"
            :class="{ 'page-btn--active': currentPage === n }"
            @click="currentPage = n"
          >
            {{ n }}
          </button>

          <span v-if="totalPages > currentPage + 1" class="page-ellipsis">...</span>

          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="currentPage++">
            <span class="material-symbols-rounded" style="font-size: 14px"
              >chevron_right</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- ── Bottom widgets ── -->
    <div class="bottom-widgets">
      <div class="widget-card">
        <span class="material-symbols-rounded widget-icon-ms">inventory_2</span>
        <span class="widget-value">{{ totalStock }}</span>
        <span class="widget-label">TOTAL STOCK</span>
      </div>

      <div class="widget-card">
        <span class="material-symbols-rounded widget-icon-ms">trending_up</span>
        <span class="widget-value">{{ soldPercent }}%</span>
        <span class="widget-label">VENDIDOS</span>
      </div>

      <div class="widget-card widget-card--cta">
        <div class="cta-text">
          <p class="cta-title">¿Necesitas un nuevo catálogo?</p>
          <p class="cta-subtitle">
            Exporta tus productos en formato PDF editorial para tus clientes.
          </p>
        </div>
        <button class="cta-btn" @click="generateCatalog">Generar<br />Catálogo</button>
      </div>
    </div>
  </main>

  <!-- Modales -->
  <ProductCreateModal 
    :is-open="isCreateModalOpen"
    @close="isCreateModalOpen = false"
    @created="handleProductCreated"
  />
  <ProductEditModal 
    :is-open="isEditModalOpen"
    :product="selectedProductForEdit"
    @close="isEditModalOpen = false"
    @updated="handleProductUpdated"
  />

  <!-- Modal para frase del día -->
  <div v-if="isQuoteModalOpen" class="quote-modal-overlay" @click.self="isQuoteModalOpen = false">
    <div class="quote-modal-content">
      <h3 class="quote-modal-title">Editar Inspiración</h3>
      <textarea v-model="editedQuote" class="quote-textarea" rows="4" placeholder="Escribe la frase aquí..."></textarea>
      <div class="quote-modal-actions">
        <button class="btn-secondary" @click="isQuoteModalOpen = false">Cancelar</button>
        <button class="btn-primary" @click="saveQuote">Guardar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Cormorant+Garamond:wght@600&family=Lato:wght@400;600;700;800&display=swap");

.material-symbols-rounded {
  font-family: "Material Symbols Rounded";
  font-weight: normal;
  font-style: normal;
  font-size: 18px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
  vertical-align: middle;
}

.products-main {
  flex: 1;
  padding: 1.5rem 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: auto;
}

/* ── Hero row ── */
.hero-row {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
  align-items: stretch;
}

/* Card base */
.hero-card {
  border-radius: 24px;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  text-align: start;
}

/* Card izquierda */
.hero-card--main {
  background: #f5ece4;
  display: flex;
  align-items: flex-end;
  min-height: 140px;
}
.hero-text {
  position: relative;
  z-index: 1;
  max-width: 400px;
}
.hero-title {
  font-family: "Noto Serif", sans-serif;
  font-size: 36px;
  font-weight: 400;
  color: #3F0006;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 0.8rem;
  font-family: Jakarta Sans, sans-serif;
  color: #6b5050;
  line-height: 1.6;
  margin: 0;
}
.hero-watermark {
  position: absolute;
  right: -100px;
  top: 15px;
  font-size: 12rem;
  opacity: 0.13;
  transform: rotate(-275deg);
  pointer-events: none;
  line-height: 1;
}

/* Card inspiración */
.hero-card--inspiration {
  background: #8b1a2e;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
}
.insp-edit-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
  transition: background 0.2s;
}
.insp-edit-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}
.insp-label {
  font-family: "Lato", sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}
.insp-quote {
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  font-weight: 600;
  font-style: italic;
  color: #fff;
  line-height: 1.55;
  margin: 0;
}

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 0 0rem;
}
.toolbar-left {
  display: flex;
  gap: 0.65rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.52rem 1.1rem;
  background: #99262F;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: "Lato", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #7a1729;
}
.btn-primary .material-symbols-rounded {
  font-size: 16px;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.52rem 1.1rem;
  background: #fff;
  color: #2a1a1a;
  border: 1px solid #e8d5d5;
  border-radius: 14px;
  font-family: "Lato", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.btn-secondary:hover {
  border-color: #8b1a2e;
  color: #8b1a2e;
}
.btn-secondary .material-symbols-rounded {
  font-size: 16px;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.52rem 1.1rem;
  background: #fff;
  color: #9b1c1c;
  border: 1px solid #f0c0c0;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-danger:hover:not(:disabled) {
  background: #fde8e8;
  border-color: #9b1c1c;
}
.btn-danger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-danger .material-symbols-rounded {
  font-size: 16px;
}

/* ── Table ── */
.table-card {
  background: #F8F3E9;
  border-radius: 14px;
  overflow: hidden;
}
.prod-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.prod-table th {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #7C573099;
  text-align: center;
  padding: 0.85rem 1rem;
  background: #ffffff;
}
.th-check {
  width: 56px;
}
.prod-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #fdf6f0;
  vertical-align: middle;
  text-align: center;
}
.prod-table tr:last-child td {
  border-bottom: none;
}
.prod-row {
  transition: background 0.15s;
}
.prod-row:hover {
  background: #f0e4dd;
}
.prod-row--selected {
  background: #f0e4dd;
}
.check-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e6e0de;
  border-radius: 4px;
  background: #fff;
  transition: background 0.14s, border-color 0.14s, transform 0.12s;
  display: inline-block;
  position: relative;
}
.checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transform: rotate(45deg) scale(0);
  transition: transform 0.12s ease, opacity 0.12s ease;
  opacity: 0;
}
.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 4px rgba(139,26,46,0.12);
  border-color: #8b1a2e;
}
.checkbox-input:checked + .checkbox-custom {
  background: #8b1a2e;
  border-color: #8b1a2e;
}
.checkbox-input:checked + .checkbox-custom::after {
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg) scale(1);
  opacity: 1;
}
.prod-cell {
  display: flex;
  align-items: center;
  text-align: start;
  gap: 0.75rem;
}
.prod-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.prod-name {
    font-family: 'Noto Serif', sans-serif;
  font-weight: 700;
  color: #3F0006;
  margin: 0;
  font-size: 0.85rem;
}
.prod-sku {
  font-size: 0.68rem;
  color: #bfa8a8;
  margin: 0.1rem 0 0;
}
.category-pill {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  background: #FDCB9B4D;
  color: #79542D;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
}
.stock-badge {
  display: inline-block;
  padding: 0.22rem 0.65rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.stock--ok {
  background: #aff8d9;
  color: #2e7d52;
}
.stock--low {
  background: #f7deaf;
  color: #b45309;
}
.stock--out {
  background: #f89e9e;
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

/* Pagination */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.85rem 1rem 1rem;
  background-color: #ffff;
}
.table-count {
  font-size: 0.78rem;
  color: #9e8080;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  background: #fff;
  border: 0px solid #e8d5d5;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Lato", sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #3F0006;
  cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) {
  border-color: #8b1a2e;
  color: #8b1a2e;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-btn--active {
  background: #3F0006;
  border-color: #3F0006;
  color: #fff;
}
.page-ellipsis {
  font-size: 0.85rem;
  color: #9e8080;
  padding: 0 0.25rem;
}

/* ── Bottom widgets ── */
.bottom-widgets {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
}
.widget-card {
  background: #F8F3E9;
  border-radius: 24px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-align: center;
}
.widget-icon-ms {
  font-size: 26px !important;
  color: #8b1a2e;
  font-variation-settings:
    "FILL" 0,
    "wght" 300,
    "GRAD" 0,
    "opsz" 24;
  margin-bottom: 0.15rem;
}
.widget-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2a1a1a;
}
.widget-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #7C5730;
}
.widget-card--cta {
  background: #8b1a2e;
  flex-direction: row;
  text-align: left;
  gap: 1.25rem;
  align-items: center;
}
.cta-text {
  flex: 1;
}
.cta-title {
    font-family: Plus Jakarta Sans, sans-serif;
  font-size: 25px;
  font-weight: 400;
  font-style: italic;
  color: #fff;
  margin: 0 0 0.3rem;
  line-height: 1.3;
}
.cta-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}
.cta-btn {
  background: #FEF9EF;
  color: #660010;
  border: none;
  border-radius: 30px;
  padding: 0.65rem 1rem;
  font-family: "Lato", sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  line-height: 1.4;
  flex-shrink: 0;
  transition: opacity 0.2s;
  min-width: 200px;
}
.cta-btn:hover {
  opacity: 0.9;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero-row {
    grid-template-columns: 1fr;
  }
  .hero-card--inspiration {
    min-height: 120px;
  }
  .bottom-widgets {
    grid-template-columns: 1fr 1fr;
  }
  .widget-card--cta {
    grid-column: span 2;
    flex-direction: column;
    text-align: center;
  }
}
@media (max-width: 600px) {
  .products-main {
    padding: 1rem;
  }
  .bottom-widgets {
    grid-template-columns: 1fr;
  }
  .widget-card--cta {
    grid-column: span 1;
  }
}

.quote-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(63, 0, 6, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.quote-modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 24px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
.quote-modal-title {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  color: #3F0006;
  margin: 0 0 1.5rem;
}
.quote-textarea {
  width: 100%;
  padding: 1rem;
  border: 1.5px solid #e8d5d5;
  border-radius: 16px;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  resize: none;
  outline: none;
  margin-bottom: 1.5rem;
  background: #fdfaf8;
}
.quote-textarea:focus {
  border-color: #8b1a2e;
}
.quote-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
