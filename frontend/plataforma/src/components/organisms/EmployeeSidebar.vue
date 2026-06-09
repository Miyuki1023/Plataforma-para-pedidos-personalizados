<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const handleNewSale = () => {
  router.push('/home');
};

const navItems = [
  { id: "analytics", label: "Analytics", icon: "analytics", to: "/empleado" },
  {
    id: "orders",
    label: "Órdenes",
    icon: "receipt_long",
    to: "/empleado/ordenes",
  },
  {
    id: "products",
    label: "Productos",
    icon: "package_2",
    to: "/empleado/productos",
  },
];
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
      <button class="btn-new-sale" @click="handleNewSale">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nueva venta
      </button>
      <div class="sidebar-user">
        <div class="user-avatar">E</div>
        <div class="user-info">
          <span class="user-name">Elena R.</span>
          <span class="user-role">Bakery Owner</span>
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
  transition:
    background 0.2s,
    color 0.2s;
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
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  background-color: #ffffffbd;
  border-radius: 15px;
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
}
.user-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2a1a1a;
}
.user-role {
  font-size: 0.68rem;
  color: #9e8080;
}
</style>
