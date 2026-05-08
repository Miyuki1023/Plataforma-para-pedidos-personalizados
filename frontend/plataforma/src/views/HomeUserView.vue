<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import CategoryChip from '../components/molecules/Category.vue'
import ProductCard from '../components/molecules/ProductCard.vue'
import PromoCard from '../components/molecules/PromoCard.vue'
import TestimonialCard from '../components/molecules/TestimonialCard.vue'
import BaseIcon from '../components/atoms/BaseIcon.vue'
import BaseButton from '../components/atoms/BaseButton.vue'
import Footer from '../components/organisms/Footer.vue'
import Hero from '../components/organisms/Home/Hero.vue'
const activeCategory = ref('Tortas')

const categories = [
  { label: 'Tortas',          image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=120&q=80' },
  { label: 'Cupcake',         image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=120&q=80' },
  { label: 'Galletas',        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=120&q=80' },
  { label: 'Bocaditos',       image: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=120&q=80' },
  { label: 'Pastelería Salada', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80' },
  { label: 'Cheesecakes',     image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=120&q=80' },
]

const products = [
  { image: new URL('../assets/recom1.png', import.meta.url).href, category: 'TORTAS',   name: 'Torta de Primavera', description: 'Torta fresca y colorida, con sabores ligeros y relleno de frutas.', price: 'S/60', isNew: true },
  { image: new URL('../assets/recom2.png', import.meta.url).href, category: 'GALLETAS',  name: 'Choco comi',         description: 'Exquisita torta de chocolate con un toque especial de vainilla.', price: 'S/40' },
  { image: new URL('../assets/recom3.png', import.meta.url).href, category: 'TORTAS',   name: 'Torta de Helada',    description: 'Postre frío y refrescante, con capas suaves de crema y fruta.', price: 'S/55' },
]

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

const features = [
  { icon: 'leaf',  title: 'Ingredientes frescos',  desc: 'Seleccionamos ingredientes de la más alta calidad.' },
  { icon: 'heart', title: 'Hecho con amor',         desc: 'Recetas tradicionales elaboradas con dedicación.' },
  { icon: 'truck', title: 'Entrega rápida',          desc: 'En pedidos seleccionados y zonas cercanas.' },
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

    <!-- ── Hero ── -->
<Hero />


    <!-- ── Categorías ── -->
    <section class="section categories-section">
      <div class="categories-left">
        <span class="section-eyebrow">CATEGORÍAS</span>
        <h2 class="section-title-sm">Encuentra tu postre ideal</h2>
      </div>
      <div class="chips-row">
        <CategoryChip
          v-for="cat in categories"
          :key="cat.label"
          :label="cat.label"
          :image="cat.image"
          :active="activeCategory === cat.label"
          @click="activeCategory = cat.label"
        />
      </div>
    </section>

    <!-- ── Features ── -->
    <section class="section features-section">
      <div v-for="f in features" :key="f.title" class="feature-item">
        <div class="feature-icon">
          <BaseIcon :name="f.icon" :size="22" color="var(--primary)" />
        </div>
        <div>
          <p class="feature-title">{{ f.title }}</p>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── Recomendados ── -->
    <section class="section products-section">
      <h2 class="section-heading">Recomendados para ti</h2>
      <div class="products-grid">
        <ProductCard
          v-for="(p, i) in products"
          :key="i"
          v-bind="p"
          @add-to-cart="() => {}"
        />
      </div>
      <div class="center-btn">
        <button class="btn-outline">Explorar catálogo</button>
      </div>
    </section>

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