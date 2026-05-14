<script setup lang="ts">
import FeatureCard from '../atoms/FeatureCard.vue'
</script>

<template>
  <div class="grid">
    <FeatureCard
      image="/img/cookie.png"
      title="Personalización guiada"
      description="Elige ingredientes y tamaños fácilmente."
    />

    <FeatureCard
      image="/img/order.png"
      title="Visualiza tu pedido"
      description="Confirma antes de enviar."
    />

    <FeatureCard
      image="/img/delivery.png"
      title="Entrega programada"
      description="Recibe tu pedido cuando quieras."
    />

    <FeatureCard
      image="/img/price.png"
      title="Precio en tiempo real"
      description="Visualiza el costo al instante."
    />
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>