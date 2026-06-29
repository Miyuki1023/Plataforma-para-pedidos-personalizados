
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { apiService } from '../modules/service/api.service'

import CartProductCard from '../components/molecules/CartProductCard.vue'
import DeliveryCard from '../components/molecules/DeliveryCard.vue'
import PurchaseSummary from '../components/molecules/PurchaseSummary.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

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
const subtotal     = computed(() => cartItems.value.reduce((a, i) => a + i.price * i.quantity, 0))
const deliveryPrice = 10
const total        = computed(() => subtotal.value + deliveryPrice)

/* ── MODAL PAGO ── */
const orderHistoryKey = 'orderHistory'
interface Order {
  id: string
  date: string
  items: any[]
  subtotal: number
  delivery: number
  total: number
  method: string
  code: string
  address: string
  receipt: string
}

const lastOrder = ref<Order | null>(null)
const showPayModal   = ref(false)
const payMethod      = ref<'yape' | 'plin' | null>(null)
const yapeCode       = ref('')
const payLoading     = ref(false)
const paySuccess     = ref(false)
const payError       = ref('')

const formatCurrency = (value: number) =>
  value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

const saveOrder = (order: Order) => {
  const current = JSON.parse(localStorage.getItem(orderHistoryKey) || '[]')
  current.unshift(order)
  localStorage.setItem(orderHistoryKey, JSON.stringify(current))
}

const generateReceiptText = (order: Order) => {
  const lines = [
    'BOLETA DE COMPRA - Vainilla y Miel',
    '----------------------------------------',
    `Pedido: ${order.id}`,
    `Fecha: ${order.date}`,
    `Método: ${order.method}`,
    `Código: ${order.code}`,
    `Dirección / día: ${order.address}`,
    '----------------------------------------',
    'Productos:'
  ]

  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} x${item.quantity || 1} - S/ ${formatCurrency(item.price)}`
    )
  })

  lines.push('----------------------------------------')
  lines.push(`Subtotal: S/ ${formatCurrency(order.subtotal)}`)
  lines.push(`Envío: S/ ${formatCurrency(order.delivery)}`)
  lines.push(`Total: S/ ${formatCurrency(order.total)}`)
  lines.push('Gracias por tu compra. Disfruta tu postre!')

  return lines.join('\n')
}

const normalizePayCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/\D/g, '').slice(0, 4)
  yapeCode.value = input.value
}

const openPayModal = () => {
  if (cartItems.value.length === 0) return
  showPayModal.value = true
  payMethod.value    = null
  yapeCode.value     = ''
  payError.value     = ''
  paySuccess.value   = false
  lastOrder.value    = null
}

const closePayModal = () => {
  if (payLoading.value) return
  showPayModal.value = false
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
    payError.value = 'Ingresa el código de 4 dígitos.'
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
    const orderDate = new Date().toLocaleString('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    const order: Order = {
      id: String(orderId),
      date: orderDate,
      items: [...cartItems.value],
      subtotal: subtotal.value,
      delivery: deliveryPrice,
      total: total.value,
      method: payMethod.value,
      code: yapeCode.value,
      address: `${selectedDay.value} · ${selectedSchedule.value}`,
      receipt: ''
    }

    order.receipt = generateReceiptText(order)
    saveOrder(order)
    lastOrder.value = order
    paySuccess.value = true
    localStorage.removeItem('cartProduct')
    cartItems.value  = []

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
          Revisa tu galería curada de repostería artesanal
          antes de que comience el horneado final.
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

  <!-- ══════════════════════════════════
       MODAL DE PAGO
  ══════════════════════════════════ -->
  <Teleport to="body">
    <div
      v-if="showPayModal"
      class="pay-overlay"
      @click.self="closePayModal"
    >
      <div class="pay-modal">

        <!-- CLOSE -->
        <button class="pay-close" @click="closePayModal" :disabled="payLoading">×</button>

        <!-- SUCCESS -->
        <template v-if="paySuccess">
          <div class="pay-success-icon">🎉</div>
          <h3 class="pay-title">¡Pedido confirmado!</h3>
          <p class="pay-subtitle">Tu pedido fue procesado correctamente. Lo recibirás el <strong>{{ selectedDay }}</strong> en el horario seleccionado.</p>
          <button class="pay-action-btn pay-action-btn--success" @click="closePayModal">Cerrar</button>
        </template>

        <template v-else>
          <!-- HEADER -->
          <div class="pay-header">
            <div class="pay-icon">💳</div>
            <h3 class="pay-title">Elige cómo pagar</h3>
            <p class="pay-subtitle">Selecciona tu billetera digital y sigue los pasos.</p>
          </div>

          <!-- MÉTODOS -->
          <div class="pay-methods">
            <button
              class="pay-method-btn"
              :class="{ active: payMethod === 'yape' }"
              @click="payMethod = 'yape'"
            >
              <span class="pay-method-logo yape-logo">Y</span>
              <span>Yape</span>
            </button>

            <button
              class="pay-method-btn"
              :class="{ active: payMethod === 'plin' }"
              @click="payMethod = 'plin'"
            >
              <span class="pay-method-logo plin-logo">P</span>
              <span>Plin</span>
            </button>
          </div>

          <!-- INSTRUCCIONES + CÓDIGO -->
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
              />
              <p class="pay-code-hint">El monto se descontará automáticamente desde tu cuenta.</p>
            </div>
          </div>

          <p v-if="payError" class="pay-error">{{ payError }}</p>

          <!-- BOTÓN -->
          <button
            class="pay-action-btn"
            :disabled="payLoading"
            @click="confirmPay"
          >
            <span v-if="!payLoading">Confirmar pago</span>
            <span v-else class="btn-spinner"></span>
          </button>
        </template>

      </div>
    </div>
  </Teleport>
</template>