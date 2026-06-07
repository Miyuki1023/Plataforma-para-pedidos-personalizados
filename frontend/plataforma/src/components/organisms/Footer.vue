<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '../atoms/BaseIcon.vue'
import BaseBadge from '../atoms/BaseBadge.vue'
import RecommendationModal from '../molecules/RecommendationModal.vue'

const isModalOpen = ref(false)

const policies = [
  {
    label: 'Políticas de privacidad',
    href: '#'
  },

  {
    label: 'Términos y condiciones',
    href: '#'
  },

  {
    label: 'Preguntas frecuentes',
    href: '#'
  },
]

const socials = [
  {
    icon: 'instagram',
    href: '#'
  },

  {
    icon: 'facebook',
    href: '#'
  },

  {
    icon: 'tiktok',
    href: '#'
  },
]

const openRecommendationModal = () => {
  isModalOpen.value = true
}

const closeRecommendationModal = () => {
  isModalOpen.value = false
}

const handleRecommendationSubmit = (data: any) => {
  console.log('Recomendación enviada:', data)
  // Aquí puedes enviar los datos a tu API
}
</script>

<template>

  <footer class="footer">

    <!-- DECOR -->
    <div class="footer-glow footer-glow-1" />
    <div class="footer-glow footer-glow-2" />

    <!-- TOP -->
    <div class="footer-inner">

      <!-- BRAND -->
      <div class="footer-brand">

        <!-- BADGE -->
        <BaseBadge>
         Pastelería artesana l
        </BaseBadge>

        <!-- TITLE -->
        <h2 class="footer-name">
          Vainilla y Miel
        </h2>

        <!-- TEXT -->
        <p class="footer-tagline">
          Creamos experiencias dulces con ingredientes
          seleccionados, diseños personalizados y mucho amor
          en cada detalle.
        </p>

        <!-- CTA -->
        <button
          class="footer-book"
          @click="openRecommendationModal"
          type="button"
          aria-label="Abrir libro de recomendaciones"
        >

          <BaseIcon
            name="book"
            :size="18"
            color="#fff"
          />

          <span>
            Libro de recomendaciones
          </span>

        </button>

      </div>

      <!-- SOCIAL -->
      <div class="footer-social-col">

        <div class="footer-title-wrapper">

          <span class="footer-mini-line" />

          <h3 class="footer-social-label">
            Síguenos
          </h3>

        </div>

        <p class="footer-text">
          Descubre promociones,
          nuevos sabores y contenido exclusivo.
        </p>

        <div class="social-icons">

          <a
            v-for="s in socials"
            :key="s.icon"
            :href="s.href"
            class="social-link"
            aria-label="Social link"
          >

            <BaseIcon :name="s.icon as any"
              :size="22"
              color="#fff"/>


          </a>

        </div>

      </div>

      <!-- POLICIES -->
      <div class="footer-policies">

        <div class="footer-title-wrapper">

          <span class="footer-mini-line" />

          <h3 class="footer-policies-title">
            Información
          </h3>

        </div>

        <nav class="footer-links">

          <a
            v-for="p in policies"
            :key="p.label"
            :href="p.href"
            class="footer-link"
          >

            <span class="footer-link-dot" />

            {{ p.label }}

          </a>

        </nav>

      </div>

    </div>

    <!-- DIVIDER -->
    <div class="footer-divider" />

    <!-- BOTTOM -->
    <div class="footer-bottom">

      <p class="footer-copy">
        © 2024 Vainilla y Miel.
        Todos los derechos reservados.
      </p>

    

    </div>

  </footer>

  <!-- RECOMMENDATION MODAL -->
  <RecommendationModal
    :is-open="isModalOpen"
    @close="closeRecommendationModal"
    @submit="handleRecommendationSubmit"
  />

</template>