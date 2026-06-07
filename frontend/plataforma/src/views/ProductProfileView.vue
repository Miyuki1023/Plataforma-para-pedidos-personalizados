<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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

const loadProduct = async () => {
  try {
    loading.value = true

    
    // Como el endpoint individual da 404, usamos el que sabemos que funciona (/productos)
    const data = await apiService.get('/productos')
    const rawProducts = Array.isArray(data) ? data : (data.products || [])
    
    // Buscamos el producto comparando los IDs como strings y limpiando prefijos
    const p = rawProducts.find((item: any) => {
      const itemId = String(item.id || item.id_producto || item._id || '').replace('id:', '')
      const searchId = String(props.id).replace('id:', '')
      return itemId === searchId
    })

    if (!p) throw new Error('El postre solicitado no se encuentra en el catálogo.')

    // Extraemos la URL de la imagen de forma segura (siempre String)
    const imgSource = p.imagen_url || p.imagen || p.image || p.imageUrl
    const finalImage = Array.isArray(imgSource) ? imgSource[0] : imgSource

    product.value = {
      id: p.id || p.id_producto || p._id || props.id,
      name: p.nombre || p.name || 'Producto sin nombre',
      price: Number(p.precio || p.price || 0),
      description: p.descripcion || p.description || '',
      category: String(p.categoria || p.category || 'OTROS').toUpperCase(),
      image: finalImage,
      imageUrl: finalImage, // Sincronizamos ambos para evitar warnings de Vue
      isNew: p.es_nuevo || p.isNew || false,
      disponible: p.disponible ?? true
    }
  } catch (err: any) {
    error.value = 'El postre solicitado no está disponible en este momento.'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
};

onMounted(loadProduct)

// CRUCIAL: Vigilar cambios en el ID para recargar los datos cuando se navega entre productos relacionados
watch(() => props.id, loadProduct)
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

    <RelatedProducts :current-product="product" />

    <Footer />

  </div>

</template>