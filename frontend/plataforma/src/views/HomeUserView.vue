<script setup lang="ts">
import Navbar from '../components/organisms/Navbar.vue'
import CategoriesSection from '../components/organisms/Home/Categorias.vue' // Renombrado para mayor claridad
import TestimoniosSection from '../components/organisms/Home/TestimoniosSection.vue'
import Footer from '../components/organisms/Footer.vue'
import Hero from '../components/organisms/Home/Hero.vue'
import FeatureCard from '../components/organisms/Home/Features.vue'
import RecommendedSection from '../components/organisms/Home/ProductsRecomendados.vue'
import trabajamosSection from '../components/organisms/Home/trabajamosSection.vue'
import PromosSection from '../components/organisms/Home/PromocionesSection.vue'
import DiferencianteSection from '../components/organisms/Home/DiferencianteSection.vue'


</script>

<template>
  <div class="home">
    <Navbar />
    <main>
      <Hero />
      <CategoriesSection/>
      <FeatureCard/>
      <RecommendedSection />
      <trabajamosSection />
      <PromosSection />
      <DiferencianteSection />
      <TestimoniosSection />
    </main>
    <Footer />
  </div>
</template>
