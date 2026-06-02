<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { apiService } from '../../modules/service/api.service'
import BaseButton from '../atoms/BaseButton.vue'
import BaseInput from '../atoms/BaseInput.vue'

const router = useRouter()
const email = ref('')
const code = ref('')
const newPassword = ref('')
const step = ref(1)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRequestCode = async () => {
  if (!email.value) return error.value = 'Ingresa tu correo'
  loading.value = true
  error.value = ''
  try {
    await apiService.post('/auth/forgot-password', { email: email.value })
    step.value = 2
  } catch (err: any) {
    error.value = err.message || 'Error al solicitar código.'
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (code.value.length !== 6) return error.value = 'El código debe tener 6 dígitos'
  if (newPassword.value.length < 6) return error.value = 'Mínimo 6 caracteres'
  
  loading.value = true
  error.value = ''
  try {
    await apiService.post('/auth/change-password', {
      email: email.value,
      code: code.value,
      newPassword: newPassword.value
    })
    success.value = true
    setTimeout(() => router.push('/login'), 3000)
  } catch (err: any) {
    error.value = err.message || 'Código inválido o expirado.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-panel">
    <div class="login-card">
      <form v-if="!success" class="form-L-R" @submit.prevent="step === 1 ? handleRequestCode() : handleChangePassword()">
        <h2 class="form-title">Recuperar Acceso</h2>
        <p class="form-descripcion">
          {{ step === 1 ? 'Ingresa tu correo para enviarte un código.' : 'Ingresa el código enviado y tu nueva contraseña.' }}
        </p>

        <BaseInput v-if="step === 1" v-model="email" type="email" placeholder="tu-correo@gmail.com" />
        
        <template v-else>
          <BaseInput v-model="code" type="text" placeholder="Código de 6 dígitos" maxlength="6" />
          <BaseInput v-model="newPassword" type="password" placeholder="Nueva contraseña" />
        </template>

        <p v-if="error" class="form-error">{{ error }}</p>

        <BaseButton type="submit" :disabled="loading">
          <span v-if="!loading">{{ step === 1 ? 'Enviar código' : 'Cambiar contraseña' }}</span>
          <span v-else class="spinner"></span>
        </BaseButton>

        <p class="login-text">
          <RouterLink to="/login">Volver al inicio de sesión</RouterLink>
        </p>
      </form>

      <div v-else class="success-state">
        <div class="check-icon">✓</div>
        <h2 class="form-title">¡Todo listo!</h2>
        <p class="form-descripcion">Tu contraseña ha sido cambiada. Revisa tu correo para la confirmación. Redirigiendo...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1rem 0; }
.check-icon {
  width: 64px; height: 64px; background: #e6f4ee; color: #2e7d52;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; box-shadow: 0 8px 16px rgba(46, 125, 82, 0.1);
}
</style>