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
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.challenge-item {
  padding: 1.5rem;
  background: white;
  border-radius: 20px;
  border-left: 5px solid var(--primary);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.challenge-item:hover {
  transform: translateX(10px);
}

.challenge-item-title {
  font-family: var(--heading);
  font-size: 1.5rem;
  color: var(--primary);
  margin: 0 0 0.5rem 0;
}

.challenge-item-desc {
  color: var(--text);
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 900px) {
  .challenges-container {
    align-items: center;
    text-align: center;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .challenge-item {
    padding: 1.2rem 1.5rem;
  }
  .challenge-item-title {
    font-size: 1.15rem;
  }
}
</style>