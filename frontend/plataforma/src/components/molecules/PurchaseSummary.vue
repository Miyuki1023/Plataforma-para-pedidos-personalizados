<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../../stores/cart'

const cart = useCartStore()

const savings = computed(() => cart.savings)
const freeShippingProgress = computed(() => cart.freeShippingProgress)
const freeShippingRemaining = computed(() => cart.freeShippingRemaining)
</script>

<template>
  <div class="purchase-summary-card">
    <h3 class="summary-title">Resumen de compra</h3>

    <!-- Free shipping progress -->
    <div class="free-shipping-bar" v-if="freeShippingRemaining > 0">
      <div class="shipping-progress-text">
        🚚 Te faltan <strong>S/{{ freeShippingRemaining.toFixed(2) }}</strong> para envío gratis
      </div>
      <div class="shipping-progress-track">
        <div class="shipping-progress-fill" :style="{ width: freeShippingProgress + '%' }"></div>
      </div>
    </div>
    <div class="free-shipping-achieved" v-else>
      🎉 ¡Envío gratis!
    </div>

    <div class="summary-rows">
      <div class="summary-row">
        <span>Subtotal</span>
        <span class="summary-value">S/{{ cart.subtotal.toFixed(2) }}</span>
      </div>

      <div class="summary-row" v-if="savings > 0">
        <span class="savings-label">💸 Ahorro</span>
        <span class="savings-value">-S/{{ savings.toFixed(2) }}</span>
      </div>

      <div class="summary-row">
        <span>Envío</span>
        <span :class="['summary-value', { 'free-delivery': cart.deliveryPrice === 0 }]">
          {{ cart.deliveryPrice === 0 ? 'Gratis' : 'S/' + cart.deliveryPrice.toFixed(2) }}
        </span>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-row summary-total">
        <span class="total-label">Total</span>
        <span class="total-value">S/{{ cart.total.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.purchase-summary-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 1rem;
}

.free-shipping-bar {
  background: #f0f8f0;
  border-radius: var(--radius-md);
  padding: 0.8rem;
  margin-bottom: 1rem;
}
.shipping-progress-text {
  font-size: 0.8rem;
  color: #2d6a2d;
  margin-bottom: 0.5rem;
}
.shipping-progress-track {
  height: 6px;
  background: #d4e8d4;
  border-radius: var(--radius-full);
  overflow: hidden;
}
.shipping-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #2e7d32);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}
.free-shipping-achieved {
  background: #e8f5e9;
  border-radius: var(--radius-md);
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2e7d32;
  text-align: center;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text);
}

.summary-value {
  font-weight: 700;
  color: var(--text-h);
}
.free-delivery {
  color: var(--success);
}

.savings-label { color: var(--success); }
.savings-value { color: var(--success); font-weight: 700; }

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 0.2rem 0;
}

.summary-total {
  font-size: 1rem;
}
.total-label {
  font-weight: 700;
  color: var(--text-h);
}
.total-value {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--primary);
}
</style>