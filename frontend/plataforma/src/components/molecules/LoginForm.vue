<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { useAuthStore } from '../../stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos.'
    return
  }
  loading.value = true
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })

    // Redirección basada en el ID de Rol
    const userRole = authStore.user?.rol

    if (userRole === 2) {
      router.push('/empleado')
    } else if (userRole === 3) {
      router.push('/admin')
    } else {
      router.push('/home')
    }
  } catch (err: any) {
    error.value = err.message || 'Credenciales incorrectas. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-L-R" @submit.prevent="handleSubmit" novalidate>

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
        <RouterLink to="/forgot-password">¿Olvidaste tu contraseña?</RouterLink>
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
