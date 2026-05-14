<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '../components/organisms/Navbar.vue'
import ProductProfile from '../components/organisms/products/ProductProfile.vue'
import RelatedProducts from '../components/organisms/products/RelatedProducts.vue'
import Footer from '../components/organisms/Footer.vue'
import { apiService } from '../modules/service/api.service'

const props = defineProps<{
  id: string | number
}>()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    loading.value = true
    // Ajustamos la ruta al español para mantener consistencia
    const data = await apiService.get(`/productos/${props.id}`)

    // Si el backend devuelve { producto: {...} }, lo extraemos, sino usamos data directamente
    const p = data.producto || data
    
    product.value = {
      id: p.id,
      name: p.nombre || p.name || 'Producto sin nombre',
      price: Number(p.precio || p.price || 0),
      description: p.descripcion || p.description || '',
      category: String(p.categoria || p.category || 'OTROS').toUpperCase(),
      image: p.imagen_url || p.imagen || p.image || p.imageUrl,
      isNew: p.es_nuevo || p.isNew || false
    }
  } catch (err: any) {
    error.value = 'El postre solicitado no está disponible en este momento.'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>

  <div class="profile-view">

    <Navbar />

    <template v-if="loading">
      <div class="loading-state">Cargando producto...</div>
    </template>

    <template v-else-if="product">
      <!-- Pasamos los datos del producto al organismo -->
      <ProductProfile :product="product" />
    </template>

    <div v-else class="error-state">{{ error }}</div>

    <RelatedProducts />

    <Footer />

  </div>

</template>