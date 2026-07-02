<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../../stores/cart'
import BaseButton from '../../atoms/BaseButton.vue'
import BaseInput from '../../atoms/BaseInput.vue'
import FavoriteIcon from '../../atoms/FavoriteIcon.vue'

const props = defineProps<{
  product: any
}>()

const router = useRouter()
const cartStore = useCartStore()

/* ─── IMAGE FALLBACK ──────────────────────────────────────── */
const IMAGE_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23fdf0f5" width="400" height="400"/%3E%3Ctext fill="%23c05080" font-family="sans-serif" font-size="18" x="50" y="200"%3EImagen no disponible%3C/text%3E%3C/svg%3E'

const safeImage = computed(() => {
  const img = props.product?.image || props.product?.imageUrl || IMAGE_FALLBACK
  return String(img)
})

/* ─── STOCK ─────────────────────────────────────────────── */
const stock = computed(() => props.product?.stock || props.product?.cantidad || 10)
const stockStatus = computed(() => {
  if (stock.value > 5) return { label: 'Disponible', class: 'stock--available', icon: '✅' }
  if (stock.value > 0) return { label: 'Bajo stock', class: 'stock--low', icon: '⚠️' }
  return { label: 'Se prepara bajo pedido', class: 'stock--order', icon: '🔄' }
})
const preparationTime = computed(() => {
  if (stock.value >= quantity.value) return '24 horas'
  return '48 - 72 horas'
})
const deliveryTime = computed(() => '2 - 5 días hábiles')

/* ─── CANTIDAD ────────────────────────────────────────────── */
const quantity = ref(1)
const increaseQty = () => quantity.value++
const decreaseQty = () => { if (quantity.value > 1) quantity.value-- }

/* ─── MODO DE PERSONALIZACIÓN ────────────────────────────── */
type CustomizationMode = 'batch' | 'individual'
const customizationMode = ref<CustomizationMode>('batch')

/* ─── UNIDADES INDIVIDUALES ──────────────────────────────── */
interface UnitCustomization {
  ingredient: string
  message: string
  fruitToppings: { id: number; value: string }[]
  creamToppings: { id: number; value: string }[]
}

const createEmptyUnit = (): UnitCustomization => ({
  ingredient: '',
  message: '',
  fruitToppings: [{ id: 1, value: '' }],
  creamToppings: [{ id: 1, value: '' }]
})

const units = ref<UnitCustomization[]>([])
const currentUnitIndex = ref(0)

// Sincronizar unidades con la cantidad
watch(quantity, (newQty) => {
  while (units.value.length < newQty) {
    units.value.push(createEmptyUnit())
  }
  if (currentUnitIndex.value >= newQty) {
    currentUnitIndex.value = Math.max(0, newQty - 1)
  }
})

// Inicializar con al menos 1 unidad
if (units.value.length === 0) {
  units.value.push(createEmptyUnit())
}

const currentUnit = computed(() => units.value[currentUnitIndex.value] || createEmptyUnit())

const totalUnits = computed(() => units.value.length)

const prevUnit = () => {
  if (currentUnitIndex.value > 0) currentUnitIndex.value--
}

const nextUnit = () => {
  if (currentUnitIndex.value < units.value.length - 1) currentUnitIndex.value++
}

/* ─── TOPPINGS DINÁMICOS ──────────────────────────────────── */
const MAX_TOPPINGS = 5

type ToppingSlot = { id: number; value: string }

const fruitOptions = ['Fresa', 'Arándanos', 'Mango', 'Maracuyá', 'Kiwi', 'Durazno']
const creamOptions = ['Crema batida', 'Chocolate', 'Manjar', 'Nutella', 'Caramelo']

// Para modo batch - usar las refs existentes
const batchIngredient = ref('')
const batchMessage = ref('')
const batchFruitToppings = ref<ToppingSlot[]>([{ id: 1, value: '' }])
const batchCreamToppings = ref<ToppingSlot[]>([{ id: 1, value: '' }])
let nextBatchFruitId = 2
let nextBatchCreamId = 2

/* Modal */
type ModalTarget = { array: ToppingSlot[]; options: string[]; extra: string; label: string } | null
const modalOpen   = ref(false)
const modalTarget = ref<ModalTarget>(null)
const modalSlotId = ref<number | null>(null)

