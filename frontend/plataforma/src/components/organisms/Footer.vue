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