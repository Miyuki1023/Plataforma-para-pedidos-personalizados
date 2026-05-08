<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseIcon from '../atoms/BaseIcon.vue'

const isMenuOpen = ref(false)
const isSearchOpen = ref(false)

const navbarRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}
const handleClickOutside = (event: MouseEvent) => {
  if (
    navbarRef.value &&
    !navbarRef.value.contains(event.target as Node)
  ) {
    isSearchOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="navbar" ref="navbarRef">

    <!-- MENU -->
    <button
    
      class="icon-btn"
      @click="toggleMenu"
    >
      <BaseIcon name="menu" :size="20" />
    </button>

    <!-- LOGO -->
    <div class="navbar-brand">
      Vainilla y miel
    </div>

    <!-- ACTIONS -->
    <div class="navbar-actions">

       <!-- SEARCH -->
      <div class="search-wrapper">
        <Transition name="search-pop" mode="out-in">
          <!-- INPUT (Se muestra si está abierto) -->
          <div
            v-if="isSearchOpen"
            key="search-box"
            class="search-box"
          >
            <BaseIcon
              name="search"
              :size="18"
              class="search-inside-icon"
            />
            <input
              ref="searchInputRef"
              type="text"
              placeholder="Buscar..."
              class="search-input"
            />
          </div>

          <!-- BOTÓN (Se muestra si está cerrado) -->
          <button
            v-else
            key="search-button"
            class="icon-btn"
            @click.stop="toggleSearch"
          >
            <BaseIcon name="search" :size="20" />
          </button>
        </Transition>
      </div>

      <!-- USER -->
      <button class="icon-btn">
        <BaseIcon name="user" :size="20" />
      </button>

      <!-- CART -->
      <button class="icon-btn">
        <BaseIcon name="cart" :size="20" />
      </button>
    </div>
  </header>

  <!-- SIDEBAR -->
  <transition name="slide">
    <aside
      v-if="isMenuOpen"
      class="sidebar"
    >

      <div class="sidebar-header">

        <h2>Vainilla y miel</h2>

        <button
          class="close-btn"
          @click="toggleMenu"
        >
          ✕
        </button>
      </div>

      <nav class="sidebar-nav">

        <a href="#" class="sidebar-link">
          Inicio
        </a>

        <a href="#" class="sidebar-link">
          Antojitos
        </a>

        <a href="#" class="sidebar-link">
          Sobre nosotros
        </a>

      </nav>
    </aside>
  </transition>

  <!-- OVERLAY -->
  <div
    v-if="isMenuOpen"
    class="overlay"
    @click="toggleMenu"
  />
</template>
