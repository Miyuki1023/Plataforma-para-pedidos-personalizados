<script setup lang="ts">
const differentials = [
  { number: '01', title: 'Personalización a tu gusto', desc: 'Crea tu combinación ideal: sabor, relleno, acabado y mensaje. Cada detalle es tuyo.', icon: 'heart' },
  { number: '02', title: 'Ingredientes seleccionados de calidad', desc: 'Usamos productos frescos, naturales y de temporada. Sin conservantes, sin concesiones.', icon: 'heart' },
  { number: '03', title: 'Atención cercana y personalizada', desc: 'Te acompañamos desde el pedido hasta la entrega. Tu satisfacción es nuestra prioridad.', icon: 'heart' }
]
</script>

<template>
  <section class="diff-section">
    <div class="diff-content">
      <span class="section-eyebrow ds-eyebrow">Lo que nos hace únicos</span>
      <h2 class="diff-title">Postres hechos<br /><span>a tu medida</span></h2>
      <br />
      <p class="ds-subtitle">No fabricamos en serie. Cada pedido es una creación nueva, pensada para ti y para la ocasión que merece celebrarse.</p>
      <ul class="diff-list ds-list">
        <li v-for="d in differentials" :key="d.title" class="diff-item ds-item">
          <div class="diff-check ds-check">
            <span class="ds-check-number">{{ d.number }}</span>
          </div>
          <div class="ds-item-body">
            <p class="diff-item-title">{{ d.title }}</p>
            <p class="diff-item-desc">{{ d.desc }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="diff-image ds-img-col">
      <div class="diff-image-wrapper">
        <img
          src="../../../assets/diff_img.webp"
          alt="Torta decorada personalizada - Vainilla y Miel"
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
          class="diff-image"
        />
      </div>
      <div class="ds-deco-ring" aria-hidden="true" />
    </div>
  </section>
</template>