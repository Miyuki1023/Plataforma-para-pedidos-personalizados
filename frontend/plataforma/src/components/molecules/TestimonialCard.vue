<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

defineProps<{
  name: string
  text: string
  avatar: string
  stars?: number
  active?: boolean
}>()
</script>

<template>

  <article
    class="testimonial"
    :class="{ active }"
  >

    <!-- AVATAR -->
   <div class="testi-avatar">
  <img
    :src="avatar"
    :alt="name"
    class="testi-avatar-image"
    width="150"
    height="150"
    loading="lazy"
    decoding="async"
  />
</div>

    <!-- NAME -->
    <h3 class="testi-name">
      {{ name }}
    </h3>

    <!-- STARS -->
    <div class="testi-stars">

      <BaseIcon
        v-for="i in 5"
        :key="i"
        name="star"
        :size="16"
        :color="
          i <= (stars ?? 5)
            ? '#f59e0b'
            : '#ececec'
        "
      />

    </div>
    <p class="testi-text">
      “{{ text }}”
    </p>

  </article>

</template>