<script setup lang="ts">
import BaseButton from '../../atoms/BaseButton.vue'
</script>

<template>
    <section class="about-section">

  <div class="about-image">

    <img
      src="../../../assets/about_img.png"
      alt="Así trabajamos"
    />

    <div class="about-floating-card">
      <strong>+150 pedidos</strong>
      <span>Hechos con amor y dedicación</span>
    </div>

  </div>

  <div class="about-content">

    <span class="about-tag">
       Experiencia artesanal
    </span>

    <h2 class="about-title">
      Creamos momentos dulces en
      <span>Vainilla y Miel</span>
    </h2>

    <p class="about-text">
      Elaboramos postres personalizados por encargo para garantizar
      frescura, calidad y atención en cada detalle.
      Cada creación está pensada para convertirse en un momento
      especial lleno de sabor, diseño y dedicación.
    </p>

    <div class="about-features">

      <div class="about-feature">
        🎂 Diseños personalizados
      </div>

      <div class="about-feature">
        🍓 Ingredientes frescos
      </div>

      <div class="about-feature">
        💖 Atención cercana
      </div>

      <div class="about-feature">
        ✨ Detalles únicos
      </div>

    </div>

    <BaseButton
      class="about-btn"
      variant="primary"
    >
      Conócenos
    </BaseButton>

  </div>

</section>
</template>