<script setup lang="ts">
import { ref, computed } from 'vue'

import BaseIcon from '../../atoms/BaseIcon.vue'
import TestimonialCard from '../../molecules/TestimonialCard.vue'

const testimonials = [
  {
    name: 'Isabel Rodríguez',
    stars: 5,
    text: 'El Midnight Ganache es, sin duda, la mejor experiencia de chocolate que he tenido en mi vida.'
  },

  {
    name: 'Mateo Sánchez',
    stars: 5,
    text: 'Increíble atención al detalle. La torta personalizada superó nuestras expectativas.'
  },

  {
    name: 'Lucía Fernández',
    stars: 5,
    text: 'La calidad de los ingredientes se nota en cada bocado.'
  },

  {
    name: 'Camila Torres',
    stars: 5,
    text: 'Los cupcakes llegaron frescos y hermosos.'
  },

  {
    name: 'Sebastián Navarro',
    stars: 5,
    text: 'Todo se nota hecho con muchísimo cuidado.'
  },

  {
    name: 'Valentina Rojas',
    stars: 5,
    text: 'La cheesecake fue simplemente perfecta.'
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

      <span
        v-for="(_, i) in testimonials"
        :key="i"
        class="dot"
        :class="{ active: currentIndex === i }"
        @click="currentIndex = i"
      />

    </div>

  </section>

</template>