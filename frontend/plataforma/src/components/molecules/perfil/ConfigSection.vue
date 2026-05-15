<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '../../atoms/BaseIcon.vue'
import { useAuthStore } from '../../../stores/auth'
import { apiService } from '../../../modules/service/api.service'

const authStore = useAuthStore()
const router = useRouter()
const notificationsActive = ref(true)
const showPasswordModal = ref(false)
const step = ref(1)
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const sendCode = async () => {
  loading.value = true
  error.value = ''
  try {
    // Endpoint para solicitar el código de reseteo
    await apiService.post('/auth/request-reset-code', { email: authStore.user?.email })
    step.value = 2
  } catch (err: any) {
    error.value = err.message || 'Error al enviar el código.'
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  if (verificationCode.value.length === 4) {
    loading.value = true
    error.value = ''
    try {
      // Endpoint para validar que el código de 4 dígitos es correcto
      await apiService.post('/auth/verify-reset-code', { 
        email: authStore.user?.email, 
        code: verificationCode.value 
      })
      step.value = 3
    } catch (err: any) {
      error.value = 'Código incorrecto o expirado.'
    } finally {
      loading.value = false
    }
  }
}

const savePassword = async () => {
  error.value = ''
  if (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value
  ) {
    loading.value = true
    try {
      // Usamos la función del store para actualizar el perfil en la DB
      await authStore.updateProfile({ 
        password: newPassword.value 
      })

      alert('Contraseña actualizada correctamente')
      showPasswordModal.value = false
      step.value = 1
      verificationCode.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } catch (err: any) {
      error.value = err.message || 'No se pudo guardar la contraseña.'
    } finally {
      loading.value = false
    }
  } else {
    error.value = 'Las contraseñas no coinciden.'
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/') // Redirigir al inicio después de cerrar sesión
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
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
        @click.self="showPasswordModal = false"
      >

        <div class="mini-modal-card">

          <button
            class="mini-close-btn"
            @click="showPasswordModal = false"
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
              Enviaremos un código de verificación a tu correo electrónico.
            </p>

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
              Ingresa el código de 4 dígitos enviado a tu correo.
            </p>

            <input
              v-model="verificationCode"
              type="text"
              maxlength="4"
              class="mini-input-code"
              placeholder="0000"
            />

            <p v-if="error" class="mini-modal-error">{{ error }}</p>

            <button
              class="mini-modal-btn"
              :disabled="loading || verificationCode.length < 4"
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
                v-model="newPassword"
                type="password"
                placeholder="Nueva contraseña"
                class="mini-input"
              />

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
              :disabled="loading"
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