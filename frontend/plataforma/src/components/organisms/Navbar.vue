<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

</script>

<template>
  <header class="navbar">
    <button class="icon-btn">
      <BaseIcon name="menu" :size="20" />
    </button>

    <div class="navbar-brand">Vainilla y miel</div>

    <div class="navbar-actions">
      <button class="icon-btn"><BaseIcon name="search" :size="20" /></button>
      <button class="icon-btn"><BaseIcon name="user"   :size="20" /></button>
      <button class="icon-btn"><BaseIcon name="cart"   :size="20" /></button>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&family=Lato:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rochester&family=Rosarivo&family=Rubik&display=swap');

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #F5E6D9;
  border-bottom: 1px solid #f0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  font-family: 'Rosarivo', serif;
  font-style: italic;
  font-size: 1.9rem;
  font-weight: 600;
  color: #8b1a2e;
  letter-spacing: 0.02em;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-link {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: #2a1a1a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-link:hover { color: #8b1a2e; }

.navbar-actions { display: flex; gap: 0.5rem; }

.icon-btn {
  width: 36px; height: 36px;
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #2a1a1a;
  transition: background 0.2s, color 0.2s;
}
.icon-btn:hover { background: #f5ece4; color: #8b1a2e; }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .navbar { padding: 1rem; }
}
</style>