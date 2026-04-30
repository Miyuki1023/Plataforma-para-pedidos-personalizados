<script setup lang="ts">
import RegisterForm from '../components/molecules/RegisterForm.vue'
</script>

<template>
  <div class="register-page">

    <!-- Left: Hero image -->
    <div class="register-hero" />

    <!-- Right: Form panel -->
    <div class="register-panel">
      <div class="register-card">

        <h1 class="register-title">Crea tu cuenta</h1>

        <p class="register-subtitle">
          Descubre un espacio pensado para ti.
        </p>

        <RegisterForm />

      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rochester&display=swap');

.register-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.register-hero {
  flex: 1;
  background-image: url('../assets/img_register.png');
  background-size: cover;
  background-position: left;
}

.register-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #ffffff;
}

.register-card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeUp 0.6s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.register-title {
  font-family: 'Rochester', cursive;
  font-size: 2.8rem;
  font-weight: 600;
  color: #8b1a2e;
  text-align: center;
  margin: 0;
  padding-bottom: 3%;
}

.register-subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: #9e8080;
  text-align: center;
  margin: 0;
}

@media (max-width: 768px) {
  .register-page { flex-direction: column; }
  .register-hero { height: 240px; flex: none; }
  .register-panel { flex: none; padding: 2rem 1.5rem; }
  .register-title { font-size: 2.1rem; }
}
</style>