<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import CategoryChip from '../components/molecules/CategoryChip.vue'
import ProductCard from '../components/molecules/ProductCard.vue'
import PromoCard from '../components/molecules/PromoCard.vue'
import TestimonialCard from '../components/molecules/TestimonialCard.vue'
import BaseIcon from '../components/atoms/BaseIcon.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

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
  { image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80', category: 'TORTAS',   name: 'Torta de Primavera', description: 'Torta fresca y colorida, con sabores ligeros y relleno de frutas.', price: 'S/60', isNew: true },
  { image: 'https://images.unsplash.com/photo-1549312150-d68be48e9b06?w=400&q=80', category: 'GALLETAS',  name: 'Choco comi',         description: 'Exquisita torta de chocolate con un toque especial de vainilla.', price: 'S/40' },
  { image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80', category: 'TORTAS',   name: 'Torta de Helada',    description: 'Postre frío y refrescante, con capas suaves de crema y fruta.', price: 'S/55' },
]

const promos = [
  { image: 'https://images.unsplash.com/photo-1488477181228-c2b533b5e4a3?w=400&q=80', badge: '15%',   title: 'Torta del mes',       subtitle: 'Torta de fresas con 15% · Válido hasta 25 Abr' },
  { image: 'https://images.unsplash.com/photo-1549312150-d68be48e9b06?w=400&q=80', badge: '2 x 1',  title: 'Caja sorpresa',        subtitle: '¡Llevate un mix de postres · Todos los sabores' },
  { image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80', badge: undefined, title: 'Cupcakes Mix',         subtitle: '6 cupcakes surtidos · Elige tus sabores favoritos' },
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
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Pide y personaliza tus postres en pocos pasos</h1>
        <p class="hero-subtitle">Postres artesanales hecho con cariño</p>
        <BaseButton variant="ghost" class="hero-cta">Ver Catálogo</BaseButton>
      </div>
    </section>

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
          <BaseIcon :name="f.icon as any" :size="22" color="#8b1a2e" />
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
        <img src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80" alt="Así trabajamos" />
      </div>
      <div class="about-content">
        <h2 class="about-title">Así trabajamos en Vainilla y Miel</h2>
        <p class="about-text">
          En Vainilla y Miel elaboramos postres por encargo para asegurar frescura, calidad y atención en cada detalle.
          Sabemos que cada pedido es único, por eso puedes personalizar ciertos aspectos como sabores, tamaños y
          acabados de forma sencilla y clara.
        </p>
        <BaseButton variant="primary">Conócenos</BaseButton>
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
              <BaseIcon name="heart" :size="14" color="#8b1a2e" />
            </div>
            <div>
              <p class="diff-item-title">{{ d.title }}</p>
              <p class="diff-item-desc">{{ d.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="diff-image">
        <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" alt="Torta decorada" />
      </div>
    </section>

    <!-- ── Testimonios ── -->
    <section class="section testi-section">
      <h2 class="section-heading">Lo que dicen nuestros clientes</h2>
      <div class="testi-grid">
        <button class="testi-arrow" @click="currentTestimonial = Math.max(0, currentTestimonial - 1)">
          <BaseIcon name="arrow-left" :size="28" color="#8b1a2e" />
        </button>
        <TestimonialCard
          v-for="(t, i) in testimonials"
          :key="i"
          v-bind="t"
          :active="currentTestimonial === i"
        />
        <button class="testi-arrow" @click="currentTestimonial = Math.min(testimonials.length - 1, currentTestimonial + 1)">
          <BaseIcon name="arrow-right" :size="28" color="#8b1a2e" />
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

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <p class="footer-name">Vainilla y miel</p>
          <p class="footer-tagline">Postres artesanales hechos con amor</p>
        </div>

        <div class="footer-social-col">
          <div class="footer-book">
            <BaseIcon name="book" :size="20" color="#fff" />
            <span>libro de recomendación</span>
          </div>
          <p class="footer-social-label">Redes sociales</p>
          <div class="social-icons">
            <a href="#"><BaseIcon name="instagram" :size="22" color="#fff" /></a>
            <a href="#"><BaseIcon name="facebook"  :size="22" color="#fff" /></a>
            <a href="#"><BaseIcon name="tiktok"    :size="22" color="#fff" /></a>
          </div>
        </div>

        <div class="footer-links">
          <p class="footer-links-title">Políticas</p>
          <a href="#">Políticas de privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Preguntas Frecuentes</a>
        </div>
      </div>
      <div class="footer-bottom">
        Copyright © 2024 Vainilla y Miel. Derechos reservados.
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Lato:wght@300;400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rochester&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');


.home { background: #fdf6f0; font-family: 'Lato', sans-serif; }

/* ── Hero ── */
.hero {
  background-image: url('../assets/img_herohome.png');
  background-size: cover;
  min-height: 630px;
  display: flex;
  align-items: center;
  padding: 3rem 2.5rem;
  position: relative;
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(105, 93, 57, 0.436) 0%, transparent);
}
.hero-content {
  position: relative;
  text-align: start;
  z-index: 1;
  max-width: 480px;
  margin-left: 5rem;
  
}
.hero-title {
  font-family: 'Rubik', sans-serif;
  font-size: 2.5rem;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 0.98rem;
  font-weight: 400;
  color: #ffffff;
  margin: 0 0 1.25rem;
}
.hero-cta {
  background: #f5ece498 !important;
  color: #5a3e13 !important;
  border: none !important;
  font-size: 0.85rem !important;
  padding: 0.65rem 1.5rem !important;
  width: auto !important;
}

/* ── Sections shared ── */
.section { padding: 2.5rem 2rem; 
}
.section-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #ffffff;   
  background: #E89A3C;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 0.5rem;
}
.section-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #8b1a2e;
  text-align: center;
  margin: 0 0 0.5rem;
}
.section-subheading {
  font-size: 0.85rem;
  color: #9e8080;
  text-align: center;
  margin: 0 0 1.5rem;
}
.section-title-sm {
  font-family: 'Lato', sans-serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: #7A1F26;
  margin: 0;
}

/* ── Categories ── */
.categories-section {
  background: #fdf0e8;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.categories-left { flex-shrink: 0; 
text-align: left;
max-width: 280px;
margin: 0 0 0 5rem;}

.chips-row { display: flex; 
    gap: 2rem; 
    flex-wrap: wrap; 
    margin: 0 0 0 5rem;
}

/* ── Features ── */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: #fff;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
}
.feature-icon {
  width: 40px; height: 40px;
  background: #f5ece4;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.feature-title { font-weight: 700; font-size: 0.88rem; color: #2a1a1a; margin: 0 0 0.2rem; }
.feature-desc  { font-size: 0.78rem; color: #9e8080; margin: 0; line-height: 1.4; }

/* ── Products ── */
.products-section { background: #ffffff; }
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 1.5rem; }
.center-btn { text-align: center; margin-top: 1.5rem; }
.btn-outline {
  padding: 0.6rem 1.75rem;
  border: 1.5px solid #2a1a1a;
  border-radius: 50px;
  background: transparent;
  font-family: 'Lato', sans-serif;
  font-size: 0.88rem;
  color: #2a1a1a;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-outline:hover { background: #f5ece4; }

/* ── About ── */
.about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 280px;
}
.about-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about-content {
  background: #fdf0e8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2.5rem;
}
.about-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b1a2e;
  margin: 0;
  line-height: 1.3;
}
.about-text {
  font-size: 0.85rem;
  color: #6b5050;
  line-height: 1.7;
  margin: 0;
}

/* ── Promos ── */
.promos-section { background: #fdf6f0; }
.promos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }

/* ── Diff ── */
.diff-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fdf6f0;
  padding: 3rem 2rem;
  gap: 2rem;
  align-items: center;
}
.diff-title {
  font-family: 'Lato', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #2a1a1a;
  margin: 0.5rem 0 1.25rem;
  line-height: 1.2;
}
.diff-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
.diff-item { display: flex; align-items: flex-start; gap: 0.75rem; }
.diff-check {
  width: 28px; height: 28px;
  background: #f5ece4;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.diff-item-title { font-weight: 700; font-size: 0.88rem; color: #2a1a1a; margin: 0 0 0.15rem; }
.diff-item-desc  { font-size: 0.78rem; color: #9e8080; margin: 0; }
.diff-image img { width: 100%; border-radius: 16px; object-fit: cover; max-height: 320px; }

/* ── Testimonials ── */
.testi-section { background: #fff; }
.testi-grid {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.testi-arrow {
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  display: flex;
}
.testi-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}
.dot {
  width: 28px; height: 8px;
  border-radius: 10px;
  background: #e8d5d5;
  cursor: pointer;
  transition: background 0.2s, width 0.2s;
}
.dot.active { background: #f59e0b; width: 32px; }

/* ── Footer ── */
.footer { background: #6b1222; color: #fff; }
.footer-inner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 2.5rem 2rem;
}
.footer-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}
.footer-tagline { font-size: 0.8rem; color: rgba(255,255,255,0.65); margin: 0; }
.footer-social-col { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.footer-book {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}
.footer-social-label { font-size: 0.82rem; font-weight: 600; margin: 0; }
.social-icons { display: flex; gap: 1rem; }
.social-icons a { color: #fff; opacity: 0.85; transition: opacity 0.2s; }
.social-icons a:hover { opacity: 1; }
.footer-links { display: flex; flex-direction: column; gap: 0.4rem; }
.footer-links-title { font-weight: 700; font-size: 0.9rem; margin: 0 0 0.25rem; }
.footer-links a { font-size: 0.82rem; color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: #fff; }
.footer-bottom {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.15);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .features-section  { grid-template-columns: 1fr; }
  .products-grid     { grid-template-columns: 1fr 1fr; }
  .promos-grid       { grid-template-columns: 1fr 1fr; }
  .about-section     { grid-template-columns: 1fr; }
  .diff-section      { grid-template-columns: 1fr; }
  .footer-inner      { grid-template-columns: 1fr; }
  .testi-grid        { flex-direction: column; }
  .chips-row         { margin: 0 4rem; }    
}
@media (max-width: 600px) {
  .products-grid  { grid-template-columns: 1fr; }
  .promos-grid    { grid-template-columns: 1fr; }
  .chips-row         { margin: 0 4rem; } 
  .categories-section { flex-direction: column; align-items: flex-start; }
}
</style>