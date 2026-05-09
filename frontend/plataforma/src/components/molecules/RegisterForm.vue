<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'

const username = ref('')
const email = ref('')
const password = ref('')
const acceptPolicy = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''

  if (!username.value || !email.value || !password.value) {
    error.value = 'Por favor completa todos los campos.'
    return
  }
  if (!acceptPolicy.value) {
    error.value = 'Debes aceptar la política de privacidad.'
    return
  }

  loading.value = true
  try {
    // TODO: reemplazar con tu llamada al backend
    await new Promise(r => setTimeout(r, 1200))
    console.log('Registro:', { username: username.value, email: email.value })
  } catch {
    error.value = 'Ocurrió un error. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-L-R" @submit.prevent="handleSubmit" novalidate>

    <!-- Username -->
    <BaseInput v-model="username" type="text" placeholder="Nombre de usuario">
      <template #icon>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Email -->
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

    <!-- Password -->
    <BaseInput v-model="password" type="password" placeholder="Password">
      <template #icon>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Policy -->
    <BaseCheckbox v-model="acceptPolicy" class="center">
      Estoy de acuerdo con la
      <a href="#">política de privacidad</a>.
    </BaseCheckbox>

    <!-- Error -->
    <p v-if="error" class="form-error">{{ error }}</p>

    <!-- Submit -->
    <BaseButton type="submit" :disabled="loading">
      <span v-if="!loading">Registrar</span>
      <span v-else class="spinner" />
    </BaseButton>

    <!-- Login link -->
    <p class="login-text">
      Ya tiene una cuenta?&nbsp;
      <RouterLink to="/login">Inicia Sesión</RouterLink>
    </p>

  </form>
</template>
