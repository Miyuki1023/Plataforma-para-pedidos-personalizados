<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import Footer from '../components/organisms/Footer.vue'

import ProfileHeader from '../components/molecules/perfil/ProfileHeader.vue'

import ProfileSidebar from '../components/molecules/perfil/ProfileSidebar.vue'
import OrdersSection from '../components/molecules/perfil/OrdersSection.vue'
import FavoritesSection from '../components/molecules/perfil/FavoritesSection.vue'
import ConfigSection from '../components/molecules/perfil/ConfigSection.vue'

import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'

const authStore = useAuthStore()
const favStore = useFavoritesStore()

onMounted(async () => {
  // Al cargar la página, pedimos los datos frescos al backend
  if (authStore.token) {
    await authStore.fetchProfile()
    await favStore.fetchFavorites()
  }
})
</script>

<template>
  <Navbar />

  <main class="profile-view-container">

    <section class="profile-hero-banner">
      <ProfileHeader
        :name="authStore.user?.usuario || 'Invitado'"
        :image="authStore.user?.foto_perfil || '/user.jpg'"
      />
    </section>

    <section class="profile-layout-grid">

      <div class="profile-sidebar-wrapper">
        <ProfileSidebar
          :name="authStore.user?.usuario || ''"
          :phone="authStore.user?.telefono || ''"
          :email="authStore.user?.email || ''"
          :fotoPerfil="authStore.user?.foto_perfil || ''"
          address="Sin dirección registrada"
        />
      </div>

      <div class="profile-content-area">
        <div class="content-card-section">
          <OrdersSection />
        </div>

        <div class="content-card-section">
          <FavoritesSection />
        </div>

        <div class="content-card-section">
          <ConfigSection />
        </div>
      </div>

    </section>

  </main>

  <Footer />
</template>