const openModal = (
  array: ToppingSlot[],
  slotId: number,
  options: string[],
  extra: string,
  label: string
) => {
  modalTarget.value = { array, options, extra, label }
  modalSlotId.value = slotId
  modalOpen.value   = true
}

const selectFromModal = (value: string) => {
  if (!modalTarget.value || modalSlotId.value === null) return
  const arr = modalTarget.value.array
  const idx = arr.findIndex(t => t.id === modalSlotId.value)
  if (idx === -1) return

  arr[idx].value = value

  if (idx === arr.length - 1 && arr.length < MAX_TOPPINGS) {
    const isFruit = modalTarget.value.options === fruitOptions
    const newId = isFruit ? (customizationMode.value === 'batch' ? nextBatchFruitId++ : nextBatchCreamId++) : (customizationMode.value === 'batch' ? nextBatchCreamId++ : nextBatchCreamId++)
    arr.push({ id: newId, value: '' })
  }

  modalOpen.value = false
}

const removeTopping = (array: ToppingSlot[], id: number) => {
  const idx = array.findIndex(t => t.id === id)
  if (idx !== -1) {
    array.splice(idx, 1)
  }
  if (array.length === 0 || array[array.length - 1].value !== '') {
    const isFruit = array === (customizationMode.value === 'batch' ? batchFruitToppings.value : currentUnit.value.fruitToppings)
    const newId = isFruit ? nextBatchFruitId++ : nextBatchCreamId++
    array.push({ id: newId, value: '' })
  }
}

/* ─── STOCK OVERFLOW MESSAGE ─────────────────────────────── */
const stockOverflow = computed(() => {
  if (quantity.value <= stock.value) return null
  const extra = quantity.value - stock.value
  return {
    available: stock.value,
    extra,
    message: `Actualmente tenemos **${stock.value} unidades** listas para entrega inmediata. Las **${extra} restantes** serán preparadas especialmente para ti, por lo que podrían requerir un tiempo adicional.`
  }
})

/* ─── PRECIO ──────────────────────────────────────────────── */
const selectedSize = ref('Mediano')
const sizes = [
  { label: 'Pequeño', detail: '12 cm', price: 60 },
  { label: 'Mediano', detail: '16 cm', price: 80, popular: true },
  { label: 'Grande',  detail: '20 cm', price: 100 }
]

const selectedSizePrice = computed(() =>
  sizes.find(s => s.label === selectedSize.value)?.price || props.product?.price || 0
)

const getToppingsPrice = (fruitToppings: ToppingSlot[], creamToppings: ToppingSlot[], message: string) => {
  let t = 0
  fruitToppings.forEach(s => { if (s.value) t += 5 })
  creamToppings.forEach(s => { if (s.value) t += 8 })
  if (message.trim()) t += 2
  return t
}

const batchToppingsPrice = computed(() => getToppingsPrice(batchFruitToppings.value, batchCreamToppings.value, batchMessage.value))

const totalToppingsPrice = computed(() => {
  if (customizationMode.value === 'batch') {
    return batchToppingsPrice.value * quantity.value
  }
  return units.value.reduce((sum, unit) => sum + getToppingsPrice(unit.fruitToppings, unit.creamToppings, unit.message), 0)
})

const totalPrice = computed(() =>
  (selectedSizePrice.value * quantity.value) + totalToppingsPrice.value
)

/* ─── HELPERS ─────────────────────────────────────────────── */
const hasAnyTopping = computed(() => {
  if (customizationMode.value === 'batch') {
    return batchFruitToppings.value.some(t => t.value) ||
      batchCreamToppings.value.some(t => t.value) ||
      batchMessage.value.trim() !== ''
  }
  return units.value.some(unit =>
    unit.fruitToppings.some(t => t.value) ||
    unit.creamToppings.some(t => t.value) ||
    unit.message.trim() !== ''
  )
})

const usedOptions = computed(() => {
  if (!modalTarget.value) return new Set<string>()
  return new Set(
    modalTarget.value.array
      .filter(t => t.id !== modalSlotId.value)
      .map(t => t.value)
  )
})

const addedToCart = ref(false)

