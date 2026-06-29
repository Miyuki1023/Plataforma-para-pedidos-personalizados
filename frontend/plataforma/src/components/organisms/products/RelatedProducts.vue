<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import ProductCard from '../../molecules/ProductCard.vue'
import { apiService } from '../../../modules/service/api.service'

const props = defineProps<{
  currentProduct?: any
}>()

const allProducts = ref<any[]>([])
const loading = ref(true)
const currentIndex = ref(0)

const buildMetaTags = (item: any) => {
  const tags = [] as string[]
  const label = (value: any, prefix: string) => {
    if (!value) return null
    if (Array.isArray(value)) return `${prefix}: ${value.join(', ')}`
    return `${prefix}: ${String(value)}`
  }

  const sizeTag = label(item.tamano || item.size || item.sizeSelected, 'Tamaño')
  const toppingsTag = label(item.toppings || item.ingredientes || item.adicionales, 'Toppings')
  const messageTag = label(item.mensaje || item.message || item.customMessage, 'Mensaje')
  const extrasTag = label(item.extras || item.addOns || item.extrasSelected, 'Extras')
  const variationTag = label(item.variacion || item.variation || item.variant, 'Variación')

  if (sizeTag) tags.push(sizeTag)
  if (variationTag) tags.push(variationTag)
  if (toppingsTag) tags.push(toppingsTag)
  if (extrasTag) tags.push(extrasTag)
  if (messageTag) tags.push(messageTag)
  if (item.categoria || item.category) tags.push(String(item.categoria || item.category).toUpperCase())

  return tags.slice(0, 3)
}

/* FIX PRINCIPAL: fetchProducts ahora se llama en onMounted */
const fetchProducts = async () => {
  try {
    loading.value = true
    const data = await apiService.get('/productos')
    const raw = Array.isArray(data) ? data : (data.products || [])

    allProducts.value = raw.map((p: any) => {
      const imgSource = p.imagen_url || p.imagen || p.image || p.imageUrl
      const finalImg = Array.isArray(imgSource) ? imgSource[0] : imgSource

      return {
        id: p.id || p.id_producto || p._id,
        name: p.nombre || p.name,
        price: Number(p.precio || p.price || 0),
        description: p.descripcion || p.description,
        category: String(p.categoria || p.category || 'OTROS').toUpperCase(),
        image: finalImg,
        imageUrl: finalImg,
        metaTags: buildMetaTags(p)
      }
    })
  } catch (err) {
    console.error('Error fetching related products:', err)
  } finally {
    loading.value = false
  }
}

/* FIX: Filtrado de ID más robusto — normaliza ambos lados */
const normalizeId = (id: any) => String(id ?? '').replace(/^id:/, '').trim()

const filteredProducts = computed(() => {
  if (!props.currentProduct) return allProducts.value
  const currentId = normalizeId(props.currentProduct.id)
  return allProducts.value.filter(p => normalizeId(p.id) !== currentId)
})

/* Resetear carrusel cuando cambia el producto */
watch(() => props.currentProduct, () => {
  currentIndex.value = 0
})

/* RESPONSIVE */
const cardsPerView = ref(4)

const updateCardsPerView = () => {
  const width = window.innerWidth
  if (width >= 1024) cardsPerView.value = 3
  else if (width >= 768) cardsPerView.value = 2
  else if (width >= 480) cardsPerView.value = 1
  else cardsPerView.value = 1
}

onMounted(() => {
  updateCardsPerView()
  window.addEventListener('resize', updateCardsPerView)
  fetchProducts() // ← FIX: esto faltaba completamente
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCardsPerView)
})

/* SLIDER */
const maxIndex = computed(() =>
  Math.max(filteredProducts.value.length - cardsPerView.value, 0)
)

const visibleProducts = computed(() =>
  filteredProducts.value.slice(currentIndex.value, currentIndex.value + cardsPerView.value)
)

/* Dots de paginación */
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / cardsPerView.value)
)

const currentPage = computed(() =>
  Math.floor(currentIndex.value / cardsPerView.value)
)

const goToPage = (page: number) => {
  currentIndex.value = Math.min(page * cardsPerView.value, maxIndex.value)
}
</script>

<template>
  <section class="related-products">
    <div class="related-header">
      <h2 class="related-title">También te puede gustar</h2>
      <p class="related-subtitle" v-if="!loading && filteredProducts.length > 0">
        {{ filteredProducts.length }} productos disponibles
      </p>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="related-skeletons">
      <div v-for="i in cardsPerView" :key="i" class="skeleton-card" />
    </div>

    <!-- Sin productos -->
    <div v-else-if="filteredProducts.length === 0" class="related-empty">
      <span class="empty-icon">🎂</span>
      <p>No hay más productos disponibles</p>
    </div>

    <!-- Slider con productos -->
    <div v-else class="related-wrapper">

      

      <div class="slider-container">
        <TransitionGroup name="slide" tag="div" class="related-grid">
          <ProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            v-bind="product"
          />
        </TransitionGroup>
      </div>

      
    </div>

    <!-- Dots de navegación -->
    <div v-if="totalPages > 1 && !loading" class="related-dots">
      <button
        v-for="page in totalPages"
        :key="page"
        class="dot"
        :class="{ active: currentPage === page - 1 }"
        @click="goToPage(page - 1)"
        :aria-label="`Página ${page}`"
      />
    </div>
  </section>
</template>

<style scoped>


.related-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 28px;
  padding: 0 4px;
}


.related-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted, #999);
  margin: 0;
}


.slider-container {
  flex: 1;
  overflow: hidden;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(cardsPerView), 1fr);
  gap: 16px;
}

.nav-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--primary, #c05080);
  background: white;
  color: var(--primary, #c05080);
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}


/* Dots */
.related-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--color-border, #e8d0e0);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot.active {
  background: var(--primary, #c05080);
  width: 24px;
  border-radius: 4px;
}

/* Skeletons */
.related-skeletons {
  display: grid;
  grid-template-columns: repeat(v-bind(cardsPerView), 1fr);
  gap: 16px;
}

.skeleton-card {
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(90deg, #f5e6f0 25%, #fdf0f7 50%, #f5e6f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Estado vacío */
.related-empty {
  text-align: center;
  padding: 40px;
  color: var(--text-muted, #999);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 2.5rem;
}

/* Transición slide */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>