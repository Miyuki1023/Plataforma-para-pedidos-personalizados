
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import CartProductCard from '../components/molecules/CartProductCard.vue'
import DeliveryCard from '../components/molecules/DeliveryCard.vue'
import PurchaseSummary from '../components/molecules/PurchaseSummary.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

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

const confirmPay = async () => {
  payError.value = ''
  if (!payMethod.value) {
    payError.value = 'Selecciona un método de pago.'
    return
  }
  if (yapeCode.value.length !== 4) {
    payError.value = 'Ingresa el código de 4 dígitos.'
    return
  }
  payLoading.value = true
  try {
    // Aquí iría la llamada real al endpoint de pagos:
    // await apiService.post('/payments/process', {
    //   method: payMethod.value,
    //   code: yapeCode.value,
    //   orderId: ...,
    //   addressId: selectedAddressId.value
    // })
    await new Promise(r => setTimeout(r, 1800)) // simulación
    paySuccess.value = true
    localStorage.removeItem('cartProduct')
    cartItems.value  = []
  } catch {
    payError.value = 'No se pudo procesar el pago. Intenta de nuevo.'
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
                v-model="yapeCode"
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

<style scoped>
.resume-section {
  display: grid;
  grid-template-columns: 1.4fr .8fr;
  gap: 3rem;
  padding: 4rem 6%;
  background: #fdfaf7;
}

.resume-left {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.resume-header {
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

.resume-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #1f1f1f;
}

.resume-subtitle {
  max-width: 520px;
  line-height: 1.7;
  color: #666;
}

.resume-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 120px;
  height: fit-content;
}

.finish-btn { width: 100%; }

@media (max-width: 1100px) {
  .resume-section { grid-template-columns: 1fr; }
  .resume-right   { position: static; }
}
@media (max-width: 768px) {
  .resume-section { padding: 2rem 1rem; }
}

/* ════════════════════════
   MODAL DE PAGO
════════════════════════ */
.pay-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.48);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1rem;
}

.pay-modal {
  width: min(92%, 420px);
  background: white;
  border-radius: 28px;
  padding: 2.2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  animation: modalPop .3s cubic-bezier(.34,1.56,.64,1);
  box-shadow: 0 30px 60px rgba(0,0,0,.18);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(.88) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.pay-close {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  border: none;
  background: none;
  font-size: 1.7rem;
  cursor: pointer;
  color: #999;
  transition: color .2s;
}
.pay-close:hover { color: #333; }
.pay-close:disabled { opacity: .4; cursor: not-allowed; }

/* HEADER */
.pay-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: .5rem;
}

.pay-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #8b3134, #c94752);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: .3rem;
}

.pay-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2f2f2f;
  margin: 0;
}

.pay-subtitle {
  font-size: .9rem;
  color: #857871;
  line-height: 1.55;
  margin: 0;
  max-width: 300px;
}

/* MÉTODOS */
.pay-methods {
  display: flex;
  gap: .9rem;
}

.pay-method-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .55rem;
  padding: 1.1rem .8rem;
  border: 2px solid #ead8c8;
  border-radius: 16px;
  background: #fdf8f5;
  cursor: pointer;
  font-weight: 700;
  font-size: .9rem;
  color: #2f2f2f;
  transition: .22s ease;
}

.pay-method-btn.active {
  border-color: #8b3134;
  background: rgba(139,49,52,.05);
  box-shadow: 0 8px 20px rgba(139,49,52,.1);
}

.pay-method-btn:hover:not(.active) {
  border-color: #c9a8a8;
  transform: translateY(-2px);
}

.pay-method-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 900;
  color: white;
}

.yape-logo { background: linear-gradient(135deg, #6c1bc4, #9b3af0); }
.plin-logo  { background: linear-gradient(135deg, #0081c8, #00b4d8); }

/* PASOS */
.pay-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeDown .25s ease;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pay-instructions {
  margin: 0;
  padding: 0 0 0 1.2rem;
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.pay-instructions li {
  font-size: .88rem;
  color: #5a4a4a;
  line-height: 1.5;
}

/* CÓDIGO */
.pay-code-wrapper {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.pay-code-label {
  font-size: .82rem;
  font-weight: 700;
  color: #8b3134;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.pay-code-input {
  width: 100%;
  text-align: center;
  letter-spacing: 12px;
  font-size: 2rem;
  font-weight: 900;
  padding: .9rem;
  border: 2px solid #ead8c8;
  border-radius: 14px;
  outline: none;
  background: #fdf8f5;
  color: #2f2f2f;
  transition: border-color .2s;
}

.pay-code-input:focus { border-color: #8b3134; }

.pay-code-hint {
  font-size: .75rem;
  color: #9a8880;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* ERROR */
.pay-error {
  font-size: .84rem;
  color: #c0392b;
  text-align: center;
  margin: 0;
  font-weight: 600;
}

/* BOTÓN PRINCIPAL */
.pay-action-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 14px;
  background: #8b3134;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: .22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.pay-action-btn:hover:not(:disabled) {
  background: #721f22;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(139,49,52,.2);
}

.pay-action-btn:disabled { opacity: .6; cursor: not-allowed; }

.pay-action-btn--success { background: #2e7d32; }
.pay-action-btn--success:hover:not(:disabled) {
  background: #1b5e20;
  box-shadow: 0 10px 22px rgba(46,125,50,.2);
}

/* SUCCESS */
.pay-success-icon {
  font-size: 3.5rem;
  text-align: center;
}

/* SPINNER */
.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>