const buildCartItem = (unit: UnitCustomization, index: number) => {
  const toppings = [
    ...unit.fruitToppings.filter(t => t.value).map(t => t.value),
    ...unit.creamToppings.filter(t => t.value).map(t => t.value)
  ].filter(Boolean)

  return {
    id: `${props.product.id || Date.now()}-${index}`,
    image: props.product.image,
    name: props.product.name,
    description: props.product.description,
    size: selectedSize.value,
    avoidIngredient: unit.ingredient,
    toppings,
    message: unit.message,
    quantity: 1,
    price: selectedSizePrice.value + getToppingsPrice(unit.fruitToppings, unit.creamToppings, unit.message),
    unitPrice: selectedSizePrice.value + getToppingsPrice(unit.fruitToppings, unit.creamToppings, unit.message),
    stock: stock.value,
    preparationTime: preparationTime.value,
    customizations: toppings.length > 0 ? 'Personalizado' : '',
    personalized: toppings.length > 0
  }
}

const addToCart = () => {
  if (customizationMode.value === 'batch') {
    const toppings = [
      ...batchFruitToppings.value.filter(t => t.value).map(t => t.value),
      ...batchCreamToppings.value.filter(t => t.value).map(t => t.value)
    ].filter(Boolean)

    const cartItem = {
      id: props.product.id || Date.now(),
      image: props.product.image,
      name: props.product.name,
      description: props.product.description,
      size: selectedSize.value,
      avoidIngredient: batchIngredient.value,
      toppings,
      message: batchMessage.value,
      quantity: quantity.value,
      price: selectedSizePrice.value + batchToppingsPrice.value,
      unitPrice: selectedSizePrice.value + batchToppingsPrice.value,
      stock: stock.value,
      preparationTime: preparationTime.value,
      customizations: toppings.length > 0 ? 'Personalizado' : '',
      personalized: toppings.length > 0
    }
    cartStore.addItem(cartItem)
  } else {
    for (let i = 0; i < units.value.length; i++) {
      const item = buildCartItem(units.value[i], i)
      cartStore.addItem(item)
    }
  }

  addedToCart.value = true
  router.push({ name: 'carrito' })
  setTimeout(() => { addedToCart.value = false }, 2000)
}

/* ─── GALERÍA ─────────────────────────────────────────────── */
const gallery = computed(() => [
  safeImage.value,
  safeImage.value,
  safeImage.value
])
const activeImage = ref(safeImage.value)
watch(() => props.product?.image, (v) => { if (v) activeImage.value = v })
</script>

