<script setup lang="ts">
import OrderCard from '../../molecules/OrderCard.vue'
</script>

<template>
  <section class="premium-section">
    <div class="premium-section-header">
      <h2 class="section-title">Pedidos Recientes</h2>
      <button class="btn-text-action">Ver Historial Completo</button>
    </div>

    <div class="premium-orders-grid">
      <OrderCard
        title="Torta de Primavera"
        :price="90"
        date="May 24, 2026"
      />

      <OrderCard
        title="Torta de Primavera"
        :price="90"
        date="May 18, 2024"
      />
    </div>
  </section>
</template>