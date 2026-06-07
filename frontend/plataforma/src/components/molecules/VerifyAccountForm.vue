<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { apiService } from '../../modules/service/api.service'
import BaseButton from '../atoms/BaseButton.vue'
import BaseInput from '../atoms/BaseInput.vue'

const route = useRoute()
const router = useRouter()
const email = ref(String(route.query.email || ''))
const code = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const timer = ref(60)
let timerInterval: any = null

const startTimer = () => {
  timer.value = 60
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else clearInterval(timerInterval)
  }, 1000)
}

const resendCode = async () => {
  if (timer.value > 0 || !email.value) {
    if (!email.value) error.value = 'No se encontró el correo. Intenta registrarte de nuevo.';
    return;
  }
  
  loading.value = true
  error.value = ''
  try {
    await apiService.post('/auth/resend-verification', { 
      email: email.value.toLowerCase().trim() 
    })
    startTimer()
    alert('Se ha enviado un nuevo código a tu correo.')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al reenviar el código.'
  } finally {
    loading.value = false
  }
}

const handleVerify = async () => {
  const cleanCode = code.value.trim()
  if (cleanCode.length !== 6) {
    error.value = 'El código debe tener 6 dígitos.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await apiService.post('/auth/verify-account', {
      email: email.value.toLowerCase().trim(),
      code: cleanCode
    })
    success.value = true
    setTimeout(() => router.push('/login'), 2500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Código inválido o expirado.'
  } finally {
    loading.value = false
  }
}

onMounted(startTimer)
onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <div class="login-panel">
    <div class="login-card">
      <form v-if="!success" class="form-L-R" @submit.prevent="handleVerify">
        <h2 class="form-title">Verifica tu cuenta</h2>
        
        <p class="form-descripcion">
          Ingresa el código de 6 dígitos enviado a:<br>
          <strong style="color: var(--primary)">{{ email }}</strong>
        </p>
        
        <BaseInput 
          v-model="code" 
          type="text" 
          placeholder="000000" 
          maxlength="6"
          @keypress="(e: KeyboardEvent) => !/[0-9]/.test(e.key) && e.preventDefault()"
        >
          <template #icon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </template>
        </BaseInput>

        <p v-if="error" class="form-error">{{ error }}</p>

        <!-- Contador / Reenvío -->
        <p class="timer-text">
          <span v-if="timer > 0">Reenviar código en: <strong>{{ timer }}s</strong></span>
          <button 
            v-else 
            type="button" 
            class="resend-btn" 
            @click="resendCode"
          >Volver a enviar código de verificación si no ha llegado</button>
        </p>

        <BaseButton type="submit" variant="primary" :disabled="loading">
          <span v-if="!loading">Confirmar Registro</span>
          <span v-else class="spinner"></span>
        </BaseButton>
        
        <p class="login-text">
          ¿No es tu correo?&nbsp;
          <RouterLink to="/register">Regresar</RouterLink>
        </p>
      </form>

      <div v-else class="success-state">
        <div class="check-icon">✓</div>
        <h2 class="form-title">¡Excelente!</h2>
        <p class="form-descripcion">
          Tu cuenta ha sido activada correctamente.<br>
          Redirigiendo al inicio de sesión...
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Solo estilos específicos no presentes en style.css */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.check-icon {
  width: 64px;
  height: 64px;
  background: #e6f4ee;
  color: #2e7d52;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 16px rgba(46, 125, 82, 0.1);
}

.timer-text {
  text-align: center;
  font-size: 0.85rem;
  color: #9e8080;
  margin: 1rem 0;
}

.resend-btn {
  background: none;
  border: none;
  color: #8b1a2e;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
}
</style>
