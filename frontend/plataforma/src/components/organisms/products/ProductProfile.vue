<script setup lang="ts">
import { ref, computed } from 'vue'

import { useRouter } from 'vue-router'

import BaseButton from '../../atoms/BaseButton.vue'
import BaseInput from '../../atoms/BaseInput.vue'
import FavoriteIcon from '../../atoms/FavoriteIcon.vue'

import ProductSizeChip from '../../atoms/ProductSizeChip.vue'
import ProductToppingSelect from '../../molecules/ProductToppingSelect.vue'

const router = useRouter()

const goToProduct = () => {

  const cartProduct = {

    id: product.id,

    image: product.image,

    name: product.name,

    description: product.description,

    size: selectedSize.value,

    avoidIngredient: ingredient.value,

    toppings: [
      fruit.value,
      cream.value
    ].filter(Boolean),

    message: message.value,

    quantity: quantity.value,

    price: totalPrice.value
  }

  localStorage.setItem(
    'cartProduct',
    JSON.stringify(cartProduct)
  )

  router.push({
    name: 'resumen-compra'
  })
}

const product = {
  id: 1,

  name: 'Torta de Primavera',

  category: 'TORTAS',

  image: new URL('../../../assets/recom1.png', import.meta.url).href,

  description:
    'Torta fresca y colorida, con sabores ligeros y frutales que evocan la temporada de primavera. Inspirada en el clásico pie de limón, combina una suave crema cítrica de limón con una base delicada y una cobertura cremosa que aporta equilibrio y dulzura.',

  price: 60,

  isNew: true
}

/* GALLERY */

const gallery = [
  new URL('../../../assets/recom1.png', import.meta.url).href,
  new URL('../../../assets/recom2.png', import.meta.url).href,
  new URL('../../../assets/recom3.png', import.meta.url).href
]

const activeImage = ref(gallery[0])

/* SIZE */

const selectedSize = ref('Pequeño')

const sizes = [
  {
    label: 'Pequeño',
    detail: '12 cm · S/60',
    price: 60
  },

  {
    label: 'Mediano',
    detail: '16 cm · S/80',
    price: 80,
    popular: true
  },

  {
    label: 'Grande',
    detail: '20 cm · S/100',
    price: 100
  }
]

/* CUSTOM */

const ingredient = ref('')
const message = ref('')

/* TOPPINGS */

const fruit = ref('')
const cream = ref('')

/* QUANTITY */

const quantity = ref(1)

const increaseQty = () => {
  quantity.value++
}

const decreaseQty = () => {

  if (quantity.value > 1) {
    quantity.value--
  }
}

/* PRICE */

const selectedSizePrice = computed(() => {

  return (
    sizes.find(
      s => s.label === selectedSize.value
    )?.price || product.price
  )
})

const toppingsPrice = computed(() => {

  let total = 0

  if (fruit.value) total += 5

  if (cream.value) total += 8

  if (message.value) total += 2

  return total
})

const totalPrice = computed(() => {

  return (
    (selectedSizePrice.value + toppingsPrice.value)
    * quantity.value
  )
})
</script>

<template>

  <section class="product-profile">

    <!-- IMAGE SIDE -->
    <div class="profile-gallery">

      <div class="profile-image-wrapper">

        <img
          :src="activeImage"
          :alt="product.name"
          class="profile-image"
        />

        <span
          v-if="product.isNew"
          class="profile-badge"
        >
          Nuevo
        </span>

        <FavoriteIcon class="profile-fav" />

      </div>

      <!-- THUMBNAILS -->
      <div class="thumbs-row">

        <button
          v-for="(img, index) in gallery"
          :key="index"
          class="thumb-btn"
          :class="{ active: activeImage === img }"
          @click="activeImage = img"
        >
          <img
            :src="img"
            class="thumb-image"
          />
        </button>

      </div>

    </div>

    <!-- INFO -->
    <div class="profile-content">

      <!-- TOP -->
      <div class="profile-top">

        <span class="profile-category">
          {{ product.category }}
        </span>

        <h1 class="profile-title">
          {{ product.name }}
        </h1>

        <!-- META -->
        <div class="profile-meta">

          <span>⭐ 4.9</span>

          <span>+120 pedidos</span>

          <span>🚚 Entrega hoy</span>

        </div>

      </div>

      <!-- DESCRIPTION -->
      <p class="profile-description">
        {{ product.description }}
      </p>

      <!-- STOCK -->
      <p class="stock-text">
        🔥 Solo quedan 4 disponibles
      </p>

      <!-- SIZE -->
      <div class="profile-section">

        <div class="section-header">

          <h3 class="profile-subtitle">
            Escoge el tamaño
          </h3>

          <span class="section-note">
            El más vendido es mediano
          </span>

        </div>

        <div class="sizes-grid">

          <div
            v-for="size in sizes"
            :key="size.label"
            class="size-wrapper"
          >

            <span
              v-if="size.popular"
              class="popular-badge"
            >
              Más pedido
            </span>

            <ProductSizeChip
              :label="size.label"
              :detail="size.detail"
              :active="selectedSize === size.label"
              @select="selectedSize = size.label"
            />

          </div>

        </div>

      </div>

      <!-- INGREDIENT -->
      <div class="profile-section">

        <h3 class="profile-subtitle">
          Evitar algún ingrediente
        </h3>

        <BaseInput
          v-model="ingredient"
          placeholder="Ej: Naranja"
        />

      </div>

      <!-- TOPPINGS -->
      <div class="profile-section">

        <h2 class="toppings-title">
          Agregar toppings
        </h2>

        <ProductToppingSelect
          v-model="fruit"
          label="Frutilla"
          extra="+S/5"
          :options="[
            'Fresa',
            'Arándanos',
            'Mango'
          ]"
        />

        <ProductToppingSelect
          v-model="cream"
          label="Relleno Extra"
          extra="+S/8"
          :options="[
            'Crema batida',
            'Chocolate',
            'Manjar'
          ]"
        />

        <!-- MESSAGE -->
        <div class="message-group">

          <div class="topping-header">

            <p class="topping-label">
              Mensaje en la torta
            </p>

            <span class="topping-extra">
              +S/2
            </span>

          </div>

          <BaseInput
            v-model="message"
            placeholder="Ej: Feliz aniversario"
          />

        </div>

      </div>

      <!-- QUANTITY -->
      <div class="profile-section">

        <h3 class="profile-subtitle">
          Cantidad
        </h3>

        <div class="quantity-box">

          <button
            class="qty-btn"
            @click="decreaseQty"
          >
            −
          </button>

          <span class="qty-number">
            {{ quantity }}
          </span>

          <button
            class="qty-btn"
            @click="increaseQty"
          >
            +
          </button>

        </div>

      </div>

      <!-- SUMMARY -->
      <div class="summary-card">

        <div class="summary-row">

          <span>Tamaño</span>

          <strong>
            {{ selectedSize }}
          </strong>

        </div>

        <div class="summary-row">

          <span>Cantidad</span>

          <strong>
            {{ quantity }}
          </strong>

        </div>

        <div class="summary-row">

          <span>Toppings</span>

          <strong>
            {{
              fruit || cream
                ? 'Personalizado'
                : 'Ninguno'
            }}
          </strong>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="profile-footer">

        <!-- PRICE -->
        <div class="price-box">

          <span class="price-label">
            Total
          </span>

          <h2 class="price-value">
            S/{{ totalPrice }}
          </h2>

          <p class="price-save">
            Incluye personalización
          </p>

        </div>

        <!-- BUTTON -->
        <BaseButton
  class="profile-button"
  @click="goToProduct"
>
  Agregar al carrito
</BaseButton>

      </div>

    </div>

  </section>

</template>

