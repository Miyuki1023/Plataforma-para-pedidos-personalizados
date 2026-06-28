<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

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
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-brand">Vainilla y Miel</div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">

      <div class="sidebar-user-container">
        <!-- Menú emergente de usuario -->
        <transition name="pop-in">
          <div v-if="showUserMenu" class="user-dropdown-menu">
           
            <button @click="logout" class="dropdown-item logout-btn">
              <span class="material-symbols-outlined">logout</span>
              Cerrar sesión
            </button>
          </div>
        </transition>

        <div class="sidebar-user" @click="toggleUserMenu" :class="{ 'is-active': showUserMenu }">
          <img
            v-if="authStore.user?.foto_perfil"
            :src="authStore.user.foto_perfil"
            :alt="authStore.user.usuario"
            class="user-avatar-img"
          />
          <span v-else class="material-symbols-outlined user-avatar-icon">person</span>
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.usuario }} {{ authStore.user?.apellido }}</span>
            <span class="user-role">{{ authStore.user?.id_rol === 3 ? 'Administrador' : 'Empleado' }}</span>
          </div>
          <span class="material-symbols-outlined arrow-icon">expand_less</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Cormorant+Garamond:wght@600&family=Lato:wght@400;600;700&display=swap");

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

.nav-item .material-symbols-outlined {
  font-size: 1.15rem;
  line-height: 1;
}

.nav-item:hover {
  background: #f5ece4;
  color: #2a1a1a;
}

.nav-item.active {
  background: #af3439;
  color: #fff;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-new-sale {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.95rem;
  background: #6b1222;
  color: #fff;
  border: none;
  border-radius: 15px;
  font-family: "Lato", sans-serif;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-new-sale:hover {
  background: #8b1a2e;
}

.btn-new-sale .material-symbols-outlined {
  font-size: 1rem;
  line-height: 1;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  background-color: #ffffffbd;
  border-radius: 15px;
}

.user-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid #e8d5d5;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.1;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

.user-role {
  font-size: 0.68rem;
  color: #9e8080;
}

.user-avatar-icon {
  font-size: 32px !important;
  color: #af3439;
  flex-shrink: 0;
}

.sidebar-user-container {
  position: relative;
}

.sidebar-user {
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar-user:hover, .sidebar-user.is-active {
  background-color: #ffffff;
}

.arrow-icon {
  margin-left: auto;
  font-size: 1.2rem !important;
  color: #9e8080;
  transition: transform 0.3s ease;
}

.sidebar-user.is-active .arrow-icon {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(63, 0, 6, 0.12);
  padding: 0.5rem;
  z-index: 10;
  border: 1px solid #f5ece4;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4a3f3f;
  text-decoration: none;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover { background: #fdf6f0; }
.dropdown-item.logout-btn { color: #af3439; }

.pop-in-enter-active, .pop-in-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.pop-in-enter-from, .pop-in-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }
</style>