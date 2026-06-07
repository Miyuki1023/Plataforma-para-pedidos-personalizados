<script setup lang="ts">
import BaseIcon from '../../atoms/BaseIcon.vue'

const features = [
  { icon: 'leaf',  title: 'Ingredientes frescos',  desc: 'Seleccionamos ingredientes de la más alta calidad.' },
  { icon: 'heart', title: 'Hecho con amor',         desc: 'Recetas tradicionales elaboradas con dedicación.' },
  { icon: 'truck', title: 'Entrega rápida',          desc: 'En pedidos seleccionados y zonas cercanas.' },
] as const
</script>

<template>

  <!-- FEATURES -->
  <section class="section features-section">

    <div
      v-for="f in features"
      :key="f.title"
      class="feature-item"
    >

      <div class="feature-icon">
        <BaseIcon
          :name="f.icon"
          :size="22"
        />
      </div>

      <div>
        <p class="feature-title">
          {{ f.title }}
        </p>

        <p class="feature-desc">
          {{ f.desc }}
        </p>
      </div>

    </div>

  </section>

</template>