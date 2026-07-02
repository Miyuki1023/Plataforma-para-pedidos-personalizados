<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import Hero from '../components/organisms/Home/Hero.vue'
import Footer from '../components/organisms/Footer.vue'

const CategoriesSection = defineAsyncComponent(() => import('../components/organisms/Home/Categorias.vue'))
const FeatureCard = defineAsyncComponent(() => import('../components/organisms/Home/Features.vue'))
const RecommendedSection = defineAsyncComponent(() => import('../components/organisms/Home/ProductsRecomendados.vue'))
const trabajamosSection = defineAsyncComponent(() => import('../components/organisms/Home/trabajamosSection.vue'))
const PromosSection = defineAsyncComponent(() => import('../components/organisms/Home/PromocionesSection.vue'))
const DiferencianteSection = defineAsyncComponent(() => import('../components/organisms/Home/DiferencianteSection.vue'))
const TestimoniosSection = defineAsyncComponent(() => import('../components/organisms/Home/TestimoniosSection.vue'))

// Stagger mounting of below-fold components to prioritize LCP
const showCategories = ref(false)
const showFeatures = ref(false)
const showRecommended = ref(false)
const showTrabajamos = ref(false)
const showPromos = ref(false)
const showDiferenciante = ref(false)
const showTestimonios = ref(false)

onMounted(() => {
  // Use requestAnimationFrame to stagger component mounting
  // This ensures the main thread is free for LCP before loading below-fold components
  requestAnimationFrame(() => { showCategories.value = true })
  requestAnimationFrame(() => { showFeatures.value = true })
  requestAnimationFrame(() => { showRecommended.value = true })
  requestAnimationFrame(() => { showTrabajamos.value = true })
  requestAnimationFrame(() => { showPromos.value = true })
  requestAnimationFrame(() => { showDiferenciante.value = true })
  requestAnimationFrame(() => { showTestimonios.value = true })
})
</script>

<template>
  <div class="home">
    <Navbar />
    <main id="main-content" role="main">
      <Hero />
      <CategoriesSection v-if="showCategories" />
      <FeatureCard v-if="showFeatures" />
      <RecommendedSection v-if="showRecommended" />
      <trabajamosSection v-if="showTrabajamos" />
      <PromosSection v-if="showPromos" />
      <DiferencianteSection v-if="showDiferenciante" />
      <TestimoniosSection v-if="showTestimonios" />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#main-content {
  flex: 1;
}
</style>