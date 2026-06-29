<!-- molecules/DeliveryCard.vue -->

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'
import { useAuthStore } from '../../stores/auth'
import { apiService } from '../../modules/service/api.service'

const props = defineProps<{
  day: string
  schedule: string
}>()

const emit = defineEmits([
  'update:day',
  'update:schedule',
  'update:addressId'
])

const authStore = useAuthStore()
const router = useRouter()

/* ── DÍAS (3 próximos desde hoy) ── */
const days = computed(() => {
  const result = []
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const today = new Date()
  for (let i = 0; i <= 3; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    result.push({
      label: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      day: dayNames[d.getDay()],
      fullDate: d.toISOString().split('T')[0]
    })
  }
  return result
})

const isTodaySelected = computed(() => {
  const today = new Date()
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const todayLabel = `${monthNames[today.getMonth()]} ${today.getDate()}`
  return props.day === todayLabel
})

const currentHour = new Date().getHours()

const morningDisabled = computed(() => isTodaySelected.value && currentHour >= 7)
const afternoonDisabled = computed(() => isTodaySelected.value && currentHour >= 12)
const nightDisabled = computed(() => isTodaySelected.value && currentHour >= 18)

const scheduleOptions = computed(() => [
  { label: 'Mañana (07:00 - 09:00)', icon: '☀️', disabled: morningDisabled.value },
  { label: 'Tarde (12:00 - 03:00)', icon: '⛅', disabled: afternoonDisabled.value },
  { label: 'Noche (06:00 - 09:00)', icon: '🌙', disabled: nightDisabled.value }
])

/* ── AUTO-AJUSTE DE HORARIO SI EL DÍA ES HOY ── */
watch(() => props.day, () => {
  if (isTodaySelected.value) {
    if (morningDisabled.value && props.schedule === 'Mañana (07:00 - 09:00)') {
      const nextSchedule = afternoonDisabled.value ? 'Noche (06:00 - 09:00)' : 'Tarde (12:00 - 03:00)'
      emit('update:schedule', nextSchedule)
    } else if (afternoonDisabled.value && props.schedule === 'Tarde (12:00 - 03:00)') {
      emit('update:schedule', 'Noche (06:00 - 09:00)')
    }
  }
})

/* ── DIRECCIONES ── */
interface Address {
  id: number
  label: string
  street: string
  reference?: string
  isDefault?: boolean
}

const addresses = ref<Address[]>([])
const districts = ref<{ id: number; distrito: string }[]>([])
const selectedAddressId = ref<number | null>(null)
const useNewAddress = ref(false)
const newStreet = ref('')
const newLabel = ref('')
const newReference = ref('')
const saveNewAddress = ref(false)
const loadingAddresses = ref(false)
const savingAddress = ref(false)
const errorAddress = ref('')
const selectedDistrictId = ref<number | null>(null)

onMounted(async () => {
  if (authStore.token) {
    await fetchAddresses()
    await fetchDistricts()
  }
})

const fetchAddresses = async () => {
  loadingAddresses.value = true
  try {
    const res = await apiService.get('/addresses')
    const rawData = res.addresses || (Array.isArray(res) ? res : [])
    addresses.value = rawData.map((a: any) => ({
      id: a.id,
      label: a.nombre_direccion || 'Mi dirección',
      street: a.direccion || a.calle,
      reference: a.referencia || a.reference,
      isDefault: a.is_default || a.isDefault
    }))
    const def = addresses.value.find(a => a.isDefault)
    if (def) {
      selectedAddressId.value = def.id
      emit('update:addressId', def.id)
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
      emit('update:addressId', addresses.value[0].id)
    } else {
      useNewAddress.value = true
    }
  } catch {
    addresses.value = []
    useNewAddress.value = true
  } finally {
    loadingAddresses.value = false
  }
}

const selectAddress = (id: number) => {
  selectedAddressId.value = id
  useNewAddress.value = false
  emit('update:addressId', id)
}

const fetchDistricts = async () => {
  try {
    const res = await apiService.get('/addresses/districts')
    districts.value = Array.isArray(res) ? res : (res.districts || [])
  } catch (err) {
    console.error('Error fetching districts:', err)
  }
}

const handleSaveAndSelect = async () => {
  if (!newStreet.value.trim() || !selectedDistrictId.value) {
    errorAddress.value = 'Ingresa calle y selecciona un distrito.'
    return
  }
  errorAddress.value = ''
  savingAddress.value = true
  try {
    const payload = {
      nombre_direccion: newLabel.value.trim() || 'Mi dirección',
      direccion: newStreet.value.trim(),
      referencia: newReference.value.trim(),
      id_distrito: selectedDistrictId.value,
      is_default: addresses.value.length === 0
    }
    const res = await apiService.post('/addresses', payload)
    const newAddr = res.address || res
    const saved: Address = {
      id: newAddr.id,
      label: newAddr.nombre_direccion,
      street: newAddr.direccion,
      reference: newAddr.referencia,
      isDefault: newAddr.is_default
    }

    await fetchAddresses()
    const refreshed = addresses.value.find((addr) => addr.id === saved.id)
    if (refreshed) {
      selectedAddressId.value = refreshed.id
      emit('update:addressId', refreshed.id)
    } else {
      addresses.value.push(saved)
      selectedAddressId.value = saved.id
      emit('update:addressId', saved.id)
    }

    useNewAddress.value = false
    newStreet.value = ''
    newLabel.value = ''
    newReference.value = ''
    selectedDistrictId.value = null
  } catch {
    errorAddress.value = 'No se pudo guardar la dirección.'
  } finally {
    savingAddress.value = false
  }
}
</script>

<template>
  <div class="delivery-card">
    <h2 class="delivery-title">Detalles de Entrega</h2>

    <!-- ── DÍAS ── -->
    <div class="delivery-group">
      <p class="group-label">Día seleccionado</p>
      <div class="days-grid">
        <button
          v-for="d in days"
          :key="d.label"
          class="day-btn"
          :class="{ active: day === d.label }"
          @click="$emit('update:day', d.label)"
        >
          <strong>{{ d.label }}</strong>
          <span>{{ d.day }}</span>
        </button>
      </div>
    </div>

    <!-- ── HORARIO ── -->
    <div class="delivery-group">
      <p class="group-label">Ventana de entrega</p>
      <div class="schedules-list">
        <button
          v-for="opt in scheduleOptions"
          :key="opt.label"
          class="schedule-btn"
          :class="{ active: schedule === opt.label }"
          :disabled="opt.disabled"
          @click="$emit('update:schedule', opt.label)"
        >
          <span class="schedule-icon">{{ opt.icon }}</span>
          <span class="schedule-text">{{ opt.label }}</span>
        </button>
      </div>
    </div>

    <!-- ── DIRECCIÓN ── -->
    <div class="delivery-group">
      <p class="group-label">Dirección de envío</p>

      <!-- Usuario NO logueado -->
      <div v-if="!authStore.token" class="addr-guest">
        <p class="addr-guest-text">
          Para continuar con tu pedido necesitas una cuenta.
        </p>
        <button class="addr-login-btn" @click="router.push('/login')">
          Iniciar sesión / Registrarse
        </button>
      </div>

      <!-- Usuario logueado -->
      <template v-else>
        <div v-if="loadingAddresses" class="addr-loading">
          <span class="mini-spinner"></span> Cargando direcciones...
        </div>

        <template v-else>
          <!-- Direcciones guardadas -->
          <div v-if="addresses.length > 0" class="addr-list">
            <button
              v-for="addr in addresses"
              :key="addr.id"
              class="addr-chip"
              :class="{ active: selectedAddressId === addr.id && !useNewAddress }"
              @click="selectAddress(addr.id)"
            >
              <span class="addr-chip-icon">📍</span>
              <span class="addr-chip-info">
                <strong>{{ addr.label }}</strong>
                <small>{{ addr.street }}</small>
                <small v-if="addr.reference" class="addr-ref">Ref: {{ addr.reference }}</small>
              </span>
              <span v-if="addr.isDefault" class="addr-default-badge">Principal</span>
            </button>

            <!-- Opción nueva dirección -->
            <button
              class="addr-chip addr-chip--new"
              :class="{ active: useNewAddress }"
              @click="useNewAddress = true; selectedAddressId = null"
            >
              <span class="addr-chip-icon">＋</span>
              <span class="addr-chip-info">
                <strong>Nueva dirección</strong>
              </span>
            </button>
          </div>

          <!-- Formulario nueva dirección -->
          <div v-if="useNewAddress" class="new-addr-form">
            <input
              v-model="newLabel"
              class="addr-input"
              placeholder="Etiqueta (Ej: Casa, Trabajo)"
            />
            <input
              v-model="newStreet"
              class="addr-input"
              placeholder="Calle y número *"
            />
            <input
              v-model="newReference"
              class="addr-input"
              placeholder="Referencia (opcional)"
            />

            <!-- ✅ SELECT DE DISTRITO -->
            <select v-model="selectedDistrictId" class="addr-input addr-select">
              <option :value="null" disabled>Selecciona un distrito *</option>
              <option
                v-for="d in districts"
                :key="d.id"
                :value="d.id"
              >
                {{ d.distrito }}
              </option>
            </select>

            <p v-if="errorAddress" class="addr-error">{{ errorAddress }}</p>

            <BaseCheckbox v-model="saveNewAddress">
              Guardar dirección en mi perfil
            </BaseCheckbox>

            <button
              class="addr-save-btn"
              :disabled="savingAddress"
              @click="handleSaveAndSelect"
            >
              <span v-if="!savingAddress">
                {{ saveNewAddress ? 'Guardar y usar esta dirección' : 'Usar esta dirección' }}
              </span>
              <span v-else class="mini-spinner"></span>
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.delivery-card {
  padding: 2rem;
  border-radius: 2rem;
  background: white;
  border: 1px solid #ead8c8;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.delivery-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #2f2f2f;
  margin-bottom: 1.5rem;
}

.delivery-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.group-label {
  font-size: .8rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #8b3134;
}

/* DAYS */
.days-grid {
  display: flex;
  gap: .8rem;
}

.day-btn {
  flex: 1;
  border: 1px solid #ead8c8;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: .3rem;
  transition: .25s;
  font-size: .9rem;
}

.day-btn.active {
  background: #8b3134;
  color: white;
  border-color: #8b3134;
}

/* SCHEDULE */
.schedules-list {
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

.schedule-btn {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: .85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid #ead8c8;
  background: #fdf8f5;
  cursor: pointer;
  text-align: left;
  transition: .22s ease;
}

.schedule-btn.active {
  border-color: #8b3134;
  background: rgba(139, 49, 52, .06);
  box-shadow: 0 6px 16px rgba(139,49,52,.08);
}

.schedule-btn.active .schedule-text {
  color: #8b3134;
}

.schedule-btn:hover:not(.active):not(:disabled) {
  border-color: #c9a8a8;
  transform: translateY(-1px);
}

.schedule-btn:disabled {
  opacity: .5;
  filter: grayscale(1);
  cursor: pointer;
}

.addr-guest {
  display: flex;
  flex-direction: column;
  gap: .85rem;
  padding: 1.2rem;
  background: #fdf8f5;
  border-radius: 14px;
  border: 1px dashed #ead8c8;
  text-align: center;
}

.addr-guest-text {
  font-size: .88rem;
  color: #857871;
  margin: 0;
}

.addr-login-btn {
  padding: .75rem 1rem;
  border: none;
  border-radius: 12px;
  background: #8b3134;
  color: white;
  font-weight: 700;
  font-size: .9rem;
  cursor: pointer;
  transition: .22s;
}

.schedule-icon {
  font-size: 1.1rem;
}

.schedule-text {
  font-size: .9rem;
  font-weight: 700;
  color: #2f2f2f;
}

.addr-login-btn:hover {
  background: #721f22;
  transform: translateY(-1px);
}

.addr-select {
  appearance: auto;
  color: #5a3a2a;
  cursor: pointer;
}
/* ADDRESS LIST */
.addr-loading {
  display: flex;
  align-items: center;
  gap: .6rem;
  color: #8b3134;
  font-size: .9rem;
}

.addr-list {
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

.addr-chip {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: .85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid #ead8c8;
  background: #fdf8f5;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: .22s ease;
  position: relative;
}

.addr-chip.active {
  border-color: #8b3134;
  background: rgba(139, 49, 52, .06);
  box-shadow: 0 6px 16px rgba(139,49,52,.08);
}

.addr-chip:hover:not(.active) {
  border-color: #c9a8a8;
  transform: translateY(-1px);
}

.addr-chip--new {
  border-style: dashed;
  color: #8b3134;
}

.addr-chip-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.addr-chip-info {
  display: flex;
  flex-direction: column;
  gap: .15rem;
}

.addr-chip-info strong {
  font-size: .9rem;
  color: #2f2f2f;
}

.addr-chip-info small {
  font-size: .78rem;
  color: #857871;
}

.addr-ref {
  color: #b09080 !important;
  font-style: italic;
}

.addr-default-badge {
  position: absolute;
  right: .9rem;
  top: 50%;
  transform: translateY(-50%);
  background: #8b3134;
  color: white;
  font-size: .65rem;
  font-weight: 700;
  padding: .2rem .55rem;
  border-radius: 999px;
}

/* NEW ADDRESS FORM */
.new-addr-form {
  display: flex;
  flex-direction: column;
  gap: .85rem;
  padding: 1.2rem;
  background: #fdf8f5;
  border-radius: 14px;
  border: 1px solid #ead8c8;
  animation: fadeDown .25s ease;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.addr-input {
  width: 100%;
  border: 1px solid #ead8c8;
  background: white;
  border-radius: 10px;
  padding: .75rem 1rem;
  font-size: .9rem;
  outline: none;
  transition: border-color .2s;
}

.addr-input:focus {
  border-color: #8b3134;
}

.addr-error {
  font-size: .82rem;
  color: #c0392b;
  margin: 0;
}

.addr-save-btn {
  width: 100%;
  padding: .85rem;
  border: none;
  border-radius: 12px;
  background: #8b3134;
  color: white;
  font-weight: 700;
  font-size: .9rem;
  cursor: pointer;
  transition: .22s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addr-save-btn:hover:not(:disabled) {
  background: #721f22;
  transform: translateY(-1px);
}

.addr-save-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* SPINNER */
.mini-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>