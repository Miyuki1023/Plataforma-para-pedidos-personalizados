<script setup lang="ts">

import { ref, computed } from 'vue'

import CartProductCard from '../../molecules/CartProductCard.vue'
import DeliveryCard from '../../molecules/DeliveryCard.vue'
import PurchaseSummary from '../../molecules/PurchaseSummary.vue'
import BaseButton from '../../atoms/BaseButton.vue'

const cartItems = ref([
  {
    id: 1,

    image: new URL('../../../assets/recom1.png', import.meta.url).href,

    name: 'Torta de Primavera',

    description:
      'Torta fresca y colorida, con sabores ligeros y frutales.',

    size: 'Mediano',

    avoidIngredient: 'Naranja',

    toppings: [
      'Frutilla',
      'Crema batida'
    ],

    message: 'Feliz aniversario',

    quantity: 1,

    price: 80
  }
])

/* DELIVERY */

const selectedDay = ref('May 12')

const selectedSchedule = ref(
  'Mañana (07:00 - 09:00)'
)

/* TOTALS */

const subtotal = computed(() => {

  return cartItems.value.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  )
})

const deliveryPrice = 10

const total = computed(() => {

  return subtotal.value + deliveryPrice
})

</script>

<template>

  <section class="resume-section">

    <!-- LEFT -->
    <div class="resume-left">

      <div class="resume-header">

        <h1 class="resume-title">
          Tus elecciones
        </h1>

        <p class="resume-subtitle">
          Revisa tu galería curada de repostería artesanal
          antes de que comience el horneado final.
        </p>

      </div>

      <!-- PRODUCTS -->
      <div class="cart-products">

        <CartProductCard
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
        />

      </div>

    </div>

    <!-- RIGHT -->
    <div class="resume-right">

      <DeliveryCard
        v-model:day="selectedDay"
        v-model:schedule="selectedSchedule"
      />

      <PurchaseSummary
        :subtotal="subtotal"
        :delivery="deliveryPrice"
        :total="total"
      />

      <BaseButton class="finish-btn">
        Finalizar pedido
      </BaseButton>

    </div>

  </section>

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

.finish-btn {

  width: 100%;
}

@media (max-width: 1100px) {

  .resume-section {

    grid-template-columns: 1fr;
  }

  .resume-right {

    position: static;
  }
}

@media (max-width: 768px) {

  .resume-section {

    padding: 2rem 1rem;
  }
}

</style>