<template>
  <main class="product-profile">

    <!-- ══════════════ GALERÍA ══════════════ -->
    <div class="profile-gallery">
      <div class="profile-image-wrapper">
        <img
          :src="activeImage"
          :alt="`${props.product?.name || 'Producto'} - Imagen principal`"
          class="profile-image"
          width="500"
          height="500"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />

        <span v-if="props.product?.isNew" class="profile-badge">Nuevo ✨</span>

        <FavoriteIcon class="profile-fav" />

        <div class="image-hint">Toca para zoom</div>
      </div>

      <div class="thumbs-row" role="list" aria-label="Galería de imágenes">
        <button
          v-for="(img, i) in gallery"
          :key="i"
          class="thumb-btn"
          :class="{ active: activeImage === img }"
          @click="activeImage = img"
          :aria-label="`Ver imagen ${i + 1} del producto`"
          role="listitem"
        >
          <img
            :src="img"
            :alt="`Miniatura ${i + 1} de ${props.product?.name || 'Producto'}`"
            class="thumb-image"
            width="100"
            height="100"
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>
    </div>

    <!-- ══════════════ CONTENIDO ══════════════ -->
    <div class="profile-content">

      <!-- ENCABEZADO -->
      <div class="profile-top">
        <div class="profile-top-row">
          <span class="profile-category">{{ props.product?.category }}</span>
          <div class="profile-meta">
            <span class="meta-chip">⭐ 4.9</span>
            <span class="meta-chip">📦 +120 pedidos</span>
            <span class="meta-chip">🚚 {{ deliveryTime }}</span>
          </div>
        </div>

        <h1 class="profile-title">{{ props.product?.name }}</h1>
        <p class="profile-description">{{ props.product?.description }}</p>

        <!-- Stock status -->
        <div class="stock-info" :class="stockStatus.class">
          <span class="stock-icon" aria-hidden="true">{{ stockStatus.icon }}</span>
          <span class="stock-label">{{ stockStatus.label }}</span>
          <span class="stock-count" v-if="stock > 0">({{ stock }} disponibles)</span>
        </div>

        <!-- Preparation time -->
        <div class="time-info">
          <span>⏱️ Preparación: <strong>{{ preparationTime }}</strong></span>
          <span>📬 Entrega: <strong>{{ deliveryTime }}</strong></span>
        </div>
      </div>

      <!-- TAMAÑO -->
      <div class="profile-section">
        <div class="section-header">
          <h2 class="profile-subtitle">Tamaño</h2>
          <span class="section-note">El mediano es el más pedido</span>
        </div>

        <div class="sizes-grid" role="radiogroup" aria-label="Seleccionar tamaño">
          <button
            v-for="size in sizes"
            :key="size.label"
            class="size-chip"
            :class="{ active: selectedSize === size.label, popular: size.popular }"
            @click="selectedSize = size.label"
            role="radio"
            :aria-checked="selectedSize === size.label"
            :aria-label="`Tamaño ${size.label} - ${size.detail} - S/${size.price}`"
          >
            <span v-if="size.popular" class="popular-badge">Popular</span>
            <span class="size-name">{{ size.label }}</span>
            <span class="size-detail">{{ size.detail }}</span>
            <span class="size-price">S/{{ size.price }}</span>
          </button>
        </div>
      </div>

      <!-- CANTIDAD -->
      <div class="profile-section">
        <h2 class="profile-subtitle">Cantidad</h2>
        <div class="quantity-box">
          <button class="qty-btn" @click="decreaseQty" :disabled="quantity <= 1" aria-label="Reducir cantidad">−</button>
          <span class="qty-number" aria-live="polite" aria-atomic="true">{{ quantity }}</span>
          <button class="qty-btn" @click="increaseQty" aria-label="Aumentar cantidad">+</button>
        </div>

        <!-- Stock overflow message -->
        <div v-if="stockOverflow" class="stock-overflow-notice animate-fadeIn" role="alert">
          <span class="stock-overflow-icon" aria-hidden="true">ℹ️</span>
          <p class="stock-overflow-text" v-html="stockOverflow.message"></p>
        </div>
      </div>

      <!-- MODO DE PERSONALIZACIÓN (solo si quantity > 1) -->
      <div v-if="quantity > 1" class="profile-section">
        <h2 class="profile-subtitle">Modo de personalización</h2>
        <div class="mode-selector" role="radiogroup" aria-label="Modo de personalización">
          <button
            class="mode-btn"
            :class="{ active: customizationMode === 'batch' }"
            @click="customizationMode = 'batch'"
            role="radio"
            :aria-checked="customizationMode === 'batch'"
          >
            <span class="mode-icon" aria-hidden="true">📦</span>
            <span class="mode-label">Aplicar por lote</span>
            <span class="mode-desc">Todas las unidades con la misma personalización</span>
          </button>
          <button
            class="mode-btn"
            :class="{ active: customizationMode === 'individual' }"
            @click="customizationMode = 'individual'"
            role="radio"
            :aria-checked="customizationMode === 'individual'"
          >
            <span class="mode-icon" aria-hidden="true">🎨</span>
            <span class="mode-label">Personalizar individualmente</span>
            <span class="mode-desc">Cada unidad con toppings distintos</span>
          </button>
        </div>
      </div>

      <!-- NAVEGACIÓN ENTRE UNIDADES (modo individual) -->
      <div v-if="customizationMode === 'individual' && quantity > 1" class="unit-navigation" role="navigation" aria-label="Navegación entre unidades">
        <button class="unit-nav-btn" @click="prevUnit" :disabled="currentUnitIndex === 0" aria-label="Unidad anterior">
          ← Anterior
        </button>
        <span class="unit-nav-label" aria-live="polite">Unidad {{ currentUnitIndex + 1 }} de {{ totalUnits }}</span>
        <button class="unit-nav-btn" @click="nextUnit" :disabled="currentUnitIndex >= totalUnits - 1" aria-label="Siguiente unidad">
          Siguiente →
        </button>
      </div>

      <!-- EVITAR INGREDIENTE -->
      <div class="profile-section">
        <h2 class="profile-subtitle">¿Evitar algún ingrediente?</h2>
        <BaseInput
          v-if="customizationMode === 'batch'"
          v-model="batchIngredient"
          placeholder="Ej: Naranja, nueces…"
          aria-label="Ingrediente a evitar"
        />
        <BaseInput
          v-else
          :model-value="currentUnit.ingredient"
          @update:model-value="currentUnit.ingredient = $event"
          placeholder="Ej: Naranja, nueces…"
          aria-label="Ingrediente a evitar"
        />
      </div>

      <!-- TOPPINGS -->
      <div class="profile-section toppings-section">
        <div class="section-header">
          <h2 class="profile-subtitle">Personaliza tu torta</h2>
          <span class="section-note">Hasta {{ MAX_TOPPINGS }} por tipo</span>
        </div>

        <!-- FRUTAS -->
        <div class="topping-group">
          <div class="topping-group-header">
            <span class="topping-group-icon" aria-hidden="true">🍓</span>
            <span class="topping-group-label">Frutillas</span>
            <span class="topping-group-price">+S/5 c/u</span>
          </div>

          <div class="topping-chips-row">
            <div
              v-for="topping in (customizationMode === 'batch' ? batchFruitToppings : currentUnit.fruitToppings).filter(t => t.value)"
              :key="topping.id"
              class="topping-chip selected"
            >
              <span>{{ topping.value }}</span>
              <button
                class="topping-chip-remove"
                @click="removeTopping(customizationMode === 'batch' ? batchFruitToppings : currentUnit.fruitToppings, topping.id)"
                :aria-label="`Quitar ${topping.value}`"
              >×</button>
            </div>

            <button
              v-if="(customizationMode === 'batch' ? batchFruitToppings : currentUnit.fruitToppings).filter(t => t.value).length < MAX_TOPPINGS"
              class="topping-add-btn"
              @click="openModal(
                customizationMode === 'batch' ? batchFruitToppings : currentUnit.fruitToppings,
                (customizationMode === 'batch' ? batchFruitToppings : currentUnit.fruitToppings).find(t => !t.value)?.id ?? -1,
                fruitOptions, '+S/5', 'Frutilla'
              )"
              :aria-label="'Agregar frutilla'"
            >
              <span class="add-icon" aria-hidden="true">+</span>
              <span>Agregar frutilla</span>
            </button>
          </div>
        </div>

        <!-- RELLENOS -->
        <div class="topping-group">
          <div class="topping-group-header">
            <span class="topping-group-icon" aria-hidden="true">🍫</span>
            <span class="topping-group-label">Rellenos extra</span>
            <span class="topping-group-price">+S/8 c/u</span>
          </div>

          <div class="topping-chips-row">
            <div
              v-for="topping in (customizationMode === 'batch' ? batchCreamToppings : currentUnit.creamToppings).filter(t => t.value)"
              :key="topping.id"
              class="topping-chip selected"
            >
              <span>{{ topping.value }}</span>
              <button
                class="topping-chip-remove"
                @click="removeTopping(customizationMode === 'batch' ? batchCreamToppings : currentUnit.creamToppings, topping.id)"
                :aria-label="`Quitar ${topping.value}`"
              >×</button>
            </div>

            <button
              v-if="(customizationMode === 'batch' ? batchCreamToppings : currentUnit.creamToppings).filter(t => t.value).length < MAX_TOPPINGS"
              class="topping-add-btn"
              @click="openModal(
                customizationMode === 'batch' ? batchCreamToppings : currentUnit.creamToppings,
                (customizationMode === 'batch' ? batchCreamToppings : currentUnit.creamToppings).find(t => !t.value)?.id ?? -1,
                creamOptions, '+S/8', 'Relleno'
              )"
              :aria-label="'Agregar relleno'"
            >
              <span class="add-icon" aria-hidden="true">+</span>
              <span>Agregar relleno</span>
            </button>
          </div>
        </div>

        <!-- MENSAJE -->
        <div class="topping-group">
          <div class="topping-group-header">
            <span class="topping-group-icon" aria-hidden="true">💌</span>
            <span class="topping-group-label">Mensaje en la torta</span>
            <span class="topping-group-price">+S/2</span>
          </div>
          <BaseInput
            v-if="customizationMode === 'batch'"
            v-model="batchMessage"
            placeholder="Ej: ¡Feliz cumpleaños!"
            aria-label="Mensaje para la torta"
          />
          <BaseInput
            v-else
            :model-value="currentUnit.message"
            @update:model-value="currentUnit.message = $event"
            placeholder="Ej: ¡Feliz cumpleaños!"
            aria-label="Mensaje para la torta"
          />
        </div>
      </div>

      <!-- RESUMEN DINÁMICO -->
      <div class="summary-card" aria-label="Resumen del pedido">
        <div class="summary-row">
          <span>Tamaño</span>
          <strong>{{ selectedSize }} — S/{{ selectedSizePrice }}</strong>
        </div>
        <div class="summary-row">
          <span>Cantidad</span>
          <strong>× {{ quantity }}</strong>
        </div>
        <div class="summary-row">
          <span>Subtotal base</span>
          <strong>S/{{ (selectedSizePrice * quantity).toFixed(2) }}</strong>
        </div>
        <div v-if="hasAnyTopping" class="summary-row">
          <span>Costo adicional toppings</span>
          <strong>+S/{{ totalToppingsPrice.toFixed(2) }}</strong>
        </div>
        <div class="summary-divider" role="separator" />
        <div class="summary-row summary-total">
          <span>Precio final</span>
          <strong class="total-price">S/{{ totalPrice.toFixed(2) }}</strong>
        </div>
      </div>

      <!-- CTA -->
      <div class="profile-footer">
        <p class="footer-note">🔒 Pago seguro · Entrega garantizada</p>
        <BaseButton
          class="profile-button"
          :class="{ 'btn-added': addedToCart }"
          @click="addToCart"
          :aria-label="addedToCart ? 'Producto agregado al carrito' : 'Agregar al carrito'"
        >
          <span v-if="!addedToCart">🛒 Agregar al carrito</span>
          <span v-else>✅ ¡Agregado!</span>
        </BaseButton>
      </div>
    </div><!-- /profile-content -->
  </main>

  <!-- ══════════════ MODAL DE SELECCIÓN ══════════════ -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false" role="presentation">
        <div class="modal-sheet" role="dialog" aria-modal="true" :aria-label="`Elige ${modalTarget?.label || 'opción'}`">
          <div class="modal-header">
            <h3 class="modal-title">
              Elige {{ modalTarget?.label }}
              <span class="modal-price">{{ modalTarget?.extra }}</span>
            </h3>
            <button class="modal-close" @click="modalOpen = false" aria-label="Cerrar">×</button>
          </div>

          <div class="modal-options">
            <button
              v-for="opt in modalTarget?.options"
              :key="opt"
              class="modal-option"
              :class="{ disabled: usedOptions.has(opt) }"
              :disabled="usedOptions.has(opt)"
              @click="selectFromModal(opt)"
              :aria-label="`Seleccionar ${opt}${usedOptions.has(opt) ? ' (ya agregado)' : ''}`"
            >
              <span class="option-name">{{ opt }}</span>
              <span v-if="usedOptions.has(opt)" class="option-badge">Ya agregado</span>
              <span v-else class="option-check" aria-hidden="true">+</span>
            </button>
          </div>

          <button class="modal-cancel" @click="modalOpen = false">Cancelar</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   LAYOUT — CRÍTICO: scoped para mantener responsive intacto
   ═══════════════════════════════════════════════════════════ */
