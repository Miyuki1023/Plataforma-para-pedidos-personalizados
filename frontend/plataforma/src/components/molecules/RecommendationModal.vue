<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '../atoms/BaseIcon.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: FormData): void
}

interface FormData {
  name: string
  email: string
  rating: number
  category: string
  message: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<FormData>({
  name: '',
  email: '',
  rating: 5,
  category: 'recommendation',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

const categories = [
  { value: 'recommendation', label: '✨ Recomendación' },
  { value: 'feedback', label: '💬 Sugerencia' },
  { value: 'complaint', label: '⚠️ Queja' },
  { value: 'question', label: '❓ Pregunta' }
]

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('Por favor completa todos los campos')
    return
  }

  isSubmitting.value = true

  // Simular envío
  setTimeout(() => {
    emit('submit', formData.value)
    submitted.value = true
    isSubmitting.value = false

    // Reset después de 2 segundos
    setTimeout(() => {
      resetForm()
      emit('close')
    }, 2000)
  }, 800)
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    rating: 5,
    category: 'recommendation',
    message: ''
  }
  submitted.value = false
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isOpen"
    class="modal-backdrop"
    @click="handleClose"
  />

  <!-- Modal -->
  <div
    v-if="isOpen"
    class="recommendation-modal"
  >
    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-title">Libro de Recomendaciones</h2>
      <button
        class="modal-close"
        @click="handleClose"
        aria-label="Cerrar modal"
      >
        <BaseIcon name="close" :size="24" color="#08060d" />
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="submitted" class="success-message">
      <div class="success-icon">
        <BaseIcon name="check" :size="40" color="#2ecc71" />
      </div>
      <p class="success-text">¡Gracias por tu mensaje!</p>
      <p class="success-subtext">Nos encanta recibir tu feedback</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="modal-form">
      <!-- Name Input -->
      <div class="form-group">
        <label for="name" class="form-label">Nombre *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="Tu nombre"
          required
        />
      </div>

      <!-- Email Input -->
      <div class="form-group">
        <label for="email" class="form-label">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="tu@email.com"
          required
        />
      </div>

      <!-- Category Select -->
      <div class="form-group">
        <label for="category" class="form-label">Tipo de Mensaje *</label>
        <select
          id="category"
          v-model="formData.category"
          class="form-select"
          required
        >
          <option
            v-for="cat in categories"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Rating (solo para recomendaciones) -->
      <div v-if="formData.category === 'recommendation'" class="form-group">
        <label for="rating" class="form-label">Calificación</label>
        <div class="rating-container">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            :class="['rating-star', { active: star <= formData.rating }]"
            @click="formData.rating = star"
            :aria-label="`${star} estrellas`"
          >
            ⭐
          </button>
        </div>
      </div>

      <!-- Message Textarea -->
      <div class="form-group">
        <label for="message" class="form-label">Tu Mensaje *</label>
        <textarea
          id="message"
          v-model="formData.message"
          class="form-textarea"
          placeholder="Cuéntanos tu experiencia..."
          rows="5"
          required
        />
        <p class="char-count">{{ formData.message.length }}/500</p>
      </div>

      <!-- Buttons -->
      <div class="form-buttons">
        <button
          type="button"
          class="btn-cancel"
          @click="handleClose"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn-submit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Enviar Mensaje</span>
          <span v-else>Enviando...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* ========================= MODAL BACKDROP ========================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

/* ========================= MODAL CONTAINER ========================= */
.recommendation-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;

  /* Mobile */
  width: 90%;
  max-width: 100%;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .recommendation-modal {
    width: 85%;
    max-width: 500px;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .recommendation-modal {
    width: 90%;
    max-width: 550px;
  }
}

/* Laptop: 1024px+ */
@media (min-width: 1024px) {
  .recommendation-modal {
    max-width: 600px;
    border-radius: 28px;
  }
}

/* Desktop: 1440px+ */
@media (min-width: 1440px) {
  .recommendation-modal {
    max-width: 650px;
  }
}

/* ========================= MODAL HEADER ========================= */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(139, 26, 46, 0.08);
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .modal-header {
    padding: 1.8rem;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .modal-header {
    padding: 2rem;
  }
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #08060d;
  font-family: 'Rubik', system-ui, sans-serif;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .modal-title {
    font-size: 1.5rem;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .modal-title {
    font-size: 1.7rem;
  }
}

/* Laptop: 1024px+ */
@media (min-width: 1024px) {
  .modal-title {
    font-size: 1.9rem;
  }
}

.modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.modal-close:hover {
  background: rgba(139, 26, 46, 0.08);
}

/* ========================= SUCCESS MESSAGE ========================= */
.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  animation: slideIn 0.3s ease;
}

.success-icon {
  margin-bottom: 1.5rem;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

.success-text {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #08060d;
}

.success-subtext {
  margin: 0;
  font-size: 0.95rem;
  color: #6b6375;
}

/* ========================= FORM ========================= */
.modal-form {
  padding: 1.5rem;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .modal-form {
    padding: 1.8rem;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .modal-form {
    padding: 2rem;
  }
}

/* ========================= FORM GROUP ========================= */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-of-type {
  margin-bottom: 2rem;
}

/* ========================= FORM LABEL ========================= */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #08060d;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .form-label {
    font-size: 0.95rem;
  }
}

/* ========================= FORM INPUT ========================= */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(139, 26, 46, 0.12);
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #08060d;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #AF3439;
  box-shadow: 0 0 0 3px rgba(175, 52, 57, 0.1);
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.85rem 1.1rem;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
  }
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23AF3439' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1.2em;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .form-textarea {
    min-height: 140px;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .form-textarea {
    min-height: 160px;
  }
}

/* ========================= CHARACTER COUNT ========================= */
.char-count {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6b6375;
  text-align: right;
}

/* ========================= RATING CONTAINER ========================= */
.rating-container {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.rating-star {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s ease, transform 0.2s ease;
  padding: 0.4rem;
}

.rating-star:hover,
.rating-star.active {
  opacity: 1;
  transform: scale(1.15);
}

/* ========================= FORM BUTTONS ========================= */
.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Mobile */
.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.85rem 1.2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

/* Tablet: 480px+ */
@media (min-width: 480px) {
  .btn-cancel,
  .btn-submit {
    flex: none;
    padding: 0.9rem 1.5rem;
  }
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .btn-cancel,
  .btn-submit {
    padding: 1rem 1.8rem;
    font-size: 1rem;
  }
}

.btn-cancel {
  background: rgba(139, 26, 46, 0.08);
  color: #AF3439;
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(139, 26, 46, 0.12);
}

.btn-submit {
  background: linear-gradient(135deg, #AF3439, #8B1A2E);
  color: white;
  box-shadow: 0 4px 12px rgba(175, 52, 57, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(175, 52, 57, 0.4);
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========================= ANIMATIONS ========================= */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========================= SCROLLBAR ========================= */
.recommendation-modal::-webkit-scrollbar {
  width: 8px;
}

.recommendation-modal::-webkit-scrollbar-track {
  background: transparent;
}

.recommendation-modal::-webkit-scrollbar-thumb {
  background: rgba(139, 26, 46, 0.2);
  border-radius: 4px;
}

.recommendation-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 26, 46, 0.3);
}
</style>
