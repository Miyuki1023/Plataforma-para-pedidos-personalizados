<script setup lang="ts">
import Navbar from '../components/organisms/Navbar.vue'
import AboutHero from '../components/organisms/AboutHero.vue'
import ChallengesSection from '../components/organisms/ChallengesSection.vue'
import FeaturesSection from '../components/organisms/FeaturesSection.vue'
import Footer from '../components/organisms/Footer.vue'
</script>

<template>
  <Navbar />
  <main class="sobre-nosotros-container">
    <section class="section-wrapper hero-offset">
      <AboutHero />
    </section>

    <section class="section-wrapper gray-bg">
      <ChallengesSection />
    </section>

    <section class="section-wrapper">
      <FeaturesSection />
    </section>
  </main>
  <Footer/>
</template>

<style scoped>
.sobre-nosotros-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--bg);
}

.section-wrapper {
  padding: 4rem 0;
}

.gray-bg {
  background-color: var(--soft-bg);
}

@media (max-width: 768px) {
  .section-wrapper {
    padding: 2rem 0;
  }
}
</style>