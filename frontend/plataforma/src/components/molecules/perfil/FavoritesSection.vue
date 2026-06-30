<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../../organisms/ProductCard.vue'
import { useFavoritesStore } from '../../../stores/favorites'

const favStore = useFavoritesStore()
const showAll = ref(false)
const PREVIEW_COUNT = 6

const displayedFavorites = computed(() => {
  if (showAll.value) return favStore.favorites
  return favStore.favorites.slice(0, PREVIEW_COUNT)
})

const hasMore = computed(() => favStore.favorites.length > PREVIEW_COUNT)

onMounted(() => {
  if (favStore.favorites.length === 0 && !favStore.loading) {
    favStore.fetchFavorites()
  }
})

/**
 * Extrae la primera imagen válida del array imagen_url o usa el string directo
 */
const getDisplayImage = (fav: any): string => {
  if (!fav || typeof fav !== 'object') return ''
  const source = fav.imagen_url || fav.imageUrl || fav.image || fav.foto
  if (Array.isArray(source)) {
    return source.find((img: any) => typeof img === 'string' && img.trim()) || ''
  }
  return typeof source === 'string' ? source : ''
}

const getPrice = (fav: any): number => {
  if (!fav || typeof fav !== 'object') return 0
  const p = fav.precio ?? fav.price ?? fav.precio_promocion ?? fav.monto ?? 0
  return typeof p === 'string' ? Number(p.replace(',', '.')) : Number(p)
}

const getId = (fav: any): string => {
  if (!fav || typeof fav !== 'object') return '0'
  const raw = fav.id ?? fav.id_producto ?? fav.id_promocion ?? '0'
  return String(raw).replace('id:', '')
}
</script>

<template>
  <section class="favorites-section">
    <!-- Section header with title -->
    <div class="favorites-section-header">
      <h2 class="favorites-section-title">Mis Favoritos</h2>
      <p class="favorites-section-desc">Productos que te gustaron y guardaste para después.</p>
    </div>

    <!-- LOADING STATE -->
    <div v-if="favStore.loading" class="favorites-loading">
      <div class="spinner spinner--dark" />
      <p class="favorites-loading-text">Cargando favoritos…</p>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="favStore.error" class="favorites-error">
      <div class="favorites-empty-icon">⚠️</div>
      <h3 class="favorites-title">Oops</h3>
      <p class="favorites-subtitle">{{ favStore.error }}</p>
      <button class="retry-button" @click="favStore.fetchFavorites()">Reintentar</button>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="favStore.favorites.length === 0" class="favorites-empty">
      <div class="favorites-empty-icon">❤</div>
      <h3 class="favorites-title">Mis Favoritos</h3>
      <p class="favorites-subtitle">
        Guarda tus postres favoritos y accede rápidamente a los productos que más te encantan.
      </p>
    </div>

    <!-- GRID (preview or full) -->
    <div v-else class="favorites-grid">
      <ProductCard
        v-for="fav in displayedFavorites"
        :key="getId(fav)"
        :id="getId(fav)"
        :imageUrl="getDisplayImage(fav)"
        :name="fav.name || fav.nombre || 'Sin nombre'"
        :category="fav.category || fav.categoria || ''"
        :description="fav.description || fav.descripcion || ''"
        :price="getPrice(fav)"
      />
    </div>

    <!-- Ver todos / Ver menos -->
    <div v-if="hasMore" class="favorites-toggle">
      <button
        class="toggle-btn"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'Ver menos' : `Ver todos (${favStore.favorites.length})` }}
        <span class="toggle-arrow">{{ showAll ? '↑' : '↓' }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.favorites-section {
  width: 100%;
  padding: 2rem 1.5rem;
  background: #fffafc;
}

.favorites-section-header {
  margin-bottom: 1.5rem;
}

.favorites-section-title {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3f0006;
  margin: 0 0 0.25rem;
}

.favorites-section-desc {
  font-size: 0.85rem;
  color: #7c5730;
  margin: 0;
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

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

/* Toggle button */
.favorites-toggle {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.toggle-btn {
  padding: 0.6rem 1.5rem;
  border: 1px solid #8b1a2e;
  border-radius: 50px;
  background: #fff;
  color: #8b1a2e;
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-btn:hover {
  background: #8b1a2e;
  color: #fff;
}

.toggle-arrow {
  font-size: 1rem;
  line-height: 1;
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

/* LOADING */
.favorites-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  gap: 1rem;
}

.favorites-loading-text { color: #999; font-size: 0.95rem; }

/* ERROR */
.favorites-error {
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

.retry-button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  border: none;
  background: #AF3439;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #ede8de;
  border-top-color: #8b1a2e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .favorites-section { padding: 1.5rem 1rem; }
  .favorites-grid { gap: 1.5rem; }
}

@media (max-width: 480px) {
  .favorites-grid { grid-template-columns: 1fr; }
  .favorites-empty { min-height: 260px; padding: 2rem 1rem; }
}
</style>