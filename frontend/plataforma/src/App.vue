<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()

// Escuchar cambios en la ruta globalmente para reiniciar el scroll
watch(() => router.currentRoute.value.fullPath, () => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <RouterView />
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; width: 100%; }
body { background: #fdf8f5; -webkit-font-smoothing: antialiased; }
</style>