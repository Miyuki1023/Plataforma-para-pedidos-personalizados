<script setup lang="ts">
import BaseBadge from '../atoms/BaseBadge.vue'

import { useRouter } from 'vue-router'
const router = useRouter()
const goToProduct = () => {

  router.push(
    `/producto/${props.id}`
  )
}

const props = defineProps<{
  id: string | number
  image: string
  badge?: string
  title: string
  subtitle: string
  desc: string
}>()
</script>

<template>

  <article class="promo-card">

    <!-- IMAGE -->
    <div class="promo-image-wrapper">

      <img
        :src="image"
        :alt="title"
        class="promo-image"
      />

      <!-- BADGE -->
      <BaseBadge
  v-if="badge"
  class="promo-badge"
>
  {{ badge }}
</BaseBadge>

    </div>

    <!-- CONTENT -->
    <div class="promo-body">

      <div class="promo-texts">

        <h4 class="promo-title">
          {{ title }}
        </h4>

        <p class="promo-subtitle">
          {{ subtitle }}
        </p>

        <p class="promo-description">
          {{ desc }}
        </p>

      </div>

      <!-- LINK -->
      <a
        href="#"
        @click="goToProduct"

        class="promo-link"
      >
        Ver detalles

        <svg
          class="promo-link-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14"/>
          <path d="M13 5l7 7-7 7"/>
        </svg>

      </a>

    </div>

  </article>

</template>