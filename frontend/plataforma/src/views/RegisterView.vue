<script setup lang="ts">
import RegisterForm from '../components/molecules/RegisterForm.vue'
</script>

<template>
  <div class="form-page">
    <div class="register-hero" />
    <div class="register-panel">
      <div class="register-card">
        <h1 class="form-title">Crea tu cuenta</h1>
        <p class="form-descripcion">
          Descubre un espacio pensado para ti.
        </p>
        <RegisterForm />
      </div>
    </div>

  </div>
</template>