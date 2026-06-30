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
  />
</div>

    <!-- NAME -->
    <p class="testi-name">
      {{ name }}
    </p>

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