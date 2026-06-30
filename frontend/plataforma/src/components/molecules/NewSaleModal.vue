<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import api from '../../lib/api'

interface SaleProduct {
  productId: number
  nombre: string
  cantidad: number
  precio: number
  subtotal: number
}

interface ProductOption {
  id: number
  nombre: string
  precio_adicional: number
}
interface User {
  id: number
  usuario: string
}

interface Product {
  id: number
  nombre: string
  precio: number
  stock: number
  opciones?: ProductOption[]
}

const props = defineProps<{ isOpen: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', sale: any): void
}>()

// FORM
const cliente = ref('')
const metodoPago = ref('yape')
const observaciones = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const users = ref<User[]>([])
const selectedUserId = ref<number | null>(null)
// DATA
const products = ref<Product[]>([])
const saleProducts = ref<SaleProduct[]>([])

// SELECT
const selectedProductId = ref<number | null>(null)
const selectedOptionId = ref<number | null>(null)
const cantidad = ref(1)

// COMPUTED
const selectedProduct = computed(() =>
  products.value.find(p => p.id === selectedProductId.value)
)

const selectedOption = computed(() =>
  selectedProduct.value?.opciones?.find(o => o.id === selectedOptionId.value)
)

const total = computed(() =>
  saleProducts.value.reduce((sum, p) => sum + p.subtotal, 0)
)

const cantidadTotal = computed(() =>
  saleProducts.value.reduce((sum, p) => sum + p.cantidad, 0)
)

/* =========================
   LOAD PRODUCTS (FIX REAL)
========================= */
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      loadProducts()
      loadUsers() 
    }
  },
  { immediate: true }
)

async function loadProducts() {
  try {
    const res: any = await api.get('/productos')
    const data = res?.productos || res?.data || res || []

    products.value = data.filter((p: Product) => p.stock > 0)
  } catch (err) {
    console.error('Error loading products:', err)
    error.value = 'Error cargando productos'
  }
}
async function loadUsers() {
  try {
    const res: any = await api.get('/admin/users')

    console.log('USERS RESPONSE:', res)

    const data = res.users || res || []

    users.value = data.map((u: any) => ({
      id: u.id,
      usuario: u.usuario
    }))

  } catch (err) {
    console.error('Error cargando usuarios:', err)
    error.value = 'No se pudieron cargar los usuarios'
  }
}
/* =========================
   ADD PRODUCT (OPTIMIZADO)
========================= */
function addProduct() {
  if (!selectedProduct.value || cantidad.value <= 0) return

  const product = selectedProduct.value
  const option = selectedOption.value

  const precioFinal = product.precio + (option?.precio_adicional || 0)

  const id = product.id
  const nombre = option
    ? `${product.nombre} (${option.nombre})`
    : product.nombre

  const index = saleProducts.value.findIndex(p => p.productId === id)

  if (index !== -1) {
    saleProducts.value[index].cantidad += cantidad.value
    saleProducts.value[index].subtotal =
      saleProducts.value[index].cantidad *
      saleProducts.value[index].precio
  } else {
    saleProducts.value.push({
      productId: id,
      nombre,
      cantidad: cantidad.value,
      precio: precioFinal,
      subtotal: precioFinal * cantidad.value
    })
  }

  resetSelection()
}

function resetSelection() {
  selectedProductId.value = null
  selectedOptionId.value = null
  cantidad.value = 1
}

function removeProduct(index: number) {
  saleProducts.value.splice(index, 1)
}

/* =========================
   SUBMIT (FIX API)
========================= */
async function handleSubmit() {
  if (!saleProducts.value.length) {
    error.value = 'Debe agregar al menos un producto'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const payload = {
      cliente: cliente.value || null,
      metodoPago: metodoPago.value,
      observaciones: observaciones.value || null,
      total: total.value,
      productos: saleProducts.value.map(p => ({
        productoId: p.productId,
        cantidad: p.cantidad,
        precioUnitario: p.precio
      }))
    }

    // 🔥 IMPORTANTE: si tu backend falla aquí, cambia ruta a /ventas
    const res: any = await api.post('/orders', payload)

    success.value = true
    emit('created', res)

    setTimeout(() => {
      saleProducts.value = []
      emit('close')
    }, 1000)

  } catch (err: any) {
    console.error(err)
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      'Error al crear venta'
  } finally {
    loading.value = false
  }
}

/* =========================
   MODAL CONTROL
========================= */
function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="$emit('close')" type="button" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="modal-body">
            <h2 class="modal-title">Nueva Venta</h2>

            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">✓ Venta registrada exitosamente</div>

            <form @submit.prevent="handleSubmit" class="form">
              <!-- Cliente -->
              <div class="form-group">
                <label class="form-label">Cliente (opcional)</label>
              </div>
             <div class="form-group">
  <label class="form-label">Cliente</label>

  <select v-model="selectedUserId" class="form-input">
    <option :value="null">Cliente libre / no registrado</option>

    <option v-for="u in users" :key="u.id" :value="u.id">
      {{ u.usuario }}
    </option>
  </select>
