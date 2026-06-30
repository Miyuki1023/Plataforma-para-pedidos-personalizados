<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: any
}>()

const emit = defineEmits([
  'increase',
  'decrease',
  'remove',
  'edit'
])

const subtotal = computed(() => (props.item.price || 0) * (props.item.quantity || 1))
const hasCustomizations = computed(() =>
  props.item.toppings?.length > 0 || props.item.message || props.item.avoidIngredient
)
</script>

<template>
  <div class="cart-card animate-fadeIn">
    <div class="cart-image-wrapper">
      <img :src="item.image" :alt="item.name" class="cart-image" />
      <span v-if="hasCustomizations" class="cart-custom-badge badge badge--accent">
        Personalizado
      </span>
    </div>

    <div class="cart-content">
      <div class="cart-top">
        <div class="cart-info">
          <h3 class="cart-name">{{ item.name }}</h3>
          <p class="cart-desc">{{ item.description }}</p>
        </div>
        <div class="cart-price-block">
          <span class="cart-unit-price">S/{{ item.price }} c/u</span>
          <span class="cart-subtotal">S/{{ subtotal.toFixed(2) }}</span>
        </div>
      </div>

      <div class="cart-tags">
        <span class="tag" v-if="item.size">{{ item.size }}</span>
        <span class="tag soft" v-if="item.avoidIngredient">Sin {{ item.avoidIngredient }}</span>
      </div>

      <div v-if="item.toppings?.length" class="extra-list">
        <span v-for="top in item.toppings" :key="top" class="extra-chip">{{ top }}</span>
      </div>

      <p v-if="item.message" class="cake-message">"{{ item.message }}"</p>

      <div class="cart-actions">
        <div class="qty-box">
          <button @click="emit('decrease')" :disabled="item.quantity <= 1" class="qty-btn">−</button>
          <span class="qty-number">{{ item.quantity }}</span>
          <button @click="emit('increase')" class="qty-btn">+</button>
        </div>

        <div class="cart-action-btns">
          <button class="edit-btn" @click="emit('edit')" title="Editar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="remove-btn" @click="emit('remove')" title="Eliminar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 1.6rem;
  border: 1px solid var(--border);
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cart-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.cart-image-wrapper {
  position: relative;
  width: 140px;
  min-width: 140px;
}
.cart-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 1.2rem;
}
.cart-custom-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-size: 0.6rem;
  padding: 0.2rem 0.5rem;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-width: 0;
}

.cart-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.cart-info { flex: 1; min-width: 0; }
.cart-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 0.3rem;
}
.cart-desc {
  color: var(--text-soft);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-price-block {
  text-align: right;
  flex-shrink: 0;
}
.cart-unit-price {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.cart-subtotal {
  display: block;
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--primary);
}

.cart-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  background: #f7e6cf;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.8rem;
}
.tag.soft { background: #fff3ef; }

.extra-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.extra-chip {
  background: var(--secondary);
  color: var(--primary);
  padding: 0.25rem 0.7rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
}

.cake-message {
  font-style: italic;
  color: var(--primary);
  font-size: 0.9rem;
  margin: 0;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.qty-box {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: 0.4rem 0.8rem;
}
.qty-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--primary);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}
.qty-btn:hover:not(:disabled) { background: var(--secondary); }
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-number {
  min-width: 24px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
}

.cart-action-btns {
  display: flex;
  gap: 0.5rem;
}
.edit-btn, .remove-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--text-muted);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-btn:hover { background: var(--secondary); color: var(--primary); }
.remove-btn:hover { background: #fee; color: var(--error); }

@media (max-width: 768px) {
  .cart-card { flex-direction: column; }
  .cart-image-wrapper { width: 100%; min-width: unset; }
  .cart-image { width: 100%; height: 200px; }
  .cart-top { flex-direction: column; }
  .cart-price-block { text-align: left; }
  .cart-actions { flex-direction: column; align-items: stretch; gap: 0.8rem; }
  .qty-box { justify-content: center; }
  .cart-action-btns { justify-content: center; }
}
</style>