<script setup lang="ts">
defineProps<{
  name: 'heart' | 'truck' | 'leaf' | 'star' | 'cart' | 'search' | 'user' | 'menu' | 'arrow-left' | 'arrow-right' | 'instagram' | 'facebook' | 'tiktok' | 'book'
  size?: number
  color?: string
}>()
</script>

<template>
  <svg
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color ?? 'currentColor'"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- heart -->
    <path v-if="name === 'heart'" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    <!-- truck -->
    <template v-if="name === 'truck'">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </template>
    <!-- leaf -->
    <path v-if="name === 'leaf'" d="M17 8C8 10 5.9 16.17 3.82 19.34a1 1 0 0 0 1.49 1.29C9 17 11 15 17 14c0 0-4 4-4 8"/>
    <!-- star -->
    <polygon v-if="name === 'star'" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>
    <!-- cart -->
    <template v-if="name === 'cart'">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </template>
    <!-- search -->
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </template>
    <!-- user -->
    <template v-if="name === 'user'">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </template>
    <!-- menu -->
    <template v-if="name === 'menu'">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </template>
    <!-- arrow-left -->
    <template v-if="name === 'arrow-left'">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 8 8 12 12 16"/>
      <line x1="16" y1="12" x2="8" y2="12"/>
    </template>
    <!-- arrow-right -->
    <template v-if="name === 'arrow-right'">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 8 16 12 12 16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </template>
    <!-- instagram -->
    <template v-if="name === 'instagram'">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </template>
    <!-- facebook -->
    <path v-if="name === 'facebook'" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    <!-- tiktok -->
    <path v-if="name === 'tiktok'" d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    <!-- book -->
    <template v-if="name === 'book'">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </template>
  </svg>
</template>