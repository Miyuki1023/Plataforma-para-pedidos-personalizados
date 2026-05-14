<script setup lang="ts">
import FavoriteIcon from '../atoms/FavoriteIcon.vue'
import { useFavoritesStore } from '../../stores/favorites'

interface Props {
  id: string | number
  image: string
  title: string
  price: number
}

const props = defineProps<Props>()
const favStore = useFavoritesStore()

const removeFavorite = () => {
  // Llamamos al store para quitarlo; como ya está en favoritos, toggle lo eliminará
  favStore.toggleFavorite({
    id: props.id,
    name: props.title,
    price: props.price,
    image: props.image
  })
}
</script>

<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img :src="image" :alt="title" />
      <FavoriteIcon 
        :active="true" 
        class="fav-icon-overlay"
        @click.stop="removeFavorite"
      />
    </div>

    <div class="content">
      <h3>{{ title }}</h3>

      <strong>S/{{ price }}</strong>

      <button>
        Añadir al carrito
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}

.image-wrapper {
  position: relative;
  width: 100%;
}

img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.fav-icon-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.content {
  padding: 16px;
}

button {
  margin-top: 12px;
  width: 100%;
  background: #a63d40;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 999px;
}
</style>