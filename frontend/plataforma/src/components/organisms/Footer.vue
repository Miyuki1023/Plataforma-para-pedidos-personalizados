<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

const policies = [
  { label: 'Políticas de privacidad', href: '#' },
  { label: 'Términos y condiciones',  href: '#' },
  { label: 'Preguntas Frecuentes',    href: '#' },
]

const socials = [
  { icon: 'instagram', href: '#' },
  { icon: 'facebook',  href: '#' },
  { icon: 'tiktok',    href: '#' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">

      <!-- Columna 1: Marca -->
      <div class="footer-brand">
        <p class="footer-name">Vainilla y miel</p>
        <p class="footer-tagline">Postres artesanales hechos con amor</p>
      </div>

      <!-- Columna 2: Redes y libro -->
      <div class="footer-social-col">
        <div class="footer-book">
          <BaseIcon name="book" :size="18" color="#fff" />
          <span>libro de recomendación</span>
        </div>
        <p class="footer-social-label">Redes sociales</p>
        <div class="social-icons">
          <a
            v-for="s in socials"
            :key="s.icon"
            :href="s.href"
            class="social-link"
          >
            <BaseIcon :name="s.icon as any" :size="22" color="#fff" />
          </a>
        </div>
      </div>

      <!-- Columna 3: Políticas -->
      <div class="footer-policies">
        <p class="footer-policies-title">Políticas</p>
        <nav class="footer-links">
          <a
            v-for="p in policies"
            :key="p.label"
            :href="p.href"
            class="footer-link"
          >
            {{ p.label }}
          </a>
        </nav>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      Copyright © 2024 Vainilla y Miel. Derechos reservados.
    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Lato:wght@400;600;700&display=swap');

.footer {
  background: var(--primary);
  color: #fff;
  font-family: var(--sans);
}

/* ── Grid de columnas ── */
.footer-inner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 2.5rem 2rem;
  align-items: start;
}

/* ── Columna 1: Marca ── */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.01em;
}

.footer-tagline {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.5;
}

/* ── Columna 2: Social ── */
.footer-social-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.footer-book {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
}
.footer-book:hover {
  background: rgba(255,255,255,0.2);
}

.footer-social-label {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.02em;
}

.social-icons {
  display: flex;
  gap: 1.1rem;
  align-items: center;
}

.social-link {
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
}

.social-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

/* ── Columna 3: Políticas ── */
.footer-policies {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-policies-title {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer-link {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.5;
}

.footer-link:hover {
  color: #fff;
}

/* ── Bottom bar ── */
.footer-bottom {
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 1.75rem;
    padding: 2rem 1.5rem;
  }

  .footer-social-col {
    align-items: flex-start;
  }
}
</style>