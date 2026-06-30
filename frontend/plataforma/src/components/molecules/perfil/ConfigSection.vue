<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '../../atoms/BaseIcon.vue'
import { useAuthStore } from '../../../stores/auth'
import { apiService } from '../../../lib/api.ts'

const authStore = useAuthStore()
const router = useRouter()
const notificationsActive = ref(true)
const showPasswordModal = ref(false)
const step = ref(1)
const verificationCode = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const emailToVerify = ref('')
const loading = ref(false)
const error = ref('')
const attemptCount = ref(0)
const maxAttempts = 3
const isBlocked = ref(false)
const blockTimer = ref<number | null>(null)
  // ✅ Validar contraseña fuerte
const isPasswordStrong = (password: string): boolean => {
  // Al menos 8 caracteres, mayúscula, minúscula, número
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return hasMinLength && hasUppercase && hasLowercase && hasNumber
}

const getPasswordStrengthMessage = (password: string): string => {
  if (password.length < 8) return 'Mínimo 8 caracteres'
  if (!/[A-Z]/.test(password)) return 'Necesita mayúsculas'
  if (!/[a-z]/.test(password)) return 'Necesita minúsculas'
  if (!/[0-9]/.test(password)) return 'Necesita números'
  return '✅ Contraseña fuerte'
}

const sendCode = async () => {
  error.value = ''
  
  // ✅ Validar que el correo ingresado coincida con el de la cuenta
  const inputEmail = emailToVerify.value.toLowerCase().trim()
  const userEmail = authStore.user?.email?.toLowerCase().trim()

  if (!inputEmail || inputEmail !== userEmail) {
    error.value = 'El correo electrónico no coincide con el registrado en tu cuenta.'
    return
  }

  loading.value = true
  try {
    // Enviamos el código al servidor usando el correo validado
    await apiService.post('/auth/forgot-password', { email: inputEmail })
    step.value = 2
    attemptCount.value = 0
    isBlocked.value = false
  } catch (err: any) {
    error.value = err.message || 'Error al enviar el código.'
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  error.value = ''

  // ✅ Validar que el correo no haya sido alterado durante el proceso
  if (emailToVerify.value.toLowerCase().trim() !== authStore.user?.email?.toLowerCase().trim()) {
    error.value = 'El correo electrónico ha cambiado. Inicia el proceso de nuevo.'
    step.value = 1
    return
  }

  // ✅ Validar que el código sea numérico
  if (!/^\d{6}$/.test(verificationCode.value)) {
    error.value = 'El código debe tener exactamente 6 dígitos.'
    return
  }

  if (isBlocked.value) return

  loading.value = true
  try {
    // ✅ Validar código en el servidor antes de avanzar al Paso 3
    await apiService.post('/auth/verify-reset-code', {
      email: emailToVerify.value,
      code: verificationCode.value
    })

    step.value = 3
    error.value = ''
    attemptCount.value = 0
  } catch (err: any) {
    attemptCount.value++
    error.value = err.response?.data?.message || 'El código es incorrecto.'

    if (attemptCount.value >= maxAttempts) {
      isBlocked.value = true
      error.value = 'Demasiados intentos fallidos. Por seguridad, espera 5 minutos.'
      
      if (blockTimer.value) clearTimeout(blockTimer.value)
      blockTimer.value = setTimeout(() => {
        isBlocked.value = false
        attemptCount.value = 0
      }, 300000) // 5 minutos reales (300,000 ms)
    }
  } finally {
    loading.value = false
  }
}

const savePassword = async () => {
  error.value = ''
  
  // ✅ Validaciones de contraseña
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Completa todos los campos obligatorios.'
    return
  }

  if (newPassword.value === currentPassword.value) {
    error.value = 'La nueva contraseña no puede ser igual a la antigua.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  if (!isPasswordStrong(newPassword.value)) {
    error.value = getPasswordStrengthMessage(newPassword.value)
    return
  }

  loading.value = true
  try {
    // ✅ El backend ahora requiere verifyToken
    await apiService.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      email: authStore.user?.email,
      code: verificationCode.value,
      newPassword: newPassword.value
    })

    alert('Contraseña actualizada correctamente')
    showPasswordModal.value = false
    step.value = 1
    verificationCode.value = ''
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    attemptCount.value = 0
  } catch (err: any) {
    error.value = err.message || 'No se pudo guardar la contraseña.'
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await apiService.post('/auth/logout', {})
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  } finally {
    authStore.logout()
    router.push('/home')
  }
}

const closeModal = () => {
  showPasswordModal.value = false
  step.value = 1
  error.value = ''
  emailToVerify.value = ''
  if (blockTimer.value) clearTimeout(blockTimer.value)
}
</script>