</div>

              <!-- Productos -->
              <div class="form-group">
                <label class="form-label">Agregar Productos</label>
                <div class="product-row">
                  <select v-model="selectedProductId" class="form-input">
                    <option :value="null">Seleccionar producto</option>
                    <option v-for="p in products" :key="p.id" :value="p.id">
                      {{ p.nombre }} - S/{{ p.precio }} (Stock: {{ p.stock }})
                    </option>
                  </select>
                </div>

                <div v-if="selectedProduct?.opciones?.length" class="option-row">
                  <select v-model="selectedOptionId" class="form-input">
                    <option :value="null">Sin opción extra</option>
                    <option v-for="o in selectedProduct!.opciones" :key="o.id" :value="o.id">
                      {{ o.nombre }} (+S/{{ o.precio_adicional }})
                    </option>
                  </select>
                </div>

                <div class="add-product-row">
                  <input v-model.number="cantidad" type="number" min="1" class="form-input qty-input" placeholder="Cant" />
                  <button type="button" class="btn-add" @click="addProduct" :disabled="!selectedProductId">
                    + Agregar
                  </button>
                </div>
              </div>

              <!-- Productos agregados -->
              <div v-if="saleProducts.length" class="products-list">
                <div v-for="(item, index) in saleProducts" :key="index" class="product-item">
                  <div class="product-info">
                    <span class="product-name">{{ item.nombre }}</span>
                    <span class="product-qty">x{{ item.cantidad }}</span>
                    <span class="product-price">S/{{ item.subtotal.toFixed(2) }}</span>
                  </div>
                  <button type="button" class="btn-remove" @click="removeProduct(index)" aria-label="Eliminar producto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div class="totals">
                  <div class="total-row"><span>Productos:</span><span>{{ saleProducts.length }}</span></div>
                  <div class="total-row"><span>Cantidad total:</span><span>{{ cantidadTotal }}</span></div>
                  <div class="total-row total-final"><span>Total:</span><span>S/{{ total.toFixed(2) }}</span></div>
                </div>
              </div>

              <!-- Método de pago -->
              <div class="form-group">
                <label class="form-label">Método de Pago</label>
                <select v-model="metodoPago" class="form-input">
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="efectivo">Efectivo</option>
             </select>
              </div>

              <!-- Observaciones -->
              <div class="form-group">
                <label class="form-label">Observaciones</label>
                <textarea v-model="observaciones" class="form-input form-textarea" rows="2" placeholder="Notas adicionales..." />
              </div>

              <!-- Botones -->
              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
                <button type="submit" class="btn-primary" :disabled="loading || saleProducts.length === 0">
                  {{ loading ? 'Registrando...' : 'Registrar Venta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff; border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%; max-width: 600px; max-height: 85vh;
  overflow-y: auto; position: relative;
}

.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: transparent; border: none; cursor: pointer;
  color: #9e8080; transition: color 0.2s; z-index: 10;
}
.modal-close:hover { color: #8b1a2e; }

.modal-body { padding: 2rem; }

.modal-title {
  font-family: 'Noto Serif', serif; font-size: 1.75rem;
  font-weight: 400; color: #2a1a1a; margin: 0 0 1.5rem;
}

.error-message {
  background: #fde8e8; color: #9b1c1c; padding: 0.75rem 1rem;
  border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;
}

.success-message {
  background: #e8fde8; color: #1c7b1c; padding: 0.75rem 1rem;
  border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;
  text-align: center; font-weight: 700;
}

.form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.9rem; font-weight: 600; color: #9e8080; text-transform: uppercase; letter-spacing: 0.05em; }
.form-input {
  font-size: 1rem; padding: 0.75rem; border: 1px solid #f5ece4;
  border-radius: 8px; transition: all 0.2s; background: #fff; color: #2a1a1a;
}
.form-input:focus { outline: none; border-color: #8b1a2e; box-shadow: 0 0 0 3px rgba(139, 26, 46, 0.1); }
.form-textarea { resize: vertical; min-height: 60px; }

.product-row { display: flex; gap: 0.5rem; }
.option-row { margin-top: 0.25rem; }
.add-product-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.qty-input { width: 80px; flex-shrink: 0; }

.btn-add {
  flex: 1; padding: 0.75rem; background: #8b1a2e; color: #fff;
  border: none; border-radius: 8px; font-weight: 700; cursor: pointer;
  transition: background 0.2s;
}
.btn-add:hover:not(:disabled) { background: #721525; }
.btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

.products-list { display: flex; flex-direction: column; gap: 0.5rem; }

.product-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem; background: #fdf6f0; border-radius: 8px;
}
.product-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.product-name { font-weight: 600; color: #2a1a1a; flex: 1; }
.product-qty { color: #9e8080; font-size: 0.9rem; }
.product-price { font-weight: 700; color: #8b1a2e; }

.btn-remove {
  background: transparent; border: none; cursor: pointer;
  color: #9b1c1c; padding: 4px; border-radius: 4px;
  transition: background 0.2s;
}
.btn-remove:hover { background: #fde8e8; }

.totals {
  padding: 0.75rem; background: #fff; border: 1px solid #f5ece4;
  border-radius: 8px; display: flex; flex-direction: column; gap: 0.4rem;
}
.total-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #5a4a4a; }
.total-final { font-size: 1.1rem; font-weight: 800; color: #8b1a2e; border-top: 1px solid #f5ece4; padding-top: 0.4rem; }

.form-actions {
  display: flex; gap: 0.75rem; margin-top: 1rem;
  padding-top: 1rem; border-top: 1px solid #f5ece4;
}

.btn-secondary {
  flex: 1; padding: 0.75rem; background: #f5ece4; color: #8b1a2e;
  border: none; border-radius: 12px; font-weight: 700; cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #ece0d5; }

.btn-primary {
  flex: 1; padding: 0.75rem; background: #8b1a2e; color: #fff;
  border: none; border-radius: 12px; font-weight: 700; cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #a82339; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95); }
</style>