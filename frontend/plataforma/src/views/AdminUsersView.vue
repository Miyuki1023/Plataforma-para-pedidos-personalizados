<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '../lib/api'
import AdminSidebar from '../components/organisms/AdminSidebar.vue'
import AppTopBar from '../components/organisms/AppTopBar.vue'

interface User {
  id: number
  usuario: string
  email: string
  id_rol: number
  activo: boolean
  telefono: string
  fecha_registro: string
}

const users = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)

// Filtro por rol: null = todos, 1 = clientes, 2 = trabajadores, 3 = admins
const roleFilter = ref<number | null>(null)

const ROLE_FILTERS = [
  { label: 'Todos', value: null },
  { label: 'Clientes', value: 1 },
  { label: 'Trabajadores', value: 2 },
  { label: 'Administradores', value: 3 },
] as const

// Paginación
const currentPage = ref(1)
const itemsPerPage = 10

// Obtener el ID del usuario logueado actualmente desde localStorage o sessionStorage
// (Cambia 'user' o 'id' según cómo guardes tu sesión en el Login)
const currentLoggedInUserId = computed(() => {
  const userString = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (userString) {
    try {
      const parsed = JSON.parse(userString)
      return parsed.id || parsed.id_usuario || null
    } catch {
      return null
    }
  }
  return null
})

// Formulario para nuevo usuario
const newUser = ref({
  usuario: '',
  apellido: '',
  email: '',
  password: '',
  id_rol: 2, 
  fecha_nacimiento: '',
  sexo: 'M',
  telefono: ''
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await apiService.get('/admin/users')
    const rawData = res.users || res || []
    users.value = rawData.map((u: any) => ({
      ...u,
      id_rol: u.id_rol !== undefined ? u.id_rol : (u.rol || 1)
    }))
  } catch (error: any) {
    console.error('[AdminUsers] Error al obtener usuarios:', error)
    const status = error.response?.status;
    
    if (status === 401) {
      alert('Error 401: No autorizado. \n\n1. Revisa que BYPASS_AUTH=true esté en el .env del BACKEND.\n2. Reinicia el servidor de Node.js.');
    } else if (status === 403) {
      alert('Error 403: Acceso denegado. Tu usuario no tiene permisos de Administrador.');
    } else {
      alert('Error al cargar usuarios.');
    }
  } finally {
    loading.value = false
  }
}

// 1. Estadísticas dinámicas basadas en la lista total
const stats = computed(() => {
  return {
    total: users.value.length,
    usuarios: users.value.filter(u => u.id_rol === 1).length,
    trabajadores: users.value.filter(u => u.id_rol === 2).length,
    admins: users.value.filter(u => u.id_rol === 3).length
  }
})

// Filtro por búsqueda + rol
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    // Filtro por búsqueda textual
    const matchesSearch = 
      u.usuario.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (!matchesSearch) return false

    // Filtro por rol
    if (roleFilter.value !== null && u.id_rol !== roleFilter.value) return false

    return true
  })
})

const setRoleFilter = (role: number | null) => {
  roleFilter.value = role
  currentPage.value = 1
}

// 2. Lógica de Paginación (10 en 10)
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage) || 1
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// Resetear a la página 1 cuando se escribe en el buscador
const handleSearchInput = (val: string) => {
  searchQuery.value = val
  currentPage.value = 1
}

const toggleUserStatus = async (user: User) => {
  // 3. Protección: evitar auto-bloqueo
  if (user.id === currentLoggedInUserId.value) {
    alert('No puedes desactivar tu propia cuenta por seguridad.')
    return
  }

  const action = user.activo ? 'deactivate' : 'activate'
  try {
    await apiService.put(`/admin/users/${user.id}/${action}`)
    user.activo = !user.activo
  } catch (error) {
    alert('Error al cambiar el estado del usuario')
  }
}

const handleRoleChange = async (user: User, event: Event) => {
  const newRole = parseInt((event.target as HTMLSelectElement).value)
  
  // Protección: administrador principal ID 1
  if (user.id === 1) {
    alert('Por seguridad, no se puede cambiar el rol del Administrador principal (ID 1).');
    fetchUsers();
    return;
  }

  // 3. Protección: evitar auto-cambio de rol
  if (user.id === currentLoggedInUserId.value) {
    alert('No puedes cambiar tu propio rol. Solicita este cambio a otro Administrador.');
    fetchUsers();
    return;
  }

  try {
    const res = await apiService.put(`/admin/users/${user.id}/role`, { rol: newRole })
    user.id_rol = newRole
    console.log('Cambio de rol exitoso:', res.message)
  } catch (error) {
    alert('No se pudo actualizar el rol')
    fetchUsers()
  }
}

const handleCreateUser = async () => {
  if (!newUser.value.fecha_nacimiento) {
    alert('La fecha de nacimiento es obligatoria según las reglas del sistema.')
    return
  }
  loading.value = true
  try {
    await apiService.post('/auth/admin/register', {
      ...newUser.value,
      rol: newUser.value.id_rol
    })
    showModal.value = false
    newUser.value = { usuario: '', apellido: '', email: '', password: '', id_rol: 2, fecha_nacimiento: '', sexo: 'M', telefono: '' }
    await fetchUsers()
  } catch (error: any) {
    const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || error.message || 'Error al crear usuario.';
    alert(errorMsg);
    console.error('[AdminUsers] Error detallado al crear:', error);
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

onMounted(fetchUsers)
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />
    
    <main class="admin-main">
      <AppTopBar placeholder="Buscar usuarios..." :modelValue="searchQuery" @update:modelValue="handleSearchInput" />

      <div class="admin-content">
        <header class="content-header">
          <div>
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">Control de accesos y perfiles del sistema</p>
          </div>
          <button class="btn-primary" @click="showModal = true">
            <span class="material-symbols-outlined">person_add</span>
            Nuevo Usuario
          </button>
        </header>

        <!-- Role filter bar -->
        <div class="role-filter-bar" role="group" aria-label="Filtrar por rol">
          <button
            v-for="f in ROLE_FILTERS"
            :key="String(f.value)"
            class="role-filter-btn"
            :class="{ 'role-filter-btn--active': roleFilter === f.value }"
            @click="setRoleFilter(f.value)"
            :aria-pressed="roleFilter === f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <section class="stats-grid">
          <div class="stat-card total">
            <span class="material-symbols-outlined icon">group</span>
            <div class="stat-info">
              <span class="stat-number">{{ stats.total }}</span>
              <span class="stat-label">Total Usuarios</span>
            </div>
          </div>
          <div class="stat-card client">
            <span class="material-symbols-outlined icon">person</span>
            <div class="stat-info">
              <span class="stat-number">{{ stats.usuarios }}</span>
              <span class="stat-label">Clientes / Users</span>
            </div>
          </div>
          <div class="stat-card worker">
            <span class="material-symbols-outlined icon">engineering</span>
            <div class="stat-info">
              <span class="stat-number">{{ stats.trabajadores }}</span>
              <span class="stat-label">Trabajadores</span>
            </div>
          </div>
          <div class="stat-card admin">
            <span class="material-symbols-outlined icon">shield_person</span>
            <div class="stat-info">
              <span class="stat-number">{{ stats.admins }}</span>
              <span class="stat-label">Administradores</span>
            </div>
          </div>
        </section>

        <div class="users-card">
          <table class="user-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>ROL</th>
                <th>ESTADO</th>
                <th>REGISTRO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td>
                  <div class="user-info">
                    <img :src="`https://i.pravatar.cc/40?u=${user.email}`" class="avatar" />
                    <div>
                      <div class="user-name">
                        {{ user.usuario }} 
                        <span v-if="user.id === currentLoggedInUserId" class="me-badge">(Tú)</span>
                      </div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select 
                    :value="user.id_rol" 
                    @change="handleRoleChange(user, $event)" 
                    class="role-select"
                    :disabled="user.id === 1 || user.id === currentLoggedInUserId"
                  >
                    <option :value="1">Usuario</option>
                    <option :value="2">Trabajador</option>
                    <option :value="3">Admin</option>
                  </select>
                </td>
                <td>
                  <span class="status-badge" :class="user.activo ? 'status--active' : 'status--inactive'">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="date-cell">{{ formatDate(user.fecha_registro) }}</td>
                <td>
                  <button 
                    @click="toggleUserStatus(user)" 
                    class="action-btn"
                    :class="{ 'action-btn--disabled': user.id === currentLoggedInUserId }"
                    :disabled="user.id === currentLoggedInUserId"
                    :title="user.id === currentLoggedInUserId ? 'No puedes desactivarte a ti mismo' : (user.activo ? 'Desactivar' : 'Activar')"
                  >
                    <span class="material-symbols-outlined">
                      {{ user.activo ? 'person_off' : 'person_check' }}
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="loading" class="loading-state">Cargando usuarios...</div>

          <div class="pagination-container" v-if="totalPages > 1">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1" 
              @click="currentPage--"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            
            <span class="pagination-info">
              Página <strong>{{ currentPage }}</strong> de {{ totalPages }}
            </span>

            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages" 
              @click="currentPage++"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Registrar Nuevo Usuario</h2>
        <form @submit.prevent="handleCreateUser" class="user-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre de Usuario</label>
              <input v-model="newUser.usuario" type="text" required placeholder="Ej. juan_bakery" />
            </div>
            <div class="form-group">
              <label>Apellido</label>
              <input v-model="newUser.apellido" type="text" required placeholder="Ej. Pérez" />
            </div>
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="newUser.email" type="email" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="newUser.password" type="password" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Rol</label>
              <select v-model="newUser.id_rol">
                <option :value="2">Trabajador</option>
                <option :value="3">Administrador</option>
              </select>
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <select v-model="newUser.sexo">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input v-model="newUser.fecha_nacimiento" type="date" required />
          </div>
          
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="newUser.telefono" type="tel" placeholder="Ej. 987654321" maxlength="9" />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showModal = false" :disabled="loading">Cancelar</button>
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Creando...' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background: #fff; }
.admin-main { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.admin-content { padding: 2rem 2.75rem; }

.content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.page-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; color: #3f0006; margin: 0; }
.page-subtitle { font-size: 0.85rem; color: #7c5730; margin: 0.25rem 0 0; }

/* Role filter bar */
.role-filter-bar {
  display: flex;
  gap: 0.25rem;
  background: #fef9ef;
  border: 1px solid #e8d5d5;
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1.25rem;
  width: fit-content;
}

.role-filter-btn {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #7c5730;
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.role-filter-btn:hover {
  background: #f5ece4;
  color: #3f0006;
}

.role-filter-btn--active {
  background: #8b1a2e;
  color: #fff;
}

/* Estilos de las tarjetas superiores */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
.stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; }
.stat-card .icon { font-size: 2rem; color: #8b1a2e; background: #f5ece4; padding: 0.5rem; border-radius: 10px; }
.stat-number { display: block; font-size: 1.5rem; font-weight: 800; color: #3f0006; line-height: 1.2; }
.stat-label { font-size: 0.75rem; color: #7c5730; font-weight: 600; }

.btn-primary { background: #8b1a2e; color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; font-family: 'Lato', sans-serif; transition: 0.3s; }
.btn-primary:hover { background: #3f0006; transform: translateY(-2px); }

.users-card { background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; padding: 1rem; overflow-x: auto; }
.user-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.user-table th { text-align: left; padding: 1rem; font-size: 0.65rem; color: #9e8080; letter-spacing: 0.1em; border-bottom: 1px solid #e8d5d5; }
.user-table td { padding: 1rem; border-bottom: 1px solid #fdf6f0; }

.user-info { display: flex; align-items: center; gap: 0.85rem; }
.avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.user-name { font-weight: 700; color: #3f0006; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; }
.me-badge { font-size: 0.75rem; color: #8b1a2e; font-style: italic; font-weight: bold; }
.user-email { font-size: 0.75rem; color: #9e8080; }

.role-select { padding: 0.3rem 0.5rem; border-radius: 8px; border: 1px solid #e8d5d5; font-size: 0.8rem; background: #fff; color: #3f0006; }
.role-select:disabled { background: #f5ece4; color: #9e8080; cursor: not-allowed; }

.status-badge { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 700; }
.status--active { background: #e6f4ee; color: #2e7d52; }
.status--inactive { background: #fde8e8; color: #9b1c1c; }

.date-cell { font-size: 0.8rem; color: #574140; }
.action-btn { background: none; border: none; color: #8b1a2e; cursor: pointer; opacity: 0.7; transition: 0.2s; }
.action-btn:hover:not(:disabled) { opacity: 1; transform: scale(1.1); }
.action-btn--disabled { color: #ccc; cursor: not-allowed; opacity: 0.5; }

/* Estilos de la Paginación */
.pagination-container { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e8d5d5; }
.pagination-btn { background: #fff; border: 1px solid #e8d5d5; border-radius: 8px; padding: 0.35rem; color: #8b1a2e; cursor: pointer; display: flex; align-items: center; transition: 0.2s; }
.pagination-btn:disabled { color: #ccc; cursor: not-allowed; background: #fafafa; }
.pagination-btn:not(:disabled):hover { background: #8b1a2e; color: #fff; }
.pagination-info { font-size: 0.85rem; color: #7c5730; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(63, 0, 6, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal-content { background: #fff; padding: 2.5rem; border-radius: 20px; width: 95%; max-width: 550px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }

@media (min-width: 1024px) { .modal-content { max-width: 650px; } }
@media (min-width: 1440px) { .modal-content { max-width: 800px; } }
.modal-title { font-family: 'Noto Serif', serif; color: #3f0006; margin-bottom: 1.5rem; }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
.form-group label { font-size: 0.75rem; font-weight: 700; color: #7c5730; }
.form-group input, .form-group select { padding: 0.75rem; border: 1px solid #e8d5d5; border-radius: 10px; font-family: 'Lato', sans-serif; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
.btn-cancel { flex: 1; padding: 0.75rem; border: none; background: #f5ece4; color: #7c5730; border-radius: 10px; cursor: pointer; font-weight: 600; }
.btn-submit { flex: 2; padding: 0.75rem; border: none; background: #8b1a2e; color: #fff; border-radius: 10px; cursor: pointer; font-weight: 600; }

.loading-state { text-align: center; padding: 2rem; color: #9e8080; font-style: italic; }

@media (max-width: 768px) {
  .content-header { flex-direction: column; gap: 1rem; }
  .form-row { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>