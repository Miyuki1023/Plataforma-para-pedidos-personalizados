<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'
import { useAuthStore } from '../../stores/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const birthdate = ref('')
const acceptPolicy = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

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
    const signupData: any = {
      usuario: username.value,
      email: email.value,
      password: password.value,
      sexo: 'M' // Valor por defecto requerido por el backend
    }

    // Solo enviamos estos campos si tienen contenido real para evitar errores de validación por strings vacíos
    if (phone.value.trim()) signupData.telefono = phone.value;
    if (birthdate.value) signupData.fecha_nacimiento = birthdate.value;

    console.log('Enviando datos de registro:', signupData);

    await authStore.register(signupData)

    router.push('/login')
  } catch (err: any) {
    console.error('Error detallado del registro:', err.response?.data);
    
    // Intentamos extraer el mensaje específico de express-validator si existe
    const backendErrors = err.response?.data?.errors;
    error.value = Array.isArray(backendErrors) 
      ? backendErrors[0].msg 
      : (err.message || 'Error al registrarse. Revisa los requisitos.');
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

    <!-- Phone -->
    <BaseInput v-model="phone" type="tel" placeholder="999 999 999">
      <template #icon>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.19-1.3a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Birthdate -->
    <BaseInput v-model="birthdate" type="date" placeholder="Fecha de nacimiento">
      <template #icon>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
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
