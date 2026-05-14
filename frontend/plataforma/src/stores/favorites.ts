import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<any[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));

  const toggleFavorite = (product: any) => {
    const index = favorites.value.findIndex(p => p.id === product.id);
    if (index > -1) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push(product);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  };

  const isFavorite = (id: string | number) => {
    return favorites.value.some(p => p.id === id);
  };

  return { favorites, toggleFavorite, isFavorite };
});