<template>

  <section class="mini-premium-config">

    <!-- HEADER -->
    <div class="mini-config-header">

      <div class="mini-title-wrap">

        <div class="mini-config-icon-main">
          <BaseIcon
            name="settings"
            :size="18"
          />
        </div>

        <div>
          <h2 class="mini-config-title">
            Configuración
          </h2>

          <p class="mini-config-subtitle">
            Seguridad y preferencias
          </p>
        </div>

      </div>

    </div>

    <!-- ITEMS -->
    <div class="mini-config-list">

      <!-- NOTIFICATIONS -->
      <div class="mini-config-item">

        <div class="mini-config-left">

          <div class="mini-config-icon notifications">
            <BaseIcon
              :name="notificationsActive ? 'bell' : 'bell-off'"
              :size="16"
            />
          </div>

          <div>

            <h3 class="mini-config-label">
              Notificaciones
            </h3>

            <p class="mini-config-desc">
              Alertas y promociones
            </p>

          </div>

        </div>

        <label class="mini-switch">

          <input
            type="checkbox"
            v-model="notificationsActive"
          />

          <span class="mini-slider"></span>

        </label>

      </div>

      <!-- PASSWORD -->
      <button
        class="mini-config-item mini-password-btn"
        @click="showPasswordModal = true"
      >

        <div class="mini-config-left">

          <div class="mini-config-icon security">
            <BaseIcon
              name="lock"
              :size="16"
            />
          </div>

          <div>

            <h3 class="mini-config-label">
              Password
            </h3>

            <p class="mini-config-desc">
              Cambiar contraseña
            </p>

          </div>

        </div>

        <BaseIcon
          name="chevron-right"
          :size="16"
          class="mini-arrow"
        />

      </button>

      <!-- LOGOUT -->
      <button
        class="mini-config-item mini-logout-btn"
        @click="handleLogout"
      >

        <div class="mini-config-left">

          <div class="mini-config-icon logout">
            <BaseIcon
              name="user"
              :size="16"
            />
          </div>

          <div>
            <h3 class="mini-config-label logout-text">
              Cerrar sesión
            </h3>
            <p class="mini-config-desc">
              Finalizar sesión actual
            </p>
          </div>
        </div>

        <BaseIcon
          name="chevron-right"
          :size="16"
          class="mini-arrow"
        />
      </button>

    </div>

    <!-- MODAL -->
    <Teleport to="body">

      <div
        v-if="showPasswordModal"
        class="mini-modal-overlay"
        @click.self="closeModal"
      >

        <div class="mini-modal-card">

          <button
            class="mini-close-btn"
            @click="closeModal"
          >
            ×
          </button>

          <!-- STEP 1 -->
          <template v-if="step === 1">

            <div class="mini-modal-icon">
              <BaseIcon
                name="lock"
                :size="28"
              />
            </div>

            <h3 class="mini-modal-title">
              Validar identidad
            </h3>

            <p class="mini-modal-text">
              Por seguridad, confirma el correo electrónico asociado a tu cuenta para recibir el código.
            </p>

            <input
              v-model="emailToVerify"
              type="email"
              class="mini-input"
              placeholder="tu@correo.com"
              :disabled="loading"
            />

            <p v-if="error" class="mini-modal-error">{{ error }}</p>

            <button
              class="mini-modal-btn"
              :disabled="loading"
              @click="sendCode"
            >
              <span v-if="!loading">Enviar código</span>
              <span v-else class="mini-spinner"></span>
            </button>

          </template>

          <!-- STEP 2 -->
          <template v-if="step === 2">

            <div class="mini-modal-icon">
              <BaseIcon
                name="mail"
                :size="28"
              />
            </div>

            <h3 class="mini-modal-title">
              Verificación
            </h3>

            <p class="mini-modal-text">
              Ingresa el código de 6 dígitos enviado a tu correo.
            </p>

            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              class="mini-input-code"
              placeholder="000000"
              :disabled="isBlocked"
            />

            <p v-if="error" class="mini-modal-error">{{ error }}</p>

            <button
              class="mini-modal-btn"
              :disabled="loading || verificationCode.length < 6 || isBlocked"
              @click="verifyCode"
            >
              <span v-if="!loading">Confirmar código</span>
              <span v-else class="mini-spinner"></span>
            </button>

          </template>

          <!-- STEP 3 -->
          <template v-if="step === 3">

            <div class="mini-modal-icon">
              <BaseIcon
                name="shield-check"
                :size="28"
              />
            </div>

            <h3 class="mini-modal-title">
              Nueva contraseña
            </h3>

            <div class="mini-password-form">

              <input
                v-model="currentPassword"
                type="password"
                placeholder="Contraseña antigua"
                class="mini-input"
              />
              
              <input
                v-model="newPassword"
                type="password"
                placeholder="Nueva contraseña"
                class="mini-input"
              />
              
              <!-- ✅ Indicador de fortaleza -->
              <small 
                :class="{
                  'text-success': isPasswordStrong(newPassword),
                  'text-warning': newPassword && !isPasswordStrong(newPassword)
                }"
              >
                {{ getPasswordStrengthMessage(newPassword) }}
              </small>

              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                class="mini-input"
              />

            </div>

            <p v-if="error" class="mini-modal-error">{{ error }}</p>

            <button
              class="mini-modal-btn"
              :disabled="loading || !isPasswordStrong(newPassword) || newPassword !== confirmPassword"
              @click="savePassword"
            >
              <span v-if="!loading">Guardar contraseña</span>
              <span v-else class="mini-spinner"></span>
            </button>

          </template>

        </div>

      </div>

    </Teleport>

  </section>

</template>