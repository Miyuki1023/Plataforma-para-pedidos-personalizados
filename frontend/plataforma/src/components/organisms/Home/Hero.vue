<script setup lang="ts">
import BaseButton from '../../atoms/BaseButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goToCatalog = () => {
  router.push('/catalogo')
}


</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">
        Pide y personaliza tus postres en pocos pasos
      </h1>

      <p class="hero-subtitle">
        Postres artesanales hechos con cariño
      </p>

      <BaseButton
        @click="goToCatalog"
        variant="ghost"
        class="hero-cta"
      >
        Ver Catálogo
      </BaseButton>
    </div>
  </section>
</template>

