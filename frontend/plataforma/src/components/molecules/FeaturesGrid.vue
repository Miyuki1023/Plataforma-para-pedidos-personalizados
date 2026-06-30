<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

const features = [
  {
    icon: 'pencil',
    title: 'Personalización guiada',
    description: 'Elige ingredientes y tamaños fácilmente.'
  },
  {
    icon: 'eye',
    title: 'Visualiza tu pedido',
    description: 'Confirma antes de enviar.'
  },
  {
    icon: 'truck',
    title: 'Entrega programada',
    description: 'Recibe tu pedido cuando quieras.'
  },
  {
    icon: 'dollar-sign',
    title: 'Precio en tiempo real',
    description: 'Visualiza el costo al instante.'
  }
] as const
</script>

<template>
  <div class="grid">
    <div v-for="feature in features" :key="feature.title" class="feature-item-card">
      <div class="icon-container-animated">
        <BaseIcon :name="feature.icon" :size="40" color="var(--primary)" />
      </div>
      <h3 class="feature-title">{{ feature.title }}</h3>
      <p class="feature-desc">{{ feature.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item-card {
  background: white;
  padding: 2.5rem 1.5rem;
  border-radius: 30px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid var(--border);
  box-shadow: 0 10px 20px rgba(0,0,0,0.03);
}

.feature-item-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(175, 52, 57, 0.1);
  border-color: var(--primary);
}

.icon-container-animated {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--secondary);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  animation: float 3s ease-in-out infinite;
}



.feature-item-card:hover svg {
  color: white !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feature-desc {
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
