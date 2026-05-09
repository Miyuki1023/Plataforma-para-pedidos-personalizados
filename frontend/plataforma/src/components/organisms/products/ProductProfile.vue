<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '../../atoms/BaseButton.vue'
import BaseInput from '../../atoms/BaseInput.vue'
import FavoriteIcon from '../../atoms/FavoriteIcon.vue'

import ProductSizeChip from '../../atoms/ProductSizeChip.vue'
import ProductToppingSelect from '../../molecules/ProductToppingSelect.vue'

const product = {
  id: 1,

  name: 'Torta de Primavera',

  category: 'TORTAS',

  image: new URL('../../assets/recom1.png', import.meta.url).href,

  description:
    'Torta fresca y colorida, con sabores ligeros y frutales que evocan la temporada de primavera. Inspirada en el clásico pie de limón, combina una suave crema cítrica de limón con una base delicada y una cobertura cremosa que aporta equilibrio y dulzura.',

  price: 60,

  isNew: true
}

/* SIZE */

const selectedSize = ref('Pequeño')

const sizes = [
  {
    label: 'Pequeño',
    detail: '12 cm. S/60'
  },

  {
    label: 'Mediano',
    detail: '16 cm. S/80'
  },

  {
    label: 'Grande',
    detail: '20 cm. S/100'
  }
]

/* CUSTOM */

const ingredient = ref('')
const message = ref('')

/* TOPPINGS */

const fruit = ref('')
const cream = ref('')
</script>

<template>

  <section class="product-profile">

    <!-- IMAGE -->
    <div class="profile-image-wrapper">

      <img
        :src="product.image"
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

    <!-- INFO -->
    <div class="profile-content">

      <span class="profile-category">
        {{ product.category }}
      </span>

      <h1 class="profile-title">
        {{ product.name }}
      </h1>

      <p class="profile-description">
        {{ product.description }}
      </p>

      <!-- SIZE -->
      <div class="profile-section">

        <h3 class="profile-subtitle">
          Escoge el tamaño
        </h3>

        <div class="sizes-grid">

          <ProductSizeChip
            v-for="size in sizes"
            :key="size.label"
            :label="size.label"
            :detail="size.detail"
            :active="selectedSize === size.label"
            @select="selectedSize = size.label"
          />

        </div>

      </div>

      <!-- REMOVE -->
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

      <!-- BUTTON -->
      <BaseButton class="profile-button">
        Agregar al carrito
      </BaseButton>

    </div>

  </section>

</template>