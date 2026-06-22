<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../lib/api'
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
    const res = await api.get('/admin/users')
    // Con el nuevo api.ts, 'res' ya es el cuerpo de la respuesta
    // También nos aseguramos de mapear 'rol' a 'id_rol' si es necesario para la consistencia del frontend
    const rawData = res.users || res || []
    users.value = rawData.map((u: any) => ({
      ...u,
      id_rol: u.id_rol !== undefined ? u.id_rol : (u.rol || 1)
    }))
  } catch (error: any) {
    console.error('[AdminUsers] Error al obtener usuarios:', error)
    const status = error.response?.status;
    
    if (status === 401) {
      alert('Error 401: No autorizado. \n\n1. Revisa que BYPASS_AUTH=true esté en el .env del BACKEND.\n2. Reinicia el servidor de Node.js.\n3. Verifica los logs en la terminal del backend.');
    } else if (status === 403) {
      alert('Error 403: Acceso denegado. Tu usuario no tiene permisos de Administrador.');
    } else {
      alert('Error al cargar usuarios.');
    }
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(u => 
    u.usuario.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleUserStatus = async (user: User) => {
  const action = user.activo ? 'deactivate' : 'activate'
  try {
    await api.put(`/admin/users/${user.id}/${action}`)
    user.activo = !user.activo
  } catch (error) {
    alert('Error al cambiar el estado del usuario')
  }
}

const handleRoleChange = async (user: User, event: Event) => {
  const newRole = parseInt((event.target as HTMLSelectElement).value)
  
  if (user.id === 1) {
    alert('Por seguridad, no se puede cambiar el rol del Administrador principal (ID 1).');
    fetchUsers(); // Revertir selección en el select
    return;
  }

  try {
    const res = await api.put(`/admin/users/${user.id}/role`, { rol: newRole })
    // Sincronización optimista del estado local
    user.id_rol = newRole
    console.log('Cambio de rol exitoso:', res.message)
  } catch (error) {
    alert('No se pudo actualizar el rol')
    fetchUsers() // Revertir UI
  }
}

const handleCreateUser = async () => {
  if (!newUser.value.fecha_nacimiento) {
    alert('La fecha de nacimiento es obligatoria según las reglas del sistema.')
    return
  }
  loading.value = true
  try {
    // Enviamos el payload asegurando que id_rol esté presente según la interfaz User
    await api.post('/auth/admin/register', {
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
      <AppTopBar placeholder="Buscar usuarios..." v-model="searchQuery" />

      <div class="admin-content">
        <header class="content-header">
          <div>
            <h1 class="page-title">Gestión de Usuarios</h1>
            <p class="page-subtitle">{{ users.length }} usuarios registrados en el sistema</p>
          </div>
          <button class="btn-primary" @click="showModal = true">
            <span class="material-symbols-outlined">person_add</span>
            Nuevo Usuario
          </button>
        </header>

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
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="user-info">
                    <img :src="`https://i.pravatar.cc/40?u=${user.email}`" class="avatar" />
                    <div>
                      <div class="user-name">{{ user.usuario }}</div>
                      <div class="user-email">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select 
                    :value="user.id_rol" 
                    @change="handleRoleChange(user, $event)" 
                    class="role-select"
                    :disabled="user.id === 1"
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
                    :title="user.activo ? 'Desactivar' : 'Activar'"
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
        </div>
      </div>
    </main>

    <!-- Modal de Creación -->
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

.content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.page-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; color: #3f0006; margin: 0; }
.page-subtitle { font-size: 0.85rem; color: #7c5730; margin: 0.25rem 0 0; }

.btn-primary { background: #8b1a2e; color: #fff; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; font-family: 'Lato', sans-serif; transition: 0.3s; }
.btn-primary:hover { background: #3f0006; transform: translateY(-2px); }

.users-card { background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; padding: 1rem; overflow-x: auto; }
.user-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.user-table th { text-align: left; padding: 1rem; font-size: 0.65rem; color: #9e8080; letter-spacing: 0.1em; border-bottom: 1px solid #e8d5d5; }
.user-table td { padding: 1rem; border-bottom: 1px solid #fdf6f0; }

.user-info { display: flex; align-items: center; gap: 0.85rem; }
.avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.user-name { font-weight: 700; color: #3f0006; font-size: 0.9rem; }
.user-email { font-size: 0.75rem; color: #9e8080; }

.role-select { padding: 0.3rem 0.5rem; border-radius: 8px; border: 1px solid #e8d5d5; font-size: 0.8rem; background: #fff; color: #3f0006; }

.status-badge { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.7rem; font-weight: 700; }
.status--active { background: #e6f4ee; color: #2e7d52; }
.status--inactive { background: #fde8e8; color: #9b1c1c; }

.date-cell { font-size: 0.8rem; color: #574140; }
.action-btn { background: none; border: none; color: #8b1a2e; cursor: pointer; opacity: 0.7; transition: 0.2s; }
.action-btn:hover { opacity: 1; transform: scale(1.1); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(63, 0, 6, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal-content { 
  background: #fff; 
  padding: 2.5rem; 
  border-radius: 20px; 
  width: 95%; 
  max-width: 550px; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
  max-height: 90vh;
  overflow-y: auto;
}

@media (min-width: 1024px) {
  .modal-content { max-width: 650px; }
}

@media (min-width: 1440px) {
  .modal-content { max-width: 800px; }
}
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
}
</style>