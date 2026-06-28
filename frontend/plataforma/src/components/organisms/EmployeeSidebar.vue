<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);

const navItems = [
  { id: "analytics", label: "Analytics", icon: "analytics", to: "/empleado" },
  { id: "orders", label: "Órdenes", icon: "receipt_long", to: "/empleado/ordenes" },
  { id: "products", label: "Productos", icon: "package_2", to: "/empleado/productos" },
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
  <aside class="emp-sidebar">
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
        
        <transition name="pop-in">
          <div v-if="showUserMenu" class="user-dropdown-menu">
            <button @click="logout" class="dropdown-item logout-btn">
              <span class="material-symbols-outlined">logout</span>
              Cerrar sesión
            </button>
          </div>
        </transition>

        <div class="sidebar-user" @click="toggleUserMenu" :class="{ 'is-active': showUserMenu }">
          <div class="user-avatar">{{ authStore.user?.usuario?.charAt(0) || 'E' }}</div>
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.usuario || 'Empleado' }}</span>
            <span class="user-role">Empleado</span>
          </div>
          <span class="material-symbols-outlined arrow-icon">expand_less</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Lato:wght@400;600;700&display=swap");

.emp-sidebar {
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

/* --- Nuevos estilos para la interactividad del usuario --- */
.sidebar-user-container { position: relative; }

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  background-color: #ffffffbd;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar-user:hover, .sidebar-user.is-active {
  background-color: #ffffff;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f5ece4;
  border: 1.5px solid #e8d5d5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #8b1a2e;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.1;
  overflow: hidden;
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
  color: #af3439;
  text-decoration: none;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover { background: #fdf6f0; }

.pop-in-enter-active, .pop-in-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.pop-in-enter-from, .pop-in-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }
</style>