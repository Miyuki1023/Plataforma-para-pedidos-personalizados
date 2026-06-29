<script setup lang="ts">
import LoginForm from '../components/molecules/LoginForm.vue'
</script>

<template>
  <main class="form-page">
    <div class="login-hero" role="img" aria-label="Imagen decorativa de pastelería" />

    <div class="login-panel">
      <div class="login-card">
        <h1 class="form-title">Bienvenido</h1>
        <p class="form-descripcion">
          Para acceder a la plataforma y gestionar tus datos de manera segura
        </p>
        <LoginForm />
      </div>
    </div>
  </main>
</template>
