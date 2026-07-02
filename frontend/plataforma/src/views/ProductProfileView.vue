<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { defineAsyncComponent } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import ProductProfile from '../components/organisms/products/ProductProfile.vue'
import { apiService } from '../lib/api'

const RelatedProducts = defineAsyncComponent(() =>
  import('../components/organisms/products/RelatedProducts.vue')
)
const Footer = defineAsyncComponent(() =>
  import('../components/organisms/Footer.vue')
)

const props = defineProps<{
  id: string | number
}>()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const showRelated = ref(false)
const showFooter = ref(false)

const loadProduct = async () => {
  try {
    loading.value = true
    showRelated.value = false
    showFooter.value = false

    const data = await apiService.get('/productos')
    const rawProducts = Array.isArray(data) ? data : (data.products || [])

    const p = rawProducts.find((item: any) => {
      const itemId = String(item.id || item.id_producto || item._id || '').replace('id:', '')
      const searchId = String(props.id).replace('id:', '')
      return itemId === searchId
    })

    if (!p) throw new Error('El postre solicitado no se encuentra en el catálogo.')

    const imgSource = p.imagen_url || p.imagen || p.image || p.imageUrl
    const finalImage = Array.isArray(imgSource) ? imgSource[0] : imgSource

    product.value = {
      id: p.id || p.id_producto || p._id || props.id,
      name: p.nombre || p.name || 'Producto sin nombre',
      price: Number(p.precio || p.price || 0),
      description: p.descripcion || p.description || '',
      category: String(p.categoria || p.category || 'OTROS').toUpperCase(),
      image: finalImage,
      imageUrl: finalImage,
      isNew: p.es_nuevo || p.isNew || false,
      disponible: p.disponible ?? true
    }

    // Diferir componentes secundarios con requestIdleCallback o rAF
    requestAnimationFrame(() => {
      showRelated.value = true
    })
    requestAnimationFrame(() => {
      showFooter.value = true
    })
  } catch (err: any) {
    error.value = 'El postre solicitado no está disponible en este momento.'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadProduct)

watch(() => props.id, loadProduct)
</script>

<template>
  <div class="profile-view">
    <Navbar />

    <!-- ═══════════════════════════════════════════
         SKELETON — dimensiones EXACTAS del real
         para eliminar CLS en la transición
         ═══════════════════════════════════════════ -->
    <template v-if="loading">
      <section class="skeleton-profile" aria-label="Cargando producto">
        <div class="skeleton-profile-gallery">
          <div class="skeleton-image-main skeleton" />
          <div class="skeleton-thumbs-row">
            <div v-for="i in 3" :key="i" class="skeleton-thumb skeleton" />
          </div>
        </div>
        <div class="skeleton-profile-content">
          <div class="skeleton skeleton-category" />
          <div class="skeleton skeleton-title" />
          <div class="skeleton skeleton-description" />
          <div class="skeleton skeleton-stock" />
          <div class="skeleton skeleton-section" />
          <div class="skeleton skeleton-section-lg" />
          <div class="skeleton skeleton-section" />
          <div class="skeleton skeleton-button" />
        </div>
      </section>
    </template>

    <template v-else-if="product">
      <ProductProfile :product="product" />
    </template>

    <div v-else class="error-state">{{ error }}</div>

    <RelatedProducts v-if="showRelated" :current-product="product" />
    <Footer v-if="showFooter" />
  </div>
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ═══════════════════════════════════════════
   SKELETON — dimensiones fijas para CLS ~0
   ═══════════════════════════════════════════ */
.skeleton-profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
  align-items: start;
  width: 100%;
}

@media (max-width: 768px) {
  .skeleton-profile {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px 16px;
  }
}

.skeleton-profile-gallery {
  position: sticky;
  top: 100px;
}

.skeleton-image-main {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 24px;
}

.skeleton-thumbs-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.skeleton-thumb {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 12px;
}

.skeleton-profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-category {
  height: 20px;
  width: 40%;
  border-radius: 8px;
}

.skeleton-title {
  height: 36px;
  width: 70%;
  border-radius: 8px;
}

.skeleton-description {
  height: 18px;
  width: 100%;
  border-radius: 8px;
}

.skeleton-stock {
  height: 24px;
  width: 50%;
  border-radius: 8px;
}

.skeleton-section {
  height: 60px;
  width: 100%;
  border-radius: 18px;
}

.skeleton-section-lg {
  height: 120px;
  width: 100%;
  border-radius: 18px;
}

.skeleton-button {
  height: 50px;
  width: 100%;
  border-radius: 50px;
}

.error-state {
  text-align: center;
  padding: 60px 24px;
  color: var(--text-muted, #999);
  font-size: 1.1rem;
}
</style>