.product-profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .product-profile {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px 16px;
  }
}

/* ═══════════════════════════════════════════════════════════
   GALERÍA — aspect-ratio fijo para CLS
   ═══════════════════════════════════════════════════════════ */
.profile-gallery {
  position: sticky;
  top: 100px;
  z-index: 1;
}

.profile-image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: var(--color-bg-soft, #fff5f9);
  aspect-ratio: 1;
  width: 100%;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.profile-image-wrapper:hover .profile-image {
  transform: scale(1.04);
}

.profile-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--primary, #c05080);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.profile-fav {
  position: absolute;
  top: 14px;
  right: 14px;
}

.image-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: rgba(255,255,255,0.85);
  background: rgba(0,0,0,0.35);
  padding: 4px 12px;
  border-radius: 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.profile-image-wrapper:hover .image-hint {
  opacity: 1;
}

.thumbs-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.thumb-btn {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
  background: none;
  padding: 0;
  aspect-ratio: 1;
}

.thumb-btn.active {
  border-color: var(--primary, #c05080);
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ═══════════════════════════════════════════════════════════
   CONTENIDO
   ═══════════════════════════════════════════════════════════ */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ═══════════════════════════════════════════════════════════
   TITULOS
   ═══════════════════════════════════════════════════════════ */
.profile-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-dark, #4a0028);
  line-height: 1.2;
  margin-bottom: 10px;
}

.profile-description {
  font-size: 0.95rem;
  color: var(--text-muted, #666);
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════════
   SECCIONES
   ═══════════════════════════════════════════════════════════ */
.profile-section {
  border-top: 1px solid #f1e3ea;
  padding-top: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.profile-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-dark, #4a0028);
}

.section-note {
  font-size: 0.78rem;
  color: #999;
}

/* ═══════════════════════════════════════════════════════════
   TAMAÑOS
   ═══════════════════════════════════════════════════════════ */
.sizes-grid {
  display: flex;
  gap: 12px;
}

.size-chip {
  flex: 1;
  position: relative;
  border: 2px solid #eee;
  background: white;
  border-radius: 18px;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-chip:hover {
  border-color: var(--primary, #c05080);
}

.size-chip.active {
  border-color: var(--primary, #c05080);
  background: #fff2f7;
}

.size-chip.popular {
  border-color: var(--primary, #c05080);
}

.popular-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary, #c05080);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.size-name {
  font-size: 0.9rem;
  font-weight: 700;
}

.size-detail {
  font-size: 0.72rem;
  color: #999;
}

.size-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary, #c05080);
}

/* ═══════════════════════════════════════════════════════════
   TOPPINGS
   ═══════════════════════════════════════════════════════════ */
.toppings-section {
  display: flex;
  flex-direction: column;
}

.topping-group {
  padding: 18px 0;
  border-bottom: 1px dashed #f0dbe6;
}

.topping-group:last-child {
  border-bottom: none;
}

.topping-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.topping-group-icon {
  font-size: 1.2rem;
}

.topping-group-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--primary-dark, #4a0028);
  flex: 1;
}

.topping-group-price {
  font-size: 0.75rem;
  color: var(--primary, #c05080);
  background: #fff0f5;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
}

/* Chips */
.topping-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topping-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--primary, #c05080);
  color: white;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 600;
}

.topping-chip-remove {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* BOTÓN AGREGAR */
.topping-add-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 2px dashed var(--primary, #c05080);
  background: #fff5f9;
  color: var(--primary, #c05080);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topping-add-btn:hover {
  background: #ffe3ef;
  transform: scale(1.03);
}

.add-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary, #c05080);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

/* ═══════════════════════════════════════════════════════════
   CANTIDAD
   ═══════════════════════════════════════════════════════════ */
.quantity-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
}

.qty-btn {
  width: 46px;
  height: 46px;
  border: none;
  background: white;
  font-size: 1.3rem;
  color: var(--primary, #c05080);
  cursor: pointer;
}

.qty-number {
  min-width: 46px;
  text-align: center;
  font-weight: 700;
}

/* ═══════════════════════════════════════════════════════════
   RESUMEN
   ═══════════════════════════════════════════════════════════ */
.summary-card {
  background: #faf5f8;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.92rem;
}

.summary-divider {
  height: 1px;
  background: #ead5df;
}

.summary-total {
  font-size: 1rem;
  font-weight: 700;
}

.total-price {
  color: var(--primary, #c05080);
  font-size: 1.4rem;
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
.profile-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-note {
  text-align: center;
  color: #999;
  font-size: 0.8rem;
}

.profile-button {
  width: 100%;
}

/* ═══════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-sheet {
  position: relative;
  z-index: 100000;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  animation: modalUp .25s ease;
}

@keyframes modalUp {
  from { transform: translateY(25px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-price {
  font-size: 0.75rem;
  background: #fff0f5;
  color: var(--primary, #c05080);
  padding: 4px 10px;
  border-radius: 999px;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #f4f4f4;
  cursor: pointer;
  font-size: 1.2rem;
}

/* Opciones */
.modal-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-option {
  border: none;
  background: #fff5f9;
  padding: 18px 16px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-option:hover:not(.disabled) {
  transform: translateY(-2px);
  background: #ffe3ef;
}

.modal-option.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.option-name {
  font-weight: 600;
}

.option-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary, #c05080);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-badge {
  font-size: 0.72rem;
  background: #eee;
  padding: 4px 8px;
  border-radius: 999px;
}

.modal-cancel {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-weight: 600;
}

/* ═══════════════════════════════════════════════════════════
   TRANSICIÓN
   ═══════════════════════════════════════════════════════════ */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .25s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE — scoped para no romper layout
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .profile-gallery {
    position: relative;
    top: unset;
  }

  .sizes-grid {
    flex-direction: column;
  }

  .modal-options {
    grid-template-columns: 1fr;
  }

  .modal-sheet {
    padding: 22px;
    border-radius: 24px;
  }
}
</style>