<!-- molecules/CartProductCard.vue -->

<script setup lang="ts">

import { ref } from 'vue'

const props = defineProps<{
  item: any
}>()

const quantity = ref(props.item.quantity)

const increase = () => {
  quantity.value++
}

const decrease = () => {

  if (quantity.value > 1) {
    quantity.value--
  }
}

</script>

<template>

  <article class="cart-card">

    <!-- IMAGE -->
    <img
      :src="item.image"
      :alt="item.name"
      class="cart-image"
    />

    <!-- INFO -->
    <div class="cart-info">

      <div class="cart-top">

        <div>

          <h2 class="cart-name">
            {{ item.name }}
          </h2>

          <p class="cart-desc">
            {{ item.description }}
          </p>

        </div>

        <h3 class="cart-price">
          S/{{ item.price }}
        </h3>

      </div>

      <!-- TAGS -->
      <div class="cart-tags">

        <span class="tag">
          {{ item.size }}
        </span>

        <span
          v-if="item.avoidIngredient"
          class="tag soft"
        >
          Sin {{ item.avoidIngredient }}
        </span>

      </div>

      <!-- TOPPINGS -->
      <div class="extra-list">

        <span
          v-for="top in item.toppings"
          :key="top"
        >
          + {{ top }}
        </span>

      </div>

      <!-- MESSAGE -->
      <p
        v-if="item.message"
        class="cake-message"
      >
        “{{ item.message }}”
      </p>

      <!-- ACTIONS -->
      <div class="cart-actions">

        <div class="qty-box">

          <button @click="decrease">
            −
          </button>

          <span>
            {{ quantity }}
          </span>

          <button @click="increase">
            +
          </button>

        </div>

        <button class="remove-btn">
          Quitar
        </button>

      </div>

    </div>

  </article>

</template>

<style scoped>

.cart-card {

  display: flex;

  gap: 1.5rem;

  padding: 1rem;

  border-radius: 1.6rem;

  border: 1px solid #ead8c8;

  background: white;

  box-shadow: 0 10px 25px rgba(0,0,0,.04);
}

.cart-image {

  width: 160px;

  height: 160px;

  object-fit: cover;

  border-radius: 1.2rem;
}

.cart-info {

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 1rem;
}

.cart-top {

  display: flex;

  justify-content: space-between;

  gap: 1rem;
}

.cart-name {

  font-size: 1.5rem;

  font-weight: 800;

  color: #2f2f2f;
}

.cart-desc {

  margin-top: .4rem;

  color: #666;

  line-height: 1.5;

  max-width: 360px;
}

.cart-price {

  color: #8b3134;

  font-size: 2rem;

  font-weight: 900;
}

.cart-tags {

  display: flex;

  flex-wrap: wrap;

  gap: .7rem;
}

.tag {

  padding: .55rem 1rem;

  border-radius: 999px;

  background: #f7e6cf;

  color: #8b3134;

  font-weight: 700;

  font-size: .9rem;
}

.tag.soft {

  background: #fff3ef;
}

.extra-list {

  display: flex;

  gap: .7rem;

  flex-wrap: wrap;

  color: #777;

  font-size: .95rem;
}

.cake-message {

  font-style: italic;

  color: #8b3134;
}

.cart-actions {

  margin-top: auto;

  display: flex;

  justify-content: space-between;

  align-items: center;
}

.qty-box {

  display: flex;

  align-items: center;

  gap: 1rem;

  border: 1px solid #e6cfc1;

  border-radius: 999px;

  padding: .5rem 1rem;
}

.qty-box button {

  border: none;

  background: transparent;

  cursor: pointer;

  font-size: 1.2rem;

  color: #8b3134;
}

.remove-btn {

  border: none;

  background: transparent;

  color: #c14b4b;

  cursor: pointer;

  font-weight: 700;
}

@media (max-width: 768px) {

  .cart-card {

    flex-direction: column;
  }

  .cart-image {

    width: 100%;

    height: 260px;
  }

  .cart-top {

    flex-direction: column;
  }

  .cart-actions {

    flex-direction: column;

    align-items: flex-start;

    gap: 1rem;
  }
}

</style>