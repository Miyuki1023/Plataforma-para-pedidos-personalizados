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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rochester&display=swap');

.login-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
}
.login-hero {
  flex: 1;
  background-image: url('../assets/img_login.png');
  background-size: cover;
  background-position: left;
}
.login-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #ffffff;
}
.login-card {
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
.login-title {
  font-family: 'Rochester', cursive;
  font-size: 3rem;
  font-weight: 600;
  color: #8b1a2e;
  text-align: center;
  margin: 0;
  padding-bottom: 3%;
}
.login-subtitle {
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: #9e8080;
  text-align: center;
  line-height: 1.5;
  margin: 0;
}
@media (max-width: 768px) {
  .login-page { flex-direction: column; }
  .login-hero { height: 240px; flex: none; }
  .login-panel { flex: none; padding: 2rem 1.5rem; }
  .login-title { font-size: 2.25rem; }
}
</style>