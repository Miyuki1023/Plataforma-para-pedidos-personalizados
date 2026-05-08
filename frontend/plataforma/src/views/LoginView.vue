<script setup lang="ts">
import LoginForm from '../components/molecules/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <div class="login-hero" />

    <div class="login-panel">
      <div class="login-card">
        <h1 class="login-title">Bienvenido</h1>
        <p class="login-subtitle">
          Para acceder a la plataforma y gestionar tus datos de manera segura
        </p>
        <LoginForm />
      </div>
    </div>
  </div>
</template>