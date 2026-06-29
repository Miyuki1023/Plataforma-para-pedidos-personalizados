<script setup lang="ts">
import { ref } from 'vue'
import { apiService } from '../../lib/api'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', product: any): void
}>()

const form = ref({
  nombre: '',
  precio: '',
  categoria: '',
  stock: '',
  descripcion: '',
  imagenUrls: '',
  opciones: [] as { nombre: string; precio_adicional: number }[]
})

const loading = ref(false)
const error = ref('')

function addOption() {
  form.value.opciones.push({ nombre: '', precio_adicional: 0 })
}

function removeOption(index: number) {
  form.value.opciones.splice(index, 1)
}

async function handleSubmit() {
  // Validar campos
  if (!form.value.nombre.trim()) {
    error.value = 'El nombre del producto es requerido'
    return
  }

  if (!form.value.precio || Number(form.value.precio) <= 0) {
    error.value = 'El precio debe ser mayor a 0'
    return
  }

  if (!form.value.categoria.trim()) {
    error.value = 'La categoría es requerida'
    return
  }

  if (!form.value.stock || Number(form.value.stock) < 0) {
    error.value = 'El stock debe ser mayor o igual a 0'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const imagenUrls = form.value.imagenUrls
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0)

    const response = await apiService.post('/productos', {
      nombre: form.value.nombre,
      precio: Number(form.value.precio),
      categoria: form.value.categoria,
      stock: Number(form.value.stock),
      descripcion: form.value.descripcion || null,
      imagenUrls: imagenUrls.length > 0 ? imagenUrls : null
    })

    // Crear opciones si existen
    const newProductId = response.data?.product?.id
    if (newProductId && form.value.opciones.length > 0) {
      for (const opt of form.value.opciones) {
        if (opt.nombre.trim()) {
          await apiService.post(`/productos/${newProductId}/options`, opt)
        }
      }
    }

    emit('created', response.data?.product)
    resetForm()
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear producto'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    nombre: '',
    precio: '',
    categoria: '',
    stock: '',
    descripcion: '',
    imagenUrls: '',
    opciones: []
  }
  error.value = ''
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-content">
        <button class="modal-close" @click="$emit('close')" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div class="modal-body">
          <h2 class="modal-title">Nuevo Producto</h2>

          <div v-if="error" class="error-message">{{ error }}</div>

          <form @submit.prevent="handleSubmit" class="form">
            <!-- Nombre -->
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre del Producto *</label>
              <input
                id="nombre"
                v-model="form.nombre"
                type="text"
                class="form-input"
                placeholder="Ej: Torta de Vainilla"
                required
              />
            </div>

            <!-- Precio -->
            <div class="form-row">
              <div class="form-group">
                <label for="precio" class="form-label">Precio (S/) *</label>
                <input
                  id="precio"
                  v-model="form.precio"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  placeholder="50.00"
                  required
                />
              </div>

              <!-- Stock -->
              <div class="form-group">
                <label for="stock" class="form-label">Stock *</label>
                <input
                  id="stock"
                  v-model="form.stock"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <!-- Categoría -->
            <div class="form-group">
              <label for="categoria" class="form-label">Categoría *</label>
              <select id="categoria" v-model="form.categoria" class="form-input" required>
                <option value="">Selecciona una categoría</option>
                <option value="Tortas">Tortas</option>
                <option value="Pastelería">Pastelería</option>
                <option value="Postres">Postres</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <!-- Descripción -->
            <div class="form-group">
              <label for="descripcion" class="form-label">Descripción</label>
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                class="form-input form-textarea"
                placeholder="Describe el producto..."
                rows="3"
              />
            </div>

            <!-- URLs de Imagen -->
            <div class="form-group">
              <label for="imagenUrls" class="form-label">URLs de Imagen (separadas por comas)</label>
              <input
                id="imagenUrls"
                v-model="form.imagenUrls"
                type="text"
                class="form-input"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <!-- Opciones de Personalización -->
            <div class="form-group">
              <div class="options-header">
                <label class="form-label">Opciones de Personalización</label>
                <button type="button" class="btn-add-option" @click="addOption">
                  <span class="material-symbols-rounded">add_circle</span>
                  Agregar
                </button>
              </div>
              
              <div v-for="(opt, index) in form.opciones" :key="index" class="option-row">
                <input v-model="opt.nombre" placeholder="Nombre (ej: Sabor Vainilla)" class="form-input" />
                <div class="price-input-wrapper">
                  <span class="currency">S/</span>
                  <input v-model.number="opt.precio_adicional" type="number" step="0.1" class="form-input" placeholder="0.00" />
                </div>
                <button type="button" class="btn-remove-option" @click="removeOption(index)">
                  <span class="material-symbols-rounded">delete</span>
                </button>
              </div>
            </div>

            <!-- Botones -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Creando...' : 'Crear Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9e8080;
  transition: color 0.2s;
  z-index: 10;
}

.modal-close:hover {
  color: #8b1a2e;
}

.modal-body {
  padding: 2rem;
}

.modal-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #2a1a1a;
  margin: 0 0 1.5rem 0;
}

.error-message {
  background: #fde8e8;
  color: #9b1c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #9e8080;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #f5ece4;
  border-radius: 8px;
  transition: all 0.2s;
  background: #ffffff;
  color: #2a1a1a;
}

.form-input:focus {
  outline: none;
  border-color: #8b1a2e;
  box-shadow: 0 0 0 3px rgba(139, 26, 46, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.btn-add-option {
  background: transparent;
  border: none;
  color: #8b1a2e;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.option-row {
  display: grid;
  grid-template-columns: 1fr 100px 40px;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.price-input-wrapper .currency {
  position: absolute;
  left: 8px;
  font-size: 0.8rem;
  color: #9e8080;
}

.price-input-wrapper input { padding-left: 24px; }

.btn-remove-option {
  background: #fde8e8;
  color: #9b1c1c;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f5ece4;
}

.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  background: #f5ece4;
  color: #8b1a2e;
  border: none;
  border-radius: 12px;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #ece0d5;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: #8b1a2e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #a82339;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
