<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import CategoriesSection from '../components/organisms/Home/Categorias.vue' // Renombrado para mayor claridad
import PromoCard from '../components/molecules/PromoCard.vue'
import TestimonialCard from '../components/molecules/TestimonialCard.vue'
import BaseIcon from '../components/atoms/BaseIcon.vue'
import BaseButton from '../components/atoms/BaseButton.vue'
import Footer from '../components/organisms/Footer.vue'
import Hero from '../components/organisms/Home/Hero.vue'
import FeatureCard from '../components/organisms/Home/Features.vue'
import RecommendedSection from '../components/organisms/Home/ProductsRecomendados.vue'
const promos = [
  { image: new URL('../assets/prom1.png', import.meta.url).href, badge: '15%',   title: 'Torta del mes',       subtitle: 'Torta de fresas con 15% ', desc: 'Válido hasta 25 Abril' },
  { image: new URL('../assets/prom2.png', import.meta.url).href, badge: '2 x 1',  title: 'Caja sorpresa',        subtitle: 'Llevate un mix de postres ', desc: 'Todos los sabores' },
  { image: new URL('../assets/prom3.jpg', import.meta.url).href, badge: undefined, title: 'Cupcakes Mix',         subtitle: '6 cupcakes surtidos ', desc: 'Elige tus sabores favoritos' },
]

const testimonials = [
  { name: 'Isabel Rodríguez', stars: 5, text: 'El Midnight Ganache es, sin duda, la mejor experiencia de chocolate que he tenido en mi vida. Un balance perfecto.' },
  { name: 'Mateo Sánchez',    stars: 5, text: 'Increíble atención al detalle. Pedimos una torta personalizada para nuestra boda y superó todas las expectativas visuales y de sabor.', active: true },
  { name: 'Lucía Fernández',  stars: 5, text: 'El pan de masa madre me transporta a mi infancia. La calidad de los ingredientes se nota en cada miga. ¡Mi favorito absoluto!' },
]


const differentials = [
  { title: 'Personalización a tu gusto',         desc: 'Crea tu combinación ideal: sabor, relleno y acabado.' },
  { title: 'Ingredientes seleccionados de calidad', desc: 'Frescos, naturales y seleccionados.' },
  { title: 'Atención cercana',                   desc: 'Te acompañamos en cada detalle.' },
]

const currentTestimonial = ref(1)
</script>

<template>
  <div class="home">
    <Navbar />
      <Hero />
      <CategoriesSection/>
      <FeatureCard/>
     <RecommendedSection />

    <!-- ── Así trabajamos ── -->
    <section class="about-section">
      <div class="about-image">
        <img src="../assets/about_img.png" alt="Así trabajamos" />
      </div>
      <div class="about-content">
        <h2 class="about-title">Así trabajamos en Vainilla y Miel</h2>
        <p class="about-text">
          En Vainilla y Miel elaboramos postres por encargo para asegurar frescura, calidad y atención en cada detalle.
          Sabemos que cada pedido es único, por eso puedes personalizar ciertos aspectos como sabores, tamaños y
          acabados de forma sencilla y clara.
        </p>
        <BaseButton class="about-btn" variant="primary">Conócenos</BaseButton>
      </div>
    </section>

    <!-- ── Promociones ── -->
    <section class="section promos-section">
      <h2 class="section-heading">Nuestras promociones</h2>
      <p class="section-subheading">Aprovecha promociones únicas en tus postres favoritos y date ese gustito que mereces</p>
      <div class="promos-grid">
        <PromoCard v-for="(p, i) in promos" :key="i" v-bind="p" />
      </div>
    </section>

    <!-- ── Diferenciante ── -->
    <section class="diff-section">
      <div class="diff-content">
        <span class="section-eyebrow">LO QUE NOS HACE ÚNICOS</span>
        <h2 class="diff-title">Diferenciante<br/>Crea un postre a tu medida</h2>
        <ul class="diff-list">
          <li v-for="d in differentials" :key="d.title" class="diff-item">
            <div class="diff-check">
              <BaseIcon name="heart" :size="14" color="var(--primary)" />
            </div>
            <div>
              <p class="diff-item-title">{{ d.title }}</p>
              <p class="diff-item-desc">{{ d.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="diff-image">
        <img src="../assets/diff_img.png" alt="Torta decorada" />
      </div>
    </section>

    <!-- ── Testimonios ── -->
    <section class="section testi-section">
      <h2 class="section-heading">Lo que dicen nuestros clientes</h2>
      <div class="testi-grid">
        <button class="testi-arrow" @click="currentTestimonial = Math.max(0, currentTestimonial - 1)">
          <BaseIcon name="arrow-left" :size="28" color="var(--primary)" />
        </button>
        <TestimonialCard
          v-for="(t, i) in testimonials"
          :key="i"
          v-bind="t"
          :active="currentTestimonial === i"
        />
        <button class="testi-arrow" @click="currentTestimonial = Math.min(testimonials.length - 1, currentTestimonial + 1)">
          <BaseIcon name="arrow-right" :size="28" color="var(--primary)" />
        </button>
      </div>
      <div class="testi-dots">
        <span
          v-for="(_, i) in testimonials"
          :key="i"
          class="dot"
          :class="{ active: currentTestimonial === i }"
          @click="currentTestimonial = i"
        />
      </div>
    </section>

    <Footer />
  </div>
</template>