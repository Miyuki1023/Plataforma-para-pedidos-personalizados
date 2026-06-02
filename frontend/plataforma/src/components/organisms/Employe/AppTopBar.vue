<script setup lang="ts">
defineProps<{
  placeholder?: string
}>()
</script>

<template>
  <header class="topbar">
    <div class="search-box">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" :placeholder="placeholder ?? 'Buscar...'" />
    </div>
    <button class="notif-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="notif-dot" />
    </button>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: #F5E6D9CC;
  position: sticky;
  top: 0;
  z-index: 50;
}
.search-box {
  display: flex; align-items: center; gap: 0.5rem;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 50px; padding: 0.4rem 1rem;
}
.search-box input {
  border: none; outline: none;
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; color: #2a1a1a;
  background: transparent; width: 170px;
}
.search-box input::placeholder { color: #bfa8a8; }
.notif-btn {
  position: relative;
  width: 34px; height: 34px;
  background: #fff; border: 1px solid #e8d5d5;
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  cursor: pointer; color: #9e8080;
  transition: border-color 0.2s, color 0.2s;
}
.notif-btn:hover { border-color: #8b1a2e; color: #8b1a2e; }
.notif-dot {
  position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px;
  background: #8b1a2e; border-radius: 50%;
  border: 1.5px solid #fff;
}
</style>