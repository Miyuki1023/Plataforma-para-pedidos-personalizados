<script setup lang="ts">
import BaseIcon from '../../atoms/BaseIcon.vue'

const differentials = [
  {
    title: 'Personalización a tu gusto',
    desc: 'Crea tu combinación ideal: sabor, relleno y acabado.'
  },
  {
    title: 'Ingredientes seleccionados de calidad',
    desc: 'Frescos, naturales y seleccionados.'
  },
  {
    title: 'Atención cercana',
    desc: 'Te acompañamos en cada detalle.'
  }
]
</script>

<template>
  <section class="diff-section">
    <div class="">

      <span class="section-eyebrow">
        LO QUE NOS HACE ÚNICOS
      </span>

      <h2 class="diff-title">
        Diferenciante
        <br />
        Crea un postre a tu medida
      </h2>

      <ul class="diff-list">
        <li
          v-for="d in differentials"
          :key="d.title"
          class="diff-item"
        >
          <div class="diff-check">
            <BaseIcon
              name="heart"
              :size="14"
              color="var(--primary)"
            />
          </div>

          <div>
            <p class="diff-item-title">
              {{ d.title }}
            </p>

            <p class="diff-item-desc">
              {{ d.desc }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div class="diff-image">
      <img
        src="../../../assets/diff_img.png"
        alt="Torta decorada"
      />
    </div>
  </section>
</template>