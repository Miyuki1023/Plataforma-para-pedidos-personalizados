<script setup lang="ts">
import FavoriteProductCard from '../FavoriteProductCard.vue'
import { useFavoritesStore } from '../../../stores/favorites'

const favStore = useFavoritesStore()
</script>

<template>
  <section class="premium-section">
    <h2 class="section-title">Mis Favoritos</h2>

    <div class="premium-favorites-grid">
      <p v-if="favStore.favorites.length === 0" class="empty-msg">
        Tu lista de antojos está vacía. Explora el catálogo para agregar tus favoritos.
      </p>

      <FavoriteProductCard
        v-for="fav in favStore.favorites"
        :key="fav.id"
        :id="fav.id"
        :image="fav.image || fav.imageUrl || ''"
        :title="fav.name"
        :price="fav.price"
      />
    </div>
  </section>
</template>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
</style>