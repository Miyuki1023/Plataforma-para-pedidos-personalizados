<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { useCartStore } from '../../../stores/cart'
import { apiService } from '../../../lib/api'

import CartProductCard from '../../molecules/CartProductCard.vue'
import DeliveryCard from '../../molecules/DeliveryCard.vue'
import PurchaseSummary from '../../molecules/PurchaseSummary.vue'
import BaseButton from '../../atoms/BaseButton.vue'

interface OrderItem {
  id: string | number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  title: string
  client?: string
  date: string
  status: string
  total: number
  paymentMethod?: string
  paymentCode?: string
  delivery?: string
  receipt: string
  items: OrderItem[]
}

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

/* ── ENTREGA ── */
const selectedDay      = ref('')
const selectedSchedule = ref('Mañana (07:00 - 09:00)')
const selectedAddressId = ref<number | null>(null)

/* ── CANTIDADES ── */
const increaseQty = (id: string | number) => {
  cartStore.updateQuantity(id, (cartStore.items.find(i => i.id === id)?.quantity || 1) + 1)
}
const decreaseQty = (id: string | number) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(id, item.quantity - 1)
  }
}
const removeProduct = (id: string | number) => {
  cartStore.removeItem(id)
}

/* ── TOTALES ── */
const deliveryPrice = 10
const total = computed(() => cartStore.subtotal + deliveryPrice)

const clientName = computed(() => {
  return authStore.user?.usuario || authStore.user?.name || 'Invitado'
})

const orderHistoryKey = 'orderHistory'
const loadOrderHistory = (): Order[] => JSON.parse(localStorage.getItem(orderHistoryKey) || '[]')
const saveOrder = (order: Order) => {
  const history = loadOrderHistory()
  localStorage.setItem(orderHistoryKey, JSON.stringify([order, ...history]))
}

const formatCurrency = (value: number) => `S/ ${value.toFixed(2)}`

const buildReceipt = (order: Order) => {
  const items = order.items
    .map(i => `${i.quantity} x ${i.name} - ${formatCurrency(i.price)} = ${formatCurrency(i.price * i.quantity)}`)
    .join('\n')

  return [
    '=== BOLETA DE COMPRA ===',
    `Cliente: ${order.client ?? 'Invitado'}`,
    `Fecha: ${order.date}`,
    `Método de pago: ${order.paymentMethod ?? 'Desconocido'}`,
    `Código de pago: ${order.paymentCode ?? '----'}`,
    `Entrega: ${order.delivery ?? 'No especificada'}`,
    '-----------------------------',
    'Productos:',
    items,
    '-----------------------------',
    `Subtotal: ${formatCurrency(cartStore.subtotal)}`,
    `Costo de envío: ${formatCurrency(deliveryPrice)}`,
    `Total: ${formatCurrency(order.total)}`,
    '¡Gracias por tu compra!'
  ].join('\n')
}

/* ── MODAL PAGO ── */
const showPayModal   = ref(false)
const payMethod      = ref<'yape' | 'plin' | null>(null)
const yapeCode       = ref('')
const payLoading     = ref(false)
const paySuccess     = ref(false)
const payError       = ref('')

const openPayModal = () => {
  if (cartStore.items.length === 0) return
  showPayModal.value = true
  payMethod.value    = null
  yapeCode.value     = ''
  payError.value     = ''
  paySuccess.value   = false
}

const closePayModal = () => {
  if (payLoading.value) return
  showPayModal.value = false
}

const normalizePayCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/\D/g, '').slice(0, 4)
  yapeCode.value = target.value
}

const confirmPay = async () => {
  payError.value = ''
  if (!selectedDay.value) {
    payError.value = 'Selecciona la fecha de entrega antes de pagar.'
    return
  }
  if (!payMethod.value) {
    payError.value = 'Selecciona un método de pago.'
    return
  }
  if (yapeCode.value.length !== 4) {
    payError.value = 'Ingresa un código de 4 dígitos válido.'
    return
  }
  if (authStore.token && !selectedAddressId.value) {
    payError.value = 'Selecciona una dirección de envío.'
    return
  }

  payLoading.value = true
  try {
    const payload = {
      id_direccion: selectedAddressId.value || undefined,
      observaciones: `Entrega ${selectedDay.value} · ${selectedSchedule.value}`,
      metodo_pago: payMethod.value === 'yape' ? 'Yape' : 'Plin',
      codigo_pago: yapeCode.value,
      horario_entrega: selectedSchedule.value,
      costo_envio: deliveryPrice,
      items: cartStore.items.map((item: any) => ({
        producto_id: item.producto_id || item.id,
        cantidad: item.quantity || 1,
        precio_unitario: Number(item.price || item.precio || 0),
        opciones: item.toppings || item.opciones || null,
      }))
    }

    const response: any = await apiService.post('/orders', payload)
    const orderId = response?.order?.id_pedido || `PED-${Date.now()}`
    const order: Order = {
      id: String(orderId),
      title: `Boleta ${orderId}`,
      client: clientName.value,
      date: new Date().toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      status: 'Confirmado',
      total: total.value,
      paymentMethod: payMethod.value === 'yape' ? 'Yape' : 'Plin',
      paymentCode: yapeCode.value,
      delivery: `${selectedDay.value} · ${selectedSchedule.value}`,
      items: cartStore.items.map((item: any) => ({
        id: item.id,
        name: item.nombre || item.name || item.title || 'Producto',
        quantity: item.quantity || 1,
        price: item.price || 0
      })),
      receipt: ''
    }

    order.receipt = buildReceipt(order)
    saveOrder(order)

    paySuccess.value = true
    // Vaciar carrito SOLO después de confirmar la compra exitosamente
    cartStore.clearCart()

    window.setTimeout(() => {
      router.push('/home')
    }, 1100)
  } catch (error: any) {
    payError.value = error?.message || 'No se pudo procesar el pago. Intenta de nuevo.'
  } finally {
    payLoading.value = false
  }
}
</script>

<template>
  <section class="resume-section">

    <!-- LEFT -->
    <div class="resume-left">
      <div class="resume-header">
        <h1 class="resume-title">Tus elecciones</h1>
        <p class="resume-subtitle">
          Revisa tu galería curada de repostería artesanal antes de que comience el horneado final.
        </p>
      </div>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2 class="empty-cart-title">Tu carrito está vacío</h2>
        <p class="empty-cart-desc">Agrega productos desde nuestro catálogo para empezar.</p>
        <BaseButton class="empty-cart-btn" @click="router.push('/catalogo')">
          Ver catálogo
        </BaseButton>
      </div>

      <div v-else class="cart-products">
        <CartProductCard
          v-for="item in cartStore.items"
          :key="`${item.id}-${item.size}-${JSON.stringify(item.toppings)}-${item.message}`"
          :item="item"
          @increase="increaseQty(item.id)"
          @decrease="decreaseQty(item.id)"
          @remove="removeProduct(item.id)"
        />
      </div>
    </div>

    <!-- RIGHT -->
    <div v-if="cartStore.items.length > 0" class="resume-right">
      <DeliveryCard
        v-model:day="selectedDay"
        v-model:schedule="selectedSchedule"
        @update:addressId="selectedAddressId = $event"
      />

      <PurchaseSummary
        :subtotal="cartStore.subtotal"
        :delivery="deliveryPrice"
        :total="total"
      />

      <BaseButton class="finish-btn" @click="openPayModal">
        Finalizar pedido
      </BaseButton>
    </div>

  </section>

  <Teleport to="body">
    <div
      v-if="showPayModal"
      class="pay-overlay"
      @click.self="closePayModal">
      <div class="pay-modal">
        <button class="pay-close" @click="closePayModal" :disabled="payLoading">×</button>

        <template v-if="paySuccess">
          <div class="pay-success-icon">🎉</div>
          <h3 class="pay-title">¡Pedido confirmado!</h3>
          <p class="pay-subtitle">Tu pedido fue procesado correctamente. Lo recibirás el <strong>{{ selectedDay }}</strong> en el horario seleccionado.</p>
          <button class="pay-action-btn pay-action-btn--success" @click="closePayModal">Cerrar</button>
        </template>

        <template v-else>
          <div class="pay-header">
            <div class="pay-icon">💳</div>
            <h3 class="pay-title">Elige cómo pagar</h3>
            <p class="pay-subtitle">Selecciona tu billetera digital y sigue los pasos.</p>
          </div>

          <div class="pay-methods">
            <button
              class="pay-method-btn"
              :class="{ active: payMethod === 'yape' }"
              @click="payMethod = 'yape'"
              type="button"
            >
              <span class="pay-method-logo yape-logo">Y</span>
              <span>Yape</span>
            </button>

            <button
              class="pay-method-btn"
              :class="{ active: payMethod === 'plin' }"
              @click="payMethod = 'plin'"
              type="button"
            >
              <span class="pay-method-logo plin-logo">P</span>
              <span>Plin</span>
            </button>
          </div>

          <div v-if="payMethod" class="pay-steps">
            <ol class="pay-instructions">
              <li>Abre la app de <strong>{{ payMethod === 'yape' ? 'Yape' : 'Plin' }}</strong>.</li>
              <li>Ve a <em>Cobrar</em> y copia el código de <strong>4 dígitos</strong> que aparece.</li>
              <li>Pégalo aquí abajo para confirmar el pago.</li>
            </ol>

            <div class="pay-code-wrapper">
              <label class="pay-code-label">Código de {{ payMethod === 'yape' ? 'Yape' : 'Plin' }}</label>
              <input
                :value="yapeCode"
                @input="normalizePayCodeInput"
                type="text"
                maxlength="4"
                inputmode="numeric"
                class="pay-code-input"
                placeholder="0000"
                autocomplete="one-time-code"
              />
              <p class="pay-code-hint">Solo se permiten números. El código debe tener 4 dígitos.</p>
            </div>
          </div>

          <p v-if="payError" class="pay-error">{{ payError }}</p>

          <button
            class="pay-action-btn"
            :disabled="payLoading"
            @click="confirmPay"
            type="button"
          >
            <span v-if="!payLoading">Confirmar pago</span>
            <span v-else class="btn-spinner"></span>
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>


.resume-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.resume-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resume-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-h);
  margin: 0;
}

.resume-subtitle {
  font-size: 0.9rem;
  color: var(--text-soft);
  margin: 0;
}

.cart-products {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1rem;
}

.empty-cart-icon {
  font-size: 4rem;
  opacity: 0.5;
}

.empty-cart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-h);
  margin: 0;
}

.empty-cart-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 300px;
}

.empty-cart-btn {
  max-width: 200px;
}

.resume-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 100px;
  align-self: start;
}

.finish-btn {
  width: 100%;
  max-width: 100%;
}

/* ── PAY MODAL ── */
.pay-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pay-modal {
  background: white;
  border-radius: 28px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: modalUp .25s ease;
}

@keyframes modalUp {
  from { transform: translateY(25px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.pay-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #f4f4f4;
  cursor: pointer;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.pay-close:hover { background: #e8e8e8; }

.pay-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.pay-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }

.pay-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 0.3rem;
}

.pay-subtitle {
  font-size: 0.9rem;
  color: var(--text-soft);
  margin: 0;
}

.pay-methods {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pay-method-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.pay-method-btn.active {
  border-color: var(--primary);
  background: #fff0f5;
}

.pay-method-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1rem;
  color: white;
}

.yape-logo { background: #7b1fa2; }
.plin-logo { background: #1565c0; }

.pay-steps {
  margin-bottom: 1.5rem;
}

.pay-instructions {
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.8;
  padding-left: 1.2rem;
  margin: 0 0 1rem;
}

.pay-code-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pay-code-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-h);
}

.pay-code-input {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5em;
  padding: 0.8rem;
  border: 2px solid #eee;
  border-radius: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.pay-code-input:focus {
  border-color: var(--primary);
}

.pay-code-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.pay-error {
  background: #fde8e8;
  color: #c0392b;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.pay-action-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: var(--primary);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-action-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.pay-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pay-action-btn--success {
  background: var(--success);
}

.pay-success-icon {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .resume-section {
    grid-template-columns: 1fr;
  }
  .resume-right {
    position: static;
  }
}
</style>
