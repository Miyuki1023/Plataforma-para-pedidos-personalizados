<script setup lang="ts">
const challenges = [
  {
    title: 'Ingredientes Naturales',
    description: 'Seleccionamos la mejor materia prima para asegurar un sabor auténtico y artesanal.'
  },
  {
    title: 'Diseños Personalizados',
    description: 'Cada pedido es una obra de arte creada especialmente para tus momentos especiales.'
  },
  {
    title: 'Pasión por el Dulce',
    description: 'Nuestra dedicación se nota en cada bocado de nuestras creaciones.'
  }
]
</script>

<template>
  <div class="challenges-list">
    <div v-for="item in challenges" :key="item.title" class="challenge-item">
      <h3 class="challenge-item-title">{{ item.title }}</h3>
      <p class="challenge-item-desc">{{ item.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.challenges-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 500px;
}
.challenge-item-title {
  font-size: 1.8rem;
  color: #a52b2b;
  margin-bottom: 0.5rem;
}
.challenge-item-desc {
  color: #555;
  line-height: 1.6;
}
</style>