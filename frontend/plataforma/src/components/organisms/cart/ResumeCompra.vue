
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { apiService } from '../../../lib/api.ts'

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
const router = useRouter()
const cartItems = ref<any[]>([])

/* ── CARGAR CARRITO ── */
onMounted(() => {
  const savedProduct = localStorage.getItem('cartProduct')
  if (savedProduct) {
    cartItems.value = [JSON.parse(savedProduct)]
  }
})

/* ── ENTREGA ── */
const selectedDay      = ref('')
const selectedSchedule = ref('Mañana (07:00 - 09:00)')
const selectedAddressId = ref<number | null>(null)

/* ── CANTIDADES ── */
const increaseQty = (id: number) => {
  const p = cartItems.value.find(i => i.id === id)
  if (p) p.quantity++
}
const decreaseQty = (id: number) => {
  const p = cartItems.value.find(i => i.id === id)
  if (p && p.quantity > 1) p.quantity--
}
const removeProduct = (id: number) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
  localStorage.removeItem('cartProduct')
}

/* ── TOTALES ── */
const subtotal      = computed(() => cartItems.value.reduce((a, i) => a + (i.price || 0) * (i.quantity || 1), 0))
const deliveryPrice = 10
const total         = computed(() => subtotal.value + deliveryPrice)

const clientName = computed(() => {
  return authStore.user?.nombre || authStore.user?.name || 'Invitado'
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
    `Subtotal: ${formatCurrency(subtotal.value)}`,
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
  if (cartItems.value.length === 0) return
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
      items: cartItems.value.map((item: any) => ({
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
      items: cartItems.value.map((item: any) => ({
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
    localStorage.removeItem('cartProduct')
    cartItems.value = []

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

      <div class="cart-products">
        <CartProductCard
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @increase="increaseQty(item.id)"
          @decrease="decreaseQty(item.id)"
          @remove="removeProduct(item.id)"
        />
      </div>
    </div>

    <!-- RIGHT -->
    <div class="resume-right">
      <DeliveryCard
        v-model:day="selectedDay"
        v-model:schedule="selectedSchedule"
        @update:addressId="selectedAddressId = $event"
      />

      <PurchaseSummary
        :subtotal="subtotal"
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
