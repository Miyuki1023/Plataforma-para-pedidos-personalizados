<script setup lang="ts">
import ProductCard from '../../molecules/ProductCard.vue'
import BaseButton from '../../atoms/BaseButton.vue'
import FavoriteIcon from '../../atoms/FavoriteIcon.vue'

const products = [
  {
    id: 1,
    image: new URL('../../../assets/recom1.png', import.meta.url).href,
    category: 'TORTAS',
    name: 'Torta de Primavera',
    description: 'Torta fresca y colorida, con sabores ligeros y relleno de frutas.',
    price: 60,
    isNew: true
  },

  {
    id: 2,
    image: new URL('../../../assets/recom2.png', import.meta.url).href,
    category: 'GALLETAS',
    name: 'Choco comi',
    description: 'Exquisita torta de chocolate con un toque especial de vainilla.',
    price: 40
  },

  {
    id: 3,
    image: new URL('../../../assets/recom3.png', import.meta.url).href,
    category: 'TORTAS',
    name: 'Torta de Helada',
    description: 'Postre frío y refrescante, con capas suaves de crema y fruta.',
    price: 55
  },
]
</script>

<template>

  <section class="products-section">

    <div class="section-intro">
      <span class="section-eyebrow">SELECCIÓN ESPECIAL</span>
      <h2 class="section-heading">
        Recomendados para ti
      </h2>
    </div>

    <div class="products-grid">

      <ProductCard
        v-for="(p, i) in products"
        :key="i"
        v-bind="p"
        @add-to-cart="() => {}"
      />

    </div>

    <div class="center-btn">

      <BaseButton variant="ghost">
        Explorar catálogo
      </BaseButton>

    </div>

  </section>

</template>