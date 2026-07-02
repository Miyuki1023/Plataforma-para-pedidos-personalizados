<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import Hero from '../components/organisms/Home/Hero.vue'
import Footer from '../components/organisms/Footer.vue'

// Critical above-the-fold components loaded eagerly
// Lazy load non-critical below-the-fold components for faster LCP
const CategoriesSection = defineAsyncComponent(() => import('../components/organisms/Home/Categorias.vue'))
const FeatureCard = defineAsyncComponent(() => import('../components/organisms/Home/Features.vue'))
const RecommendedSection = defineAsyncComponent(() => import('../components/organisms/Home/ProductsRecomendados.vue'))
const trabajamosSection = defineAsyncComponent(() => import('../components/organisms/Home/trabajamosSection.vue'))
const PromosSection = defineAsyncComponent(() => import('../components/organisms/Home/PromocionesSection.vue'))
const DiferencianteSection = defineAsyncComponent(() => import('../components/organisms/Home/DiferencianteSection.vue'))
const TestimoniosSection = defineAsyncComponent(() => import('../components/organisms/Home/TestimoniosSection.vue'))
</script>

<template>
  <div class="home">
    <Navbar />
    <main id="main-content" role="main">
      <Hero />
      <CategoriesSection />
      <FeatureCard />
      <RecommendedSection />
      <trabajamosSection />
      <PromosSection />
      <DiferencianteSection />
      <TestimoniosSection />
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