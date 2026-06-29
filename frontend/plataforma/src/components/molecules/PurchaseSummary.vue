
<script setup lang="ts">

defineProps<{
  subtotal: number
  delivery: number
  total: number
}>()

</script>

<template>

  <div class="summary-card">

    <h2 class="summary-title">
      Resumen de Compra
    </h2>

    <div class="summary-list">

      <div class="summary-row">

        <span>Subtotal</span>

        <strong>S/{{ subtotal }}</strong>

      </div>

      <div class="summary-row">

        <span>Entrega</span>

        <strong>S/{{ delivery }}</strong>

      </div>

    </div>

    <div class="summary-total">

      <span>Total</span>

      <strong>S/{{ total }}</strong>

    </div>

  </div>

</template>

<style scoped>

.summary-card {

  padding: 2rem;

  border-radius: 2rem;

  background: white;

  border: 1px solid #ead8c8;
}

.summary-title {

  font-size: 1.8rem;

  font-weight: 800;

  margin-bottom: 2rem;

  color: #2f2f2f;
}

.summary-list {

  display: flex;

  flex-direction: column;

  gap: 1rem;

  padding-bottom: 1.5rem;

  border-bottom: 1px solid #ead8c8;
}

.summary-row,
.summary-total {

  display: flex;

  justify-content: space-between;

  align-items: center;
}

.summary-row span {

  color: #666;
}

.summary-total {

  margin-top: 1.5rem;

  font-size: 1.4rem;

  font-weight: 900;

  color: #8b3134;
}

</style>