<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '../../organisms/ProductCard.vue'
import { useFavoritesStore } from '../../../stores/favorites'

const favStore = useFavoritesStore()

onMounted(() => {
  if (favStore.favorites.length === 0) {
    favStore.fetchFavorites()
  }
})

/**
 * Extrae la primera imagen válida del array imagen_url o usa el string directo
 */
const getDisplayImage = (fav: any) => {
  const source = fav.imagen_url || fav.imageUrl || fav.image || fav.foto
  if (Array.isArray(source)) {
    return source.find(img => typeof img === 'string' && img.trim()) || ''
  }
  return typeof source === 'string' ? source : ''
}

const getPrice = (fav: any) => {
  const p = fav.precio || fav.price || fav.precio_promocion || fav.monto || 0
  // Asegura que sea un número incluso si viene con coma desde la BD
  return typeof p === 'string' ? Number(p.replace(',', '.')) : Number(p)
}
</script>

<template>
  <section class="favorites-section">



    <!-- EMPTY STATE -->
    <div
      v-if="favStore.favorites.length === 0"
      class="favorites-empty"
    >

      <div class="favorites-empty-icon">
        ❤
      </div>

      <h2 class="favorites-title">
        Mis Favoritos
      </h2>

      <p class="favorites-subtitle">
        Guarda tus postres favoritos y accede rápidamente
        a los productos que más te encantan.
      </p>

    </div>

    <!-- GRID -->
    <div
      v-else
      class="favorites-grid"
    >

      <ProductCard
        v-for="fav in favStore.favorites"
        :key="fav.id"
        :id="String(fav.id || fav.id_producto || fav.id_promocion).replace('id:', '')"
        :imageUrl="getDisplayImage(fav)"
        :name="fav.name || fav.nombre || fav.nombre_promocion || fav.titulo || 'Sin nombre'"
        :category="fav.category || fav.categoria || (fav.id_promocion ? 'PROMOCIÓN' : 'POSTRE')"
        :description="fav.description || fav.descripcion || fav.detalle || ''"
        :price="getPrice(fav)"
      />

    </div>

  </section>
</template>

<style scoped>

/* SECTION */
.favorites-section {
  width: 100%;
  padding: 4rem 1.5rem;
  background: #fffafc;
}

/* HEADER */
.favorites-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.favorites-badge {
  display: inline-block;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: #ffe4ec;
  color: #d63384;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.favorites-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #2b2b2b;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.favorites-subtitle {
  color: #666;
  font-size: 1rem;
  line-height: 1.7;
}

/* GRID */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(260px, 1fr)
  );
  gap: 2rem;
  align-items: stretch;
}

/* EMPTY STATE */
.favorites-empty {
  width: 100%;
  min-height: 320px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  border-radius: 24px;
  background: white;

  border: 1px dashed #ffd1df;

  padding: 3rem 2rem;
}

.favorites-empty-icon {
  width: 90px;
  height: 90px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #fff0f5;

  font-size: 2.5rem;

  margin-bottom: 1.5rem;
}

.favorites-empty h3 {
  font-size: 1.5rem;
  color: #2b2b2b;
  margin-bottom: 0.75rem;
}

.favorites-empty p {
  color: #777;
  max-width: 400px;
  line-height: 1.6;
}

/* TABLET */
@media (max-width: 768px) {

  .favorites-section {
    padding: 3rem 1rem;
  }

  .favorites-grid {
    gap: 1.5rem;
  }

}

/* MOBILE */
@media (max-width: 480px) {

  .favorites-title {
    font-size: 2rem;
  }

  .favorites-subtitle {
    font-size: 0.95rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorites-empty {
    min-height: 260px;
    padding: 2rem 1rem;
  }

}

</style>