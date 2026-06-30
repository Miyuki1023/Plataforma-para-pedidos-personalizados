<script setup lang="ts">
import { ref, computed } from 'vue'

import BaseIcon from '../../atoms/BaseIcon.vue'
import TestimonialCard from '../../molecules/TestimonialCard.vue'

const testimonials = [
  {
    name: 'Isabel Rodríguez',
    stars: 5,
    text: 'El Midnight Ganache es, sin duda, la mejor experiencia de chocolate que he tenido en mi vida.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  },

  {
    name: 'Mateo Sánchez',
    stars: 5,
    text: 'Increíble atención al detalle. La torta personalizada superó nuestras expectativas.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  },

  {
    name: 'Lucía Fernández',
    stars: 5,
    text: 'La calidad de los ingredientes se nota en cada bocado.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'
  },

  {
    name: 'Camila Torres',
    stars: 5,
    text: 'Los cupcakes llegaron frescos y hermosos.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  },

  {
    name: 'Sebastián Navarro',
    stars: 5,
    text: 'Todo se nota hecho con muchísimo cuidado.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
  },

  {
    name: 'Valentina Rojas',
    stars: 5,
    text: 'La cheesecake fue simplemente perfecta.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80'
  }
]

/* ACTIVE CENTER */

const currentIndex = ref(1)

/* NEXT */

const nextSlide = () => {
  currentIndex.value =
    currentIndex.value === testimonials.length - 1
      ? 0
      : currentIndex.value + 1
}

/* PREV */

const prevSlide = () => {
  currentIndex.value =
    currentIndex.value === 0
      ? testimonials.length - 1
      : currentIndex.value - 1
}

/* VISIBLE */

const visibleTestimonials = computed(() => {

  const prev =
    testimonials[
      (currentIndex.value - 1 + testimonials.length)
      % testimonials.length
    ]

  const current =
    testimonials[currentIndex.value]

  const next =
    testimonials[
      (currentIndex.value + 1)
      % testimonials.length
    ]

  return [
    prev,
    current,
    next
  ]
})
</script>

<template>

  <section class="testi-section">

    <!-- INTRO -->
    <div class="section-intro">

      <span class="section-eyebrow">
        TESTIMONIOS
      </span>

      <h2 class="section-heading">
        Lo que dicen nuestros clientes
      </h2>

    </div>

    <!-- SLIDER -->
    <div class="testi-carousel">

      <!-- LEFT -->
      <button
        class="testi-arrow"
        @click="prevSlide"
        aria-label="Testimonio anterior"
      >
        <BaseIcon
          name="arrow-left"
          :size="22"
          color="var(--primary)"
        />
      </button>

      <!-- CARDS -->
      <div class="testi-cards">

        <div
          v-for="(testimonial, index) in visibleTestimonials"
          :key="testimonial.name"
          class="testi-card-wrapper"
          :class="{
            center: index === 1
          }"
        >

          <TestimonialCard
            v-bind="testimonial"
            :active="index === 1"
          />

        </div>

      </div>

      <!-- RIGHT -->
      <button
        class="testi-arrow"
        @click="nextSlide"
        aria-label="Siguiente testimonio"
      >
        <BaseIcon
          name="arrow-right"
          :size="22"
          color="var(--primary)"
        />
      </button>

    </div>

    <!-- DOTS -->
    <div class="testi-dots">

      <button
        v-for="(_, i) in testimonials"
        :key="i"
        class="dot"
        :class="{ active: currentIndex === i }"
        @click="currentIndex = i"
        :aria-label="'Ir al testimonio ' + (i + 1)"
      />

    </div>

  </section>

</template>