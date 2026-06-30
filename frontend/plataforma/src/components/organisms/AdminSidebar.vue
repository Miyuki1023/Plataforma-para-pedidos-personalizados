<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { apiService } from "../../lib/api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const navItems = [
  { id: "analytics", label: "Panel de Control", icon: "analytics",    to: "/admin" },
  { id: "products",  label: "Productos",        icon: "package_2",    to: "/admin/productos" },
  { id: "users",     label: "Usuarios",         icon: "group",        to: "/admin/usuarios" },
  { id: "claims",    label: "Reclamaciones",    icon: "receipt_long", to: "/admin/reclamaciones" },
];

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const logout = async () => {
  try {
    await apiService.post('/auth/logout', {});
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    authStore.logout();
    router.replace('/login');
  }
};
</script>

<template>
  <aside class="admin-sidebar" aria-label="Menú de administración">
    <div class="sidebar-brand">Vainilla y Miel</div>

    <nav class="sidebar-nav" aria-label="Navegación principal de administración">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        :aria-current="route.path === item.to ? 'page' : undefined"
      >
        <span class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <div class="sidebar-user-container">
        <transition name="pop-in">
          <div v-if="showUserMenu" class="user-dropdown-menu" role="menu">
            <button @click="logout" class="dropdown-item logout-btn" role="menuitem">
              <span class="material-symbols-outlined" aria-hidden="true">logout</span>
              Cerrar sesión
            </button>
          </div>
        </transition>

        <button
          class="sidebar-user"
          @click="toggleUserMenu"
          :class="{ 'is-active': showUserMenu }"
          :aria-expanded="showUserMenu"
          :aria-label="`Menú de usuario: ${authStore.user?.usuario || 'Usuario'}`"
        >
          <img
            v-if="authStore.user?.foto_perfil"
            :src="authStore.user.foto_perfil"
            :alt="`Foto de perfil de ${authStore.user.usuario}`"
            class="user-avatar-img"
          />
          <span v-else class="material-symbols-outlined user-avatar-icon" aria-hidden="true">person</span>
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.usuario }} {{ authStore.user?.apellido }}</span>
            <span class="user-role">{{ authStore.user?.id_rol === 3 ? 'Administrador' : 'Empleado' }}</span>
          </div>
          <span class="material-symbols-outlined arrow-icon" aria-hidden="true">expand_less</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 256px;
  background: #f5e6d9;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  z-index: 3;
}

.sidebar-brand {
  font-family: "Rosarivo", serif;
  font-size: 24px;
  font-weight: 400;
  color: #3f0006;
  margin-bottom: 2rem;
  padding: 0 0.25rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 100px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-size: 0.85rem;
  color: #7a1f26;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.nav-item .material-symbols-outlined { font-size: 1.15rem; line-height: 1; }
.nav-item:hover { background: #f5ece4; color: #2a1a1a; }
.nav-item.active { background: #af3439; color: #fff; }

.sidebar-bottom { display: flex; flex-direction: column; gap: 1rem; }

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  background-color: #ffffffbd;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  width: 100%;
  font-family: 'Lato', sans-serif;
  text-align: left;
}

.sidebar-user:hover, .sidebar-user.is-active { background-color: #ffffff; }

.user-avatar-img {
  width: 32px; height: 32px;
  border-radius: 50%; object-fit: cover;
  flex-shrink: 0; border: 1.5px solid #e8d5d5;
}

.user-info { display: flex; flex-direction: column; gap: 0; line-height: 1.1; }

.user-name {
  font-size: 0.8rem; font-weight: 700; color: #2a1a1a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;
}

.user-role {
  font-size: 0.68rem;
  color: #5a3a3a; /* Improved contrast from #6b4f4f */
  font-weight: 600;
}

.user-avatar-icon { font-size: 32px !important; color: #af3439; flex-shrink: 0; }
.sidebar-user-container { position: relative; }

.arrow-icon {
  margin-left: auto; font-size: 1.2rem !important;
  color: #9e8080; transition: transform 0.3s ease;
}
.sidebar-user.is-active .arrow-icon { transform: rotate(180deg); }

.user-dropdown-menu {
  position: absolute; bottom: calc(100% + 12px); left: 0; right: 0;
  background: white; border-radius: 12px;
  box-shadow: 0 8px 24px rgba(63, 0, 6, 0.12);
  padding: 0.5rem; z-index: 10; border: 1px solid #f5ece4;
}

.dropdown-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 0.85rem; border-radius: 8px;
  font-size: 0.85rem; color: #4a3f3f;
  text-decoration: none; width: 100%; border: none;
  background: transparent; cursor: pointer; transition: background 0.2s;
}

.dropdown-item:hover { background: #fdf6f0; }
.dropdown-item.logout-btn { color: #af3439; }

.pop-in-enter-active, .pop-in-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.pop-in-enter-from, .pop-in-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }
</style>