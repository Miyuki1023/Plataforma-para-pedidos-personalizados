<script setup lang="ts">
interface Props {
  title: string
  price: number
  date: string
}

defineProps<Props>()
</script>

<template>
  <div class="order-card">
    <span class="status">ENTREGADO</span>

    <h3>{{ title }}</h3>

    <p>{{ date }}</p>

    <strong>S/{{ price }}</strong>
  </div>
</template>

<style scoped>
.order-card {
  border: 1px solid #d6a7a7;
  border-radius: 20px;
  padding: 20px;
  background: white;
}

.status {
  font-size: 12px;
  background: #f3f3f3;
  padding: 4px 10px;
  border-radius: 999px;
}
</style>