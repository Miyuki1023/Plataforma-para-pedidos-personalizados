<script setup lang="ts">
 
const differentials = [
  {
    number: '01',
    title: 'Personalización a tu gusto',
    desc: 'Crea tu combinación ideal: sabor, relleno, acabado y mensaje. Cada detalle es tuyo.',
    icon: 'heart'
  },
  {
    number: '02',
    title: 'Ingredientes seleccionados de calidad',
    desc: 'Usamos productos frescos, naturales y de temporada. Sin conservantes, sin concesiones.',
    icon: 'heart'
  },
  {
    number: '03',
    title: 'Atención cercana y personalizada',
    desc: 'Te acompañamos desde el pedido hasta la entrega. Tu satisfacción es nuestra prioridad.',
    icon: 'heart'
  }
]
</script>
 
<template>
  <section class="diff-section">
 
    <!-- ── COLUMNA IZQUIERDA: TEXTO ── -->
    <div class="diff-content">
 
      <!-- Eyebrow -->
      <span class="section-eyebrow ds-eyebrow">
        Lo que nos hace únicos
      </span>
 
      <!-- Título -->
      <h2 class="diff-title ">
        Postres hechos<br />
        <span>a tu medida</span>
      </h2>
     
      <br>

 
      <!-- Subtítulo -->
      <p class="ds-subtitle">
        No fabricamos en serie. Cada pedido es una creación nueva, pensada para ti y para la ocasión que merece celebrarse.
      </p>
 
      <!-- Lista de diferenciales -->
      <ul class="diff-list ds-list">
        <li
          v-for="(d) in differentials"
          :key="d.title"
          class="diff-item ds-item"
        >
          <!-- Número + ícono -->
          <div class="diff-check ds-check">
            <span class="ds-check-number">{{ d.number }}</span>
          </div>
 
          <!-- Texto -->
          <div class="ds-item-body">
            <p class="diff-item-title">{{ d.title }}</p>
            <p class="diff-item-desc">{{ d.desc }}</p>
          </div>
        </li>
      </ul>
 
     
    </div>
 
    <!-- ── COLUMNA DERECHA: IMAGEN ── -->
    <div class="diff-image ds-img-col">
 
      
 
       <div class="diff-image-wrapper">
      <img
        src="../../../assets/diff_img.webp"
        alt="Torta decorada personalizada"
        class="diff-image"
      />
    </div>
 
      
 
      <!-- Decoración: círculo punteado -->
      <div class="ds-deco-ring" aria-hidden="true" />
    </div>
 
  </section>
</template>