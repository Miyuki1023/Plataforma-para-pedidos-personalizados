<script setup lang="ts">
import PromoCard from '../../molecules/PromoCard.vue'
import BaseButton from '../../atoms/BaseButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goToCatalog = () => {

  router.push(
    `/catalogo`
  )
}

/* IMAGES */

import prom1 from '../../../assets/prom1.png'
import prom2 from '../../../assets/prom2.png'
import prom3 from '../../../assets/prom3.jpg'

/* DATA */

const promos = [
  {
    id: 1,
    image: prom1,
    badge: '15% OFF',
    title: 'Torta del mes',
    subtitle: 'Torta de fresas con descuento',
    desc: 'Válido hasta el 25 de abril'
  },

  {
    id: 2,
    image: prom2,
    badge: '2x1',
    title: 'Caja sorpresa',
    subtitle: 'Mix especial de postres',
    desc: 'Todos los sabores disponibles'
  },

  {
    id: 3,
    image: prom3,
    badge: 'NUEVO',
    title: 'Cupcakes Mix',
    subtitle: '6 cupcakes surtidos',
    desc: 'Elige tus sabores favoritos'
  }
]
</script>

<template>

  <section class=" promos-section">

    <!-- INTRO -->
    <div class="section-intro">

      <span class="section-eyebrow">
        PROMOCIONES
      </span>

      <h2 class="section-heading">
        Nuestras promociones
      </h2>

      <p class="section-subheading">
        Aprovecha ofertas especiales en tus postres favoritos
        y disfruta algo dulce todos los días.
      </p>

    </div>

    <!-- GRID -->
    <div class="promos-grid">

      <PromoCard
        v-for="promo in promos"
        :key="promo.id"
        v-bind="promo"
      />

    </div>
<br/>
    <!-- BUTTON -->
    <div class="center-btn">

      <BaseButton variant="primary" @click="goToCatalog">
        Ver promociones
      </BaseButton>

    </div>

  </section>

</template>