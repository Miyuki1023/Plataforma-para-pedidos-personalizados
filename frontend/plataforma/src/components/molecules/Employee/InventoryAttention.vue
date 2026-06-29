<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '../../../lib/api'

interface Product {
  id: number
  nombre: string
  precio: number
  stock: number
  disponible: boolean
  imagen_url?: string[]
}

const products = ref<Product[]>([])
const loading = ref(false)

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await apiService.get('/productos')
    products.value = res || []
  } catch (err) {
    console.error('Error al cargar inventario:', err)
  } finally {
    loading.value = false
  }
}

// Filtramos productos que requieren atención (poco stock o desactivados)
const attentionProducts = computed(() => {
  return products.value
    .filter(p => p.stock <= 10 || !p.disponible)
    .sort((a, b) => a.stock - b.stock) // Prioridad a los de menor stock
    .slice(0, 5) 
})

onMounted(fetchProducts)
</script>

<template>
  <div class="inventory-card">
    <div class="card-header">
      <h2 class="card-title">Inventario</h2>
      <p class="card-subtitle">Productos que requieren atención inmediata.</p>
    </div>

    <div class="table-container">
      <table class="mini-table">
        <thead>
          <tr>
            <th>PRODUCTO</th>
            <th>STOCK</th>
            <th>PRECIO</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in attentionProducts" :key="p.id">
            <td>
              <div class="prod-info">
                <img 
                  :src="p.imagen_url?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=40&q=80'" 
                  class="prod-img"
                  alt="producto"
                />
                <span class="prod-name">{{ p.nombre }}</span>
              </div>
            </td>
            <td>
              <span class="stock-val" :class="{ 'low': p.stock <= 10 && p.stock > 0, 'out': p.stock === 0 }">
                {{ p.stock }} und.
              </span>
            </td>
            <td>S/ {{ Number(p.precio).toFixed(2) }}</td>
            <td>
              <span class="status-badge" :class="p.disponible ? 'active' : 'inactive'">
                {{ p.disponible ? 'Activo' : 'Pausado' }}
              </span>
            </td>
          </tr>
          <tr v-if="!loading && attentionProducts.length === 0">
            <td colspan="4" class="empty-state">Todo el inventario está en niveles óptimos.</td>
          </tr>
          <tr v-if="loading">
            <td colspan="4" class="empty-state">Cargando inventario...</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <router-link to="/empleado/productos" class="view-all-link">
      Gestionar inventario completo
      <span class="material-symbols-rounded">arrow_forward</span>
    </router-link>
  </div>
</template>

<style scoped>
.inventory-card {
  background: #F8F3E9;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}
.card-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #3F0006;
  margin: 0;
}
.card-subtitle {
  font-size: 13px;
  color: #9e8080;
  margin: 0.2rem 0 0;
}
.table-container {
  flex: 1;
}
.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.mini-table th {
  text-align: left;
  padding: 0.5rem;
  color: #7C573099;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid #ede8de;
}
.mini-table td {
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid #f5ece4;
  vertical-align: middle;
}
.prod-info { display: flex; align-items: center; gap: 0.75rem; }
.prod-img { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; background: #fff; }
.prod-name { font-weight: 700; color: #3F0006; }

.stock-val { font-weight: 800; }
.stock-val.low { color: #b45309; }
.stock-val.out { color: #9b1c1c; }

.status-badge { padding: 0.25rem 0.6rem; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.status-badge.active { background: #e6f4ee; color: #2e7d52; }
.status-badge.inactive { background: #fde8e8; color: #9b1c1c; }

.view-all-link {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-size: 0.85rem; font-weight: 700; color: #8b1a2e; text-decoration: none;
  margin-top: auto; padding-top: 1rem;
}
.view-all-link .material-symbols-rounded { font-size: 16px; }
.view-all-link:hover { text-decoration: underline; }

.empty-state { text-align: center; padding: 3rem 0; color: #9e8080; font-style: italic; }
</style>