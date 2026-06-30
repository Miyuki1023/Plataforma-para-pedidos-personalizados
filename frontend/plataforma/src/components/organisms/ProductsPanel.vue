<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductCreateModal from "./ProductCreateModal.vue";
import ProductEditModal from "./ProductEditModal.vue";
import { apiService } from "../../lib/api";
import NewSaleModal from "../molecules/NewSaleModal.vue";

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
const isSaleModalOpen = ref(false)
// Filtro de categorías
const selectedCategory = ref("");

// Modal states
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedProductForEdit = ref<Product | null>(null);

const ITEMS_PER_PAGE = 8;

// Obtener categorías únicas para el selector de filtros
const categories = computed(() => {
  const cats = products.value.map((p) => p.categoria).filter(Boolean);
  return [...new Set(cats)];
});

// Filtrar productos según la categoría seleccionada
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter((p) => p.categoria === selectedCategory.value);
});

const totalItems = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));

const allSelected = computed(
  () =>
    filteredProducts.value.length > 0 &&
    selected.value.length === filteredProducts.value.length
);
function handleNewSale() {
  isSaleModalOpen.value = true
}
function toggleAll() {
  selected.value = allSelected.value ? [] : filteredProducts.value.map((p) => p.id);
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
    const response: any = await apiService.get("/productos");
    products.value = Array.isArray(response) ? response : (response?.data || response?.products || []);
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

// Eliminar productos seleccionados
async function handleDeleteProducts() {
  if (selected.value.length === 0) return;

  const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar los ${selected.value.length} productos seleccionados?`
  );

  if (!confirmDelete) return;

  loading.value = true;
  error.value = "";
  try {
    for (const id of selected.value) {
      await apiService.delete(`/productos/${id}`);
    }
    
    products.value = products.value.filter((p) => !selected.value.includes(p.id));
    selected.value = [];
    
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  } catch (err) {
    console.error(err);
    error.value = "Error al eliminar uno o más productos";
  } finally {
    loading.value = false;
  }
}

// Cambiar disponibilidad del producto (Toggle interactivo)
async function toggleAvailability(product: Product) {
  error.value = "";
  const nuevoEstado = product.disponible === false ? true : false;
  
  try {
    // Mandamos todo el body estructurado como lo espera tu backend en updateProduct
    await apiService.put(`/productos/${product.id}`, {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock: product.stock,
      imagenUrls: product.imagen_url,
      disponible: nuevoEstado
    });

    // Actualización reactiva local
    const index = products.value.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products.value[index].disponible = nuevoEstado;
    }
  } catch (err) {
    console.error(err);
    error.value = "Error al actualizar el estado del producto";
  }
}


function handleGenerateCatalog() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para generar el catálogo.');
    return;
  }

  const itemsHtml = filteredProducts.value.map(p => `
    <div style="border-bottom: 1px solid #f5ece4; padding: 20px 0; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid;">
      <div style="max-width: 75%;">
        <h3 style="margin: 0; color: #3F0006; font-family: 'Cormorant Garamond', serif; font-size: 20px;">${p.nombre}</h3>
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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Lato', sans-serif; padding: 60px; color: #2a1a1a; background: #fff; }
          .header { text-align: center; margin-bottom: 60px; border-bottom: 4px double #8b1a2e; padding-bottom: 40px; }
          h1 { font-family: 'Cormorant Garamond', serif; font-size: 48px; color: #3F0006; margin: 0; }
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

function handleCategoryChange() {
  currentPage.value = 1;
  selected.value = [];
}

const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  return filteredProducts.value
    .slice(start, end)
    .map((p) => ({
      ...p,
      sku: `SKU:${p.id}`,
      stockType: p.stock > 10 ? "ok" : p.stock > 0 ? "low" : "out",
      price: `S/${Number(p.precio).toFixed(2)}`,
      img: Array.isArray(p.imagen_url) && p.imagen_url.length > 0
        ? p.imagen_url[0]
        : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&q=80",
      active: p.disponible !== false
    }));
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <main class="products-main">
    <div class="hero-row">
      <div class="hero-card hero-card--main">
        <div class="hero-text">
          <h1 class="hero-title">Editor de Productos</h1>
          <p class="hero-subtitle">
            Gestiona la vitrina digital de tu pastelería. Cada creación es un
            testimonio de artesanía y sabor.
          </p>
        </div>
        <div class="hero-watermark" aria-hidden="true"></div>
      </div>

      <div class="hero-card hero-card--inspiration">
        <button class="insp-edit-btn" title="Editar inspiración">
          <span class="material-symbols-rounded" style="font-size: 14px">edit</span>
        </button>
        <p class="insp-label">Inspiración del día</p>
        <p class="insp-quote">
          "La repostería es un arte donde la precisión se encuentra con la
          pasión."
        </p>
      </div>
    </div>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn-primary" @click="handleOpenCreateModal">
          <span class="material-symbols-rounded">add</span>
          Nuevo producto
        </button>
        
         <button class="btn-primary" @click="handleNewSale">
          <span class="material-symbols-rounded">add</span>
          Nuevo venta
        </button>
        
        <button 
          class="btn-secondary"
          :disabled="selected.length !== 1"
          @click="handleEditProduct"
        >
          <span class="material-symbols-rounded">edit</span>
          Editar
        </button>
        <button 
          class="btn-secondary btn-secondary--danger"
          :disabled="selected.length === 0 || loading"
          @click="handleDeleteProducts"
        >
          <span class="material-symbols-rounded">delete</span>
          Eliminar ({{ selected.length }})
        </button>
      </div>

      <div class="toolbar-right">
        <div class="select-wrapper">
          <span class="material-symbols-rounded filter-icon">filter_alt</span>
          <select 
            v-model="selectedCategory" 
            @change="handleCategoryChange" 
            class="filter-select"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>
    </div>

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
            <th style="text-align: left;">PRODUCTO</th>
            <th style="text-align: left;">CATEGORÍA</th>
            <th style="text-align: left;">STOCK</th>
            <th style="text-align: left;">PRECIO</th>
            <th style="text-align: center;">ESTADO</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in displayProducts"
            :key="p.id"
            class="prod-row"
            :class="{ 'prod-row--selected': selected.includes(p.id) }"
          >
            <td class="td-check">
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
            <td style="text-align: center;">
              <button
                class="toggle"
                :class="{ 'toggle--on': p.active }"
                @click="toggleAvailability(p)"
                title="Cambiar disponibilidad"
              >
                <span class="toggle-thumb" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <span class="table-count">
          Mostrando {{ displayProducts.length }} de {{ totalItems }} creaciones
        </span>
        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <span class="material-symbols-rounded" style="font-size: 14px">chevron_left</span>
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
            <span class="material-symbols-rounded" style="font-size: 14px">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

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
        <button class="cta-btn" @click="handleGenerateCatalog">Generar<br />Catálogo</button>
      </div>
    </div>
  </main>
<NewSaleModal
  :is-open="isSaleModalOpen"
  @close="isSaleModalOpen = false"
  @created="handleNewSale"
/>
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
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Lato:wght@400;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;1,400&display=swap");

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
  font-family: "Lato", sans-serif;
}

.error-banner {
  background-color: #fce8e6;
  color: #c5221f;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
}

/* ── Hero row ── */
.hero-row {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
  align-items: stretch;
}

.hero-card {
  border-radius: 24px;
  padding: 1.75rem;
  position: relative;
  overflow: hidden;
  text-align: start;
}

.hero-card--main {
  background: #f5ece4;
  display: flex;
  align-items: flex-end;
  min-height: 140px;
}
.hero-text {
  position: relative;
  z-index: 1;
  max-width: 500px;
}
.hero-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 36px;
  font-weight: 600;
  color: #3F0006;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 0.85rem;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #6b5050;
  line-height: 1.6;
  margin: 0;
}

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
  padding: 1rem 0 0.25rem;
}
.toolbar-left {
  display: flex;
  gap: 0.65rem;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.filter-icon {
  position: absolute;
  left: 12px;
  color: #7C5730AA;
  pointer-events: none;
  font-size: 16px !important;
}
.filter-select {
  padding: 0.52rem 1rem 0.52rem 2.2rem;
  background: #fff;
  color: #2a1a1a;
  border: 1px solid #e8d5d5;
  border-radius: 14px;
  font-family: "Lato", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  min-width: 180px;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: #8b1a2e;
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
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #7a1729;
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
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover:not(:disabled) {
  border-color: #8b1a2e;
  color: #8b1a2e;
}
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variante destructiva sutil basada en el botón secundario */
.btn-secondary--danger {
  color: #c5221f;
  border-color: #fce8e6;
  background: #fff;
}
.btn-secondary--danger:hover:not(:disabled) {
  background: #fce8e6;
  border-color: #c5221f;
  color: #c5221f;
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
  padding: 1rem;
  background: #ffffff;
}
.th-check, .td-check {
  width: 56px;
  text-align: center !important;
}
.prod-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(124, 87, 48, 0.08);
  vertical-align: middle;
  text-align: left;
}
.prod-table tr:last-child td {
  border-bottom: none;
}
.prod-row {
  transition: background 0.15s;
}
.prod-row:hover, .prod-row--selected {
  background: rgba(240, 228, 221, 0.7);
}

/* Checkbox Custom */
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
  transition: all 0.14s;
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
  transition: all 0.12s ease;
  opacity: 0;
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

/* Prod Cell details */
.prod-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.prod-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: #eee;
}
.prod-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  color: #3F0006;
  margin: 0;
  font-size: 0.95rem;
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
}
.stock--ok { background: #aff8d9; color: #2e7d52; }
.stock--low { background: #f7deaf; color: #b45309; }
.stock--out { background: #f89e9e; color: #9b1c1c; }

.price-cell {
  font-weight: 700;
  color: #2a1a1a;
}

/* Toggle interactivo */
.toggle {
  width: 34px;
  height: 19px;
  background: #ddd;
  border: none;
  border-radius: 20px;
  position: relative;
  transition: background 0.25s;
  padding: 0;
  cursor: pointer;
}
.toggle--on { background: #8b1a2e; }
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
.toggle--on .toggle-thumb { transform: translateX(15px); }

/* Footer & Pagination */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #ffffff;
  border-top: 1px solid rgba(124, 87, 48, 0.08);
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
  border: 1px solid #e8d5d5;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
.cta-text { flex: 1; }
.cta-title {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #fff;
  margin: 0 0 0.3rem;
  line-height: 1.3;
}
.cta-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}
.cta-btn {
  background: #FEF9EF;
  color: #660010;
  border: none;
  border-radius: 30px;
  padding: 0.65rem 1.25rem;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  line-height: 1.4;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.cta-btn:hover { opacity: 0.9; }

/* Responsive */
@media (max-width: 900px) {
  .hero-row { grid-template-columns: 1fr; }
  .bottom-widgets { grid-template-columns: 1fr 1fr; }
  .widget-card--cta { grid-column: span 2; flex-direction: column; text-align: center; }
}
@media (max-width: 600px) {
  .products-main { padding: 1rem; }
  .bottom-widgets { grid-template-columns: 1fr; }
  .widget-card--cta { grid-column: span 1; }
}
</style>