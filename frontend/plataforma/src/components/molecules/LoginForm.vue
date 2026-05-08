<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const handleSubmit = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos.'
    return
  }
  loading.value = true
  try {
    // TODO: reemplazar con tu llamada al backend
    await new Promise(r => setTimeout(r, 1200))
    router.push('/home') // Redirige a la página de inicio después del login exitoso
  } catch {
    error.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit" novalidate>

    <div class="field-group">
      <BaseInput v-model="email" type="email" placeholder="usua@gmail.com">
        <template #icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3"/>
            <polyline points="2,4 12,13 22,4"/>
          </svg>
        </template>
      </BaseInput>
      <div class="forgot-link">
        <a href="#">¿Olvidaste tu contraseña?</a>
      </div>
    </div>

    <div class="field-group">
      <BaseInput v-model="password" type="password" placeholder="••••••••••••••">
        <template #icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </template>
      </BaseInput>
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>

    <p class="register-text">
      ¿Aún no tienes cuenta?&nbsp;
      <RouterLink to="/register">¡Crea una ahora!</RouterLink>
    </p>

    <BaseButton type="submit" :disabled="loading">
      <span v-if="!loading">Enviar</span>
      <span v-else class="spinner" />
    </BaseButton>

  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.forgot-link {
  display: flex;
  justify-content: flex-end;
  padding-right: 0.25rem;
}
.forgot-link a,
.register-text a {
  font-family: var(--sans);
  font-size: 0.82rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}
.forgot-link a:hover,
.register-text a:hover { opacity: 0.7; }
.register-text {
  font-family: var(--sans);
  font-size: 0.88rem;
  color: var(--text);
  text-align: center;
  margin: 0.25rem 0;
}
.form-error {
  font-family: 'Lato', sans-serif;
  font-size: 0.83rem;
  color: #c0392b;
  text-align: center;
  margin: 0;
}
</style>