<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '../components/organisms/Employe/AdminSidebar.vue'
import AppTopBar from '../components/organisms/Employe/AppTopBar.vue'
import { apiService } from '../modules/service/api.service'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const currentPage = ref(1)
const perPage = 8
const users = ref<any[]>([])
const loading = ref(false)
const error = ref('')

// Modal para nuevo empleado
const isModalOpen = ref(false)
const saving = ref(false)
const newEmployee = ref({
  usuario: '',
  apellido: '',
  email: '',
  password: '',
  rol: 2, // Por defecto Rol 2 (Trabajador)
  sexo: 'M',
  telefono: '',
  fecha_nacimiento: ''
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await apiService.get('/admin/users')
    users.value = Array.isArray(data) ? data : (data.users || [])
  } catch (err: any) {
    error.value = "No se pudieron cargar los usuarios"
  } finally {
    loading.value = false
  }
}

const handleToggleStatus = async (user: any) => {
  try {
    const newStatus = !user.activo
    await apiService.patch(`/admin/users/${user.id}/status`, { activate: newStatus })
    user.activo = newStatus
  } catch (err) {
    alert("Error al cambiar el estado del usuario")
  }
}

const handleCreateEmployee = async () => {
  if (!newEmployee.value.usuario || !newEmployee.value.email || !newEmployee.value.password) {
    alert("Por favor completa los campos obligatorios")
    return
  }
  
  saving.value = true
  try {
    // Aseguramos que el endpoint sea consistente con el GET que sí encuentra el controlador
    await apiService.post('/admin/users', newEmployee.value)
    await fetchUsers() // Recargar lista
    isModalOpen.value = false
    // Reset form
    newEmployee.value = { usuario: '', apellido: '', email: '', password: '', rol: 2, sexo: 'M', telefono: '', fecha_nacimiento: '' }
  } catch (err: any) {
    alert(err.message || "Error al registrar empleado")
  } finally {
    saving.value = false
  }
}

const summary = computed(() => [
  { label: 'Activos',     value: `${users.value.filter(u => u.activo).length} Artesanos`, type: 'active' },
  { label: 'En Descanso', value: `${users.value.filter(u => !u.activo).length} Cuentas`,    type: 'rest' },
])

const totalItems = computed(() => users.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))

const displayUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  
  return users.value.slice(start, end).map(u => {
    // Mapeo estético de roles
    let specialty = 'Cliente'
    let icon = 'person'
    
    if (u.id_rol === 2) {
      specialty = 'Repostero'
      icon = 'cake'
    } else if (u.id_rol === 3) {
      specialty = 'Admin'
      icon = 'admin_panel_settings'
    }

    return {
      ...u,
      // Cambiamos a una forma más segura de obtener el nombre por si 'apellido' es el problema
      name: u.usuario + (u.apellido ? ` ${u.apellido}` : (u.apellido ? ` ${u.apellido}` : '')),
      email: u.email,
      specialty,
      specialtyIcon: icon,
      phone: u.telefono || 'Sin teléfono',
      active: u.activo,
      online: false // Esto requeriría websockets, lo dejamos estático por ahora
    }
  })
})

function avatarColor(id: number) {
  const colors = ['#c8a882', '#8b6a4a', '#d4b896', '#a07850', '#e8c9a0']
  return colors[id % colors.length]
}

onMounted(fetchUsers)
</script>

<template>
  <div class="users-page">
    <AdminSidebar />

    <div class="users-content">
      <AppTopBar placeholder="Buscar..." />

      <main class="users-main">

        <!-- Page header -->
        <div class="page-header">
          <div class="header-text">
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">
              Administra el acceso de tus panaderos, reposteros y personal de entrega.<br />
              Mantén el corazón de la cocina latiendo en armonía.
            </p>
          </div>

          <!-- Watermark decorativo -->
          <div class="header-watermark" aria-hidden="true">
            <span class="material-symbols-outlined watermark-icon">grain</span>
          </div>

          <button class="btn-new-employee" @click="isModalOpen = true">
            <span class="material-symbols-outlined">person_add</span>
            Nuevo Empleado
          </button>
        </div>

        <!-- Content grid -->
        <div class="content-grid">

          <!-- Resumen de plantilla -->
          <div class="summary-card">
            <h3 class="summary-title">Resumen de Plantilla</h3>
            <div class="summary-list">
              <div
                v-for="item in summary"
                :key="item.label"
                class="summary-row"
              >
                <span class="summary-label">{{ item.label }}</span>
                <span class="summary-badge" :class="`summary-badge--${item.type}`">
                  {{ item.value }}
                </span>
              </div>
            </div>
          </div>

          <!-- Users table -->
          <div class="users-table-wrapper">

            <!-- Table header -->
            <div class="table-header-row">
              <span class="th">TRABAJADORES</span>
              <span class="th">ESPECIALIDAD</span>
              <span class="th">TELÉFONO</span>
              <span class="th">ESTADO</span>
            </div>

            <!-- User rows -->
            <div class="user-rows">
              <div
                v-for="user in displayUsers"
                :key="user.id"
                class="user-row"
              >
                <!-- Online dot -->
                <span
                  class="online-dot"
                  :class="user.online ? 'online-dot--on' : 'online-dot--off'"
                />

                <!-- Avatar + info -->
                <div class="user-info">
                  <div v-if="user.foto_perfil" class="user-avatar">
                    <img :src="user.foto_perfil" :alt="user.usuario" class="avatar-img-fit" />
                  </div>
                  <div v-else class="user-avatar" :style="{ background: avatarColor(user.id) }">
                    <span class="material-symbols-outlined avatar-icon">person</span>
                  </div>
                  <div>
                    <p class="user-name">{{ user.name }}</p>
                    <p class="user-email">{{ user.email }}</p>
                  </div>
                </div>

                <!-- Specialty -->
                <div class="specialty-pill">
                  <span class="material-symbols-outlined specialty-icon">
                    {{ user.specialtyIcon }}
                  </span>
                  {{ user.specialty }}
                </div>

                <!-- Phone -->
                <span class="user-phone">{{ user.phone }}</span>

                <!-- Toggle -->
                <button
                  class="toggle"
                  :class="{ 'toggle--on': user.active }"
                  @click="handleToggleStatus(user)"
                >
                  <span class="toggle-thumb" />
                </button>
              </div>
            </div>

            <!-- Table footer -->
            <div class="table-footer">
              <span class="table-count">
                Mostrando {{ displayUsers.length }} de {{ totalItems }} artesanos registrados
              </span>
              <div class="pagination">
                <button
                  class="page-btn"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  <span class="material-symbols-outlined" style="font-size:15px">chevron_left</span>
                </button>
                <button
                  v-for="n in totalPages"
                  :key="n"
                  class="page-btn"
                  :class="{ 'page-btn--active': currentPage === n }"
                  @click="currentPage = n"
                >{{ n }}</button>
                <button
                  class="page-btn"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  <span class="material-symbols-outlined" style="font-size:15px">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>

    <!-- Pop up Nuevo Empleado -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Registrar Nuevo Empleado</h2>
          <button class="close-btn" @click="isModalOpen = false">✕</button>
        </div>
        
        <form @submit.prevent="handleCreateEmployee" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Usuario *</label>
              <input v-model="newEmployee.usuario" type="text" placeholder="Ej: eduardo_bakery" />
            </div>
            <div class="form-group">
              <label>Apellido</label>
              <input v-model="newEmployee.apellido" type="text" placeholder="Ej: Almi" />
            </div>
            <div class="form-group full-width">
              <label>Email *</label>
              <input v-model="newEmployee.email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-group">
              <label>Contraseña *</label>
              <input v-model="newEmployee.password" type="password" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="newEmployee.telefono" type="tel" placeholder="999 999 999" />
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <select v-model="newEmployee.sexo">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <input v-model="newEmployee.fecha_nacimiento" type="date" />
            </div>
          </div>
          <p class="role-notice">Este usuario será registrado con el <strong>Rol de Trabajador (ID: 2)</strong>.</p>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="isModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'Registrando...' : 'Confirmar Registro' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal; font-style: normal;
  line-height: 1; letter-spacing: normal;
  text-transform: none; display: inline-block;
  white-space: nowrap; direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* ── Layout ── */
.users-page { display: flex; min-height: 100vh; background: #fff; font-family: 'Lato', sans-serif; }
.users-content { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.users-main { flex: 1; padding: 2rem 2.75rem; display: flex; flex-direction: column; gap: 2rem; }

/* ── Page header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  position: relative;
}
.header-text { flex: 1; text-align: start; }
.page-title {
  font-family: 'Rubik', serif;
  font-size: 2.2rem; font-weight: 400;
  color: #2a1a1a; margin: 0 0 0.6rem;
  line-height: 1.1;
}
.page-subtitle {
  font-size: 0.85rem; color: #7c5730;
  line-height: 1.65; margin: 1rem 0;
}

/* Watermark */
.header-watermark {
  position: absolute;
  right: 220px; top: -20px;
  opacity: 0.08; pointer-events: none;
}
.watermark-icon {
  font-size: 120px !important;
  color: #8b1a2e;
  font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48;
}

/* New employee button */
.btn-new-employee {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fef0e0;
  border: 1.5px solid #e8c07a;
  border-radius: 50px;
  font-family: 'Lato', sans-serif;
  font-size: 0.88rem; font-weight: 700;
  color: #7c4a10; cursor: pointer;
  white-space: nowrap; flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
  align-self: center;
}
.btn-new-employee:hover { background: #fde8c0; border-color: #c89040; }
.btn-new-employee .material-symbols-outlined { font-size: 18px !important; }

/* ── Content grid ── */
.content-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── Summary card ── */
.summary-card {
  background: #fdf6ee;
  border: 1px solid #e8d5c0;
  border-radius: 16px;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.summary-title {
  font-family: 'Noto Serif', serif;
  font-size: 1rem; font-weight: 700;
  color: #8b1a2e; margin: 0;
  text-align: center;
}
.summary-list { display: flex; flex-direction: column; gap: 0.75rem; }
.summary-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 0.5rem;
}
.summary-label {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem; color: #6b5050; font-weight: 500;
}
.summary-badge {
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem; font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px; white-space: nowrap;
}
.summary-badge--active { background: #e6f4ee; color: #2e7d52; }
.summary-badge--rest   { background: #f5ece4; color: #8b1a2e; }

/* ── Users table ── */
.users-table-wrapper {
  display: flex; flex-direction: column; gap: 0;
}

.table-header-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 80px;
  padding: 0 1rem 0.6rem;
  gap: 1rem;
}
.th {
  font-family: 'Lato', sans-serif;
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.08em; color: #9e8080;
  text-transform: uppercase;
}

/* User rows */
.user-rows { display: flex; flex-direction: column; gap: 0; }

.user-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 80px;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1rem;
  border-bottom: 1px solid #f5ece4;
  position: relative;
  transition: background 0.15s;
}
.user-row:hover { background: #fdf8f3; }
.user-row:last-child { border-bottom: none; }

/* Online dot */
.online-dot {
  position: absolute;
  left: -2px;
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1.5px solid #fff;
}
.online-dot--on  { background: #22c55e; }
.online-dot--off { background: #d1d5db; }

/* User info */
.user-info { display: flex; align-items: center; gap: 0.75rem; }
.user-avatar {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.avatar-img-fit {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-icon {
  font-size: 22px !important; color: #fff;
  font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
.user-name {
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: #2a1a1a; margin: 0;
}
.user-email {
  font-size: 0.72rem; color: #9e8080;
  margin: 0.1rem 0 0;
}

/* Specialty */
.specialty-pill {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: #f5ece4;
  border: 1px solid #e8d5c0;
  border-radius: 20px;
  padding: 0.3rem 0.75rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  color: #6b4a2a;
  width: fit-content;
}
.specialty-icon {
  font-size: 14px !important;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
}

/* Phone */
.user-phone {
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; color: #6b5050;
  white-space: nowrap;
}

/* Toggle */
.toggle {
  width: 36px; height: 20px;
  background: #ddd; border: none;
  border-radius: 20px; cursor: pointer;
  position: relative; transition: background 0.25s; padding: 0;
  justify-self: start;
}
.toggle--on { background: #8b1a2e; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 14px; height: 14px;
  background: #fff; border-radius: 50%;
  transition: transform 0.25s; display: block;
}
.toggle--on .toggle-thumb { transform: translateX(16px); }

/* ── Table footer ── */
.table-footer {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0;
  border-top: 1px solid #f5ece4;
  margin-top: 0.5rem;
}
.table-count {
  font-family: 'Lato', sans-serif;
  font-size: 0.78rem; color: #9e8080;
  font-style: italic;
}
.pagination { display: flex; align-items: center; gap: 0.35rem; }
.page-btn {
  min-width: 30px; height: 30px; padding: 0 6px;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 8px; display: inline-flex;
  align-items: center; justify-content: center;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  color: #6b5050; cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { border-color: #8b1a2e; color: #8b1a2e; }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.page-btn--active { background: #8b1a2e; border-color: #8b1a2e; color: #fff; }

/* ── Modal Styles ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(43, 40, 40, 0.4);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff; width: 90%; max-width: 500px;
  border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden; animation: popIn 0.3s ease;
}
@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-header {
  padding: 1.5rem; background: #fdf6ee;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #e8d5c0;
}
.modal-title { font-family: 'Noto Serif', serif; font-size: 1.2rem; color: #3f0006; margin: 0; }
.close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #9e8080; }
.modal-body { padding: 1.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.full-width { grid-column: span 2; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; text-align: start; }
.form-group label { font-size: 0.75rem; font-weight: 700; color: #7c5730; }
.form-group input, .form-group select {
  padding: 0.6rem; border: 1.5px solid #eee; border-radius: 8px;
  font-family: 'Lato', sans-serif; outline: none; transition: border-color 0.2s;
}
.form-group input:focus { border-color: #8b1a2e; }
.role-notice {
  margin-top: 1.25rem; font-size: 0.75rem; color: #9e8080;
  padding: 0.75rem; background: #f9f9f9; border-radius: 10px; border-left: 3px solid #e8c07a;
}
.modal-footer {
  padding: 1.25rem; display: flex; justify-content: flex-end; gap: 0.75rem;
  background: #fafafa; border-top: 1px solid #eee;
}
.btn-cancel {
  padding: 0.6rem 1.2rem; background: #fff; border: 1px solid #ddd;
  border-radius: 8px; font-weight: 600; cursor: pointer; color: #666;
}
.btn-save {
  padding: 0.6rem 1.2rem; background: #8b1a2e; border: none;
  border-radius: 8px; font-weight: 600; cursor: pointer; color: #fff;
}
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
  .users-main { padding: 1.25rem; }
  .header-watermark { display: none; }
  .page-title { font-size: 1.6rem; }
}
@media (max-width: 640px) {
  .page-header { flex-direction: column; }
  .table-header-row,
  .user-row { grid-template-columns: 1fr 1fr; }
  .th:nth-child(3), .th:nth-child(4) { display: none; }
  .user-phone, .toggle { display: none; }
}
</style>