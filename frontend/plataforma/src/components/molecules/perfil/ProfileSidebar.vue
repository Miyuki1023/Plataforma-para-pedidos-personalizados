<!-- molecules/perfil/ProfileSidebar.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseInput from '../../atoms/BaseInput.vue'
import PrimaryButton from '../../atoms/PrimaryButton.vue'
import { useAuthStore } from '../../../stores/auth'
import { apiService } from '../../../modules/service/api.service'

interface Address {
  id: number
  label: string
  street: string
  reference?: string
  isDefault?: boolean
}

interface Props {
  name: string
  lastName?: string
  phone: string
  email: string
  fotoPerfil?: string
}

const props = defineProps<Props>()

const authStore = useAuthStore()

/* ── DATOS PERSONALES ── */
const localName  = ref(props.name)
const localLastName = ref(props.lastName || '')
const localPhone = ref(props.phone)
const localFoto = ref(props.fotoPerfil || '')
const savingProfile = ref(false)
const profileMsg = ref('')

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      localFoto.value = e.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const saveProfile = async () => {
  if (localPhone.value && !/^\d{9}$/.test(localPhone.value)) {
    profileMsg.value = '✗ El teléfono debe tener 9 dígitos'
    return
  }

  savingProfile.value = true
  profileMsg.value = ''
  try {
    await authStore.updateProfile({
      usuario: localName.value,
      apellido: localLastName.value,
      telefono: localPhone.value,
      foto_perfil: localFoto.value
    })
    profileMsg.value = '✓ Cambios guardados'
  } catch (err: any) {
    // Ahora el mensaje mostrará el error real (ej: "Payload Too Large" o "no existe la columna apellido")
    profileMsg.value = `✗ ${err.message || 'Error al guardar'}`
  } finally {
    savingProfile.value = false
    setTimeout(() => { profileMsg.value = '' }, 3000)
  }
}

/* ── DIRECCIONES ── */
const addresses = ref<Address[]>([])
const districts = ref<{ id: number; distrito: string }[]>([])
const loadingAddr = ref(false)
const showNewForm = ref(false)
const newLabel = ref('')
const newStreet = ref('')
const newRef = ref('')
const savingAddr = ref(false)
const addrError = ref('')
const deletingId = ref<number | null>(null)
const selectedDistrictId = ref<number | null>(null)

onMounted(async () => {
  if (authStore.token) {
    await fetchAddresses()
    await fetchDistricts()
  }
})

const fetchAddresses = async () => {
  loadingAddr.value = true
  try {
    const res = await apiService.get('/addresses')
    // El backend devuelve { addresses: [...] }
    const raw = res.addresses || (Array.isArray(res) ? res : [])
    addresses.value = raw.map((a: any) => ({
      id: a.id,
      label: a.nombre_direccion,
      street: a.direccion,
      reference: a.referencia,
      isDefault: a.is_default
    }))
  } catch {
    addresses.value = []
  } finally {
    loadingAddr.value = false
  }
}

const fetchDistricts = async () => {
  try {
    const res = await apiService.get('/addresses/districts')
    // Normalizamos la respuesta para aceptar tanto un array directo como un objeto con la propiedad districts
    districts.value = Array.isArray(res) ? res : (res.districts || [])
  } catch (err) {
    console.error('Error fetching districts:', err)
  }
}

const addAddress = async () => {
  if (!newStreet.value.trim() || !selectedDistrictId.value) {
    addrError.value = 'Calle y distrito son requeridos.'
    return
  }
  addrError.value = ''
  savingAddr.value = true
  try {
    const payload = {
      nombre_direccion: newLabel.value.trim() || 'Mi dirección',
      direccion: newStreet.value.trim(),
      referencia: newRef.value.trim(),
      id_distrito: selectedDistrictId.value,
      is_default: addresses.value.length === 0
    }
    const res = await apiService.post('/addresses', payload)
    const newAddr = res.address || res
    
    addresses.value.push({ 
      id: newAddr.id, 
      label: newAddr.nombre_direccion, 
      street: newAddr.direccion, 
      reference: newAddr.referencia, 
      isDefault: newAddr.is_default 
    })

    showNewForm.value = false
    newLabel.value = ''
    newStreet.value = ''
    newRef.value = ''
    selectedDistrictId.value = null
  } catch (err: any) {
    addrError.value = err.message || 'No se pudo guardar.'
  } finally {
    savingAddr.value = false
  }
}

const setDefault = async (id: number) => {
  try {
    await apiService.patch(`/addresses/${id}/default`)
    addresses.value = addresses.value.map(a => ({
      ...a,
      isDefault: a.id === id
    }))
  } catch {}
}

const deleteAddress = async (id: number) => {
  deletingId.value = id
  try {
    await apiService.delete(`/addresses/${id}`)
    addresses.value = addresses.value.filter(a => a.id !== id)
  } catch {}
  deletingId.value = null
}
</script>

<template>
  <aside class="premium-sidebar">
    <!-- ── DATOS PERSONALES ── -->
    <div class="sidebar-section-header">
      <h2 class="sidebar-title">Mi Perfil</h2>
      <p class="sidebar-subtitle">Actualiza tu información y gestiona tus entregas.</p>
    </div>

    <div class="sidebar-form">
      <!-- FOTO DE PERFIL -->
      <div class="profile-photo-section">
        <div class="photo-container">
          <img :src="localFoto || '/user.jpg'" alt="Avatar" class="main-photo" />
          <label class="photo-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <input type="file" accept="image/*" @change="handlePhotoUpload" hidden />
          </label>
        </div>
        <div class="photo-info">
          <span class="photo-title">Foto de perfil</span>
          <p class="photo-hint">Toca la cámara para cambiarla</p>
        </div>
      </div>

      <div class="input-group">
        <label class="field-label">Nombre de usuario</label>
        <BaseInput v-model="localName" placeholder="Tu nombre" />
      </div>

      <div class="input-group">
        <label class="field-label">Apellido</label>
        <BaseInput v-model="localLastName" placeholder="Tu apellido" />
      </div>
      
      <div class="input-group">
        <label class="field-label">Teléfono de contacto</label>
        <BaseInput v-model="localPhone" placeholder="Ej: 987654321" maxlength="9" />
      </div>
     
      <div class="input-group locked">
        <label class="field-label">Correo Electrónico</label>
        <BaseInput :model-value="email" :disabled="true" />
        <span class="field-info">El correo electrónico no puede ser modificado por seguridad.</span>
      </div> 
    </div>

    <p v-if="profileMsg" class="profile-msg" :class="{ error: profileMsg.startsWith('✗') }">
      {{ profileMsg }}
    </p>

    <PrimaryButton
      class="btn-save-profile"
      :text="savingProfile ? 'Guardando…' : 'Guardar Cambios'"
      :disabled="savingProfile"
      @click="saveProfile"
    />

    <!-- ── DIRECCIONES ── -->
    <div class="addresses-section">
      <div class="addr-header">
        <h3 class="addr-title">Mis Direcciones</h3>
        <button class="addr-add-btn" @click="showNewForm = !showNewForm">
          {{ showNewForm ? '✕ Cancelar' : '+ Agregar' }}
        </button>
      </div>

      <div v-if="loadingAddr" class="addr-loading">Cargando...</div>

      <template v-else>
        <!-- LISTA -->
        <div v-if="addresses.length > 0" class="addr-list">
          <div v-for="addr in addresses" :key="addr.id" class="addr-item">
            <div class="addr-item-info">
              <div class="addr-item-top">
                <span class="addr-label">{{ addr.label }}</span>
                <span v-if="addr.isDefault" class="addr-default-pill">Principal</span>
              </div>
              <p class="addr-street">{{ addr.street }}</p>
              <p v-if="addr.reference" class="addr-reference">📌 {{ addr.reference }}</p>
            </div>

            <div class="addr-item-actions">
              <button
                v-if="!addr.isDefault"
                class="addr-action-btn"
                title="Marcar como principal"
                @click="setDefault(addr.id)"
              >⭐</button>

              <button
                class="addr-action-btn addr-action-btn--del"
                title="Eliminar"
                :disabled="deletingId === addr.id"
                @click="deleteAddress(addr.id)"
              >🗑</button>
            </div>
          </div>
        </div>

        <p v-else class="addr-empty">No tienes direcciones guardadas.</p>

        <!-- FORMULARIO NUEVA -->
        <div v-if="showNewForm" class="addr-new-form">
          <div class="form-row">
            <label class="form-label">Nombre de dirección</label>
            <input v-model="newLabel" class="addr-input" placeholder="Ej: Mi Casa, Oficina..." />
            <span class="input-help">Ayuda a identificarla rápido.</span>
          </div>

          <div class="form-row">
            <label class="form-label">Dirección exacta *</label>
            <input v-model="newStreet" class="addr-input" placeholder="Calle, número, dpto..." />
          </div>

          <div class="form-row">
            <label class="form-label">Distrito *</label>
            <select v-model="selectedDistrictId" class="addr-input addr-select">
              <option :value="null" disabled>Selecciona tu distrito</option>
              <option v-for="d in districts" :key="d.id" :value="d.id">
                {{ d.distrito }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <label class="form-label">Referencia</label>
            <input v-model="newRef" class="addr-input" placeholder="Ej: Portón blanco, frente al parque" />
            <span class="input-help">Indicaciones útiles para el reparto.</span>
          </div>

          <p v-if="addrError" class="addr-error">{{ addrError }}</p>
          <button class="addr-save-btn" :disabled="savingAddr" @click="addAddress">
            {{ savingAddr ? 'Guardando…' : 'Guardar dirección' }}
          </button>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
/* ── GENERAL ── */
.premium-sidebar {
  background: #F4EDE6;
  padding: 2.5rem;
  border-radius: 28px;
  box-shadow: 0 8px 30px rgba(0,0,0,.02);
  border: 1px solid rgba(0,0,0,.03);
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sidebar-section-header {
  margin-bottom: 0.5rem;
}

.sidebar-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.5px;
}

.sidebar-subtitle {
  font-size: 0.85rem;
  color: #6d5d5d;
  margin: 0.3rem 0 0;
  line-height: 1.4;
}

/* ── NUEVO PHOTO EDITOR ── */
.profile-photo-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
}

.photo-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(139, 49, 52, 0.15);
  flex-shrink: 0;
}

.main-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.photo-container:hover .photo-overlay {
  opacity: 1;
}

.photo-info {
  display: flex;
  flex-direction: column;
}

.photo-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2f2f2f;
}

.photo-hint {
  font-size: 0.75rem;
  color: #9a8880;
  margin: 0;
}

.sidebar-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #4a3f3f;
  margin-left: 0.5rem;
}

.field-info {
  font-size: 0.75rem;
  color: #9a8880;
  font-style: italic;
  margin-left: 0.5rem;
}

.btn-save-profile {
  width: 100%;
  margin-top: 0.5rem;
  box-shadow: 0 10px 20px rgba(139, 49, 52, 0.15);
  transition: all 0.3s ease;
}

.profile-msg {
  font-size: .84rem;
  font-weight: 600;
  color: #2e7d32;
  text-align: center;
  margin: 0;
}

.profile-msg.error { color: #c0392b; }

/* Bloqueo de Input */
.input-group.locked {
  opacity: 0.85;
  opacity: 0.8;
  cursor: not-allowed;
}

/* ── ADDRESSES ── */
.addresses-section {
  margin-top: .5rem;
  display: flex;
  flex-direction: column;
  gap: .9rem;
}

.addr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.addr-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0;
}

.addr-add-btn {
  border: none;
  background: transparent;
  color: #8b3134;
  font-weight: 700;
  font-size: .85rem;
  cursor: pointer;
  padding: .3rem .6rem;
  border-radius: 8px;
  transition: background .2s;
}

.addr-add-btn:hover { background: rgba(139,49,52,.08); }

.addr-loading {
  font-size: .85rem;
  color: #8b3134;
}

.addr-list {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.addr-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .7rem;
  padding: 1rem;
  border-radius: 14px;
  background: white;
  border: 1px solid #ead8c8;
  transition: box-shadow .2s;
}

.addr-item:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,.05);
}

.addr-item-info { flex: 1; }

.addr-item-top {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: .25rem;
}

.addr-label {
  font-weight: 700;
  font-size: .9rem;
  color: #2f2f2f;
}

.addr-default-pill {
  background: #8b3134;
  color: white;
  font-size: .62rem;
  font-weight: 700;
  padding: .15rem .5rem;
  border-radius: 999px;
}

.addr-street {
  font-size: .82rem;
  color: #5a4a4a;
  margin: 0;
}

.addr-reference {
  font-size: .75rem;
  color: #9a8880;
  margin: .2rem 0 0;
  font-style: italic;
}

.addr-item-actions {
  display: flex;
  gap: .4rem;
  flex-shrink: 0;
}

.addr-action-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: .25rem;
  border-radius: 8px;
  transition: background .2s;
}

.addr-action-btn:hover { background: #f0e6df; }
.addr-action-btn--del:hover { background: #fce4e4; }
.addr-action-btn:disabled { opacity: .4; cursor: not-allowed; }

.addr-empty {
  font-size: .85rem;
  color: #9a8880;
  font-style: italic;
  margin: 0;
}

/* FORM */
.addr-new-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 14px;
  background: white;
  border: 1px dashed #c9a8a8;
  animation: fadeDown .25s ease;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2f2f2f;
}

.input-help {
  font-size: 0.75rem;
  color: #9a8880;
}

.addr-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b3134' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.addr-input {
  width: 100%;
  border: 1px solid #ead8c8;
  background: #fdf8f5;
  border-radius: 10px;
  padding: .7rem .9rem;
  font-size: .88rem;
  outline: none;
  transition: border-color .2s;
}

.addr-input:focus { border-color: #8b3134; }

.addr-error {
  font-size: .8rem;
  color: #c0392b;
  margin: 0;
}

.addr-save-btn {
  width: 100%;
  padding: .75rem;
  border: none;
  border-radius: 10px;
  background: #8b3134;
  color: white;
  font-weight: 700;
  font-size: .88rem;
  cursor: pointer;
  transition: .22s;
}

.addr-save-btn:hover:not(:disabled) {
  background: #721f22;
  transform: translateY(-1px);
}

.addr-save-btn:disabled { opacity: .6; cursor: not-allowed; }

@media (max-width: 1100px) {
  .premium-sidebar { position: static; }
}

@media (max-width: 768px) {
  .premium-sidebar { padding: 1.5rem; border-radius: 22px; }
}
</style>