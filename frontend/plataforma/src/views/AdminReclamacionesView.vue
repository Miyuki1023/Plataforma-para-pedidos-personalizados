<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../lib/api';
import AdminSidebar from '../components/organisms/AdminSidebar.vue';

interface Reclamo {
  id: number;
  nombre: string;
  email: string;
  tipo_mensaje: string;
  calificacion: number;
  mensaje: string;
  fecha_creacion: string;
}

const reclamaciones = ref<Reclamo[]>([]);
const filtroTipo = ref('Todos');
const tiposDisponibles = [
  { value: 'Todos', label: 'Todos' },
  { value: 'recommendation', label: 'Recomendación' },
  { value: 'feedback', label: 'Sugerencia' },
  { value: 'complaint', label: 'Queja' }
];

const labelPorTipo: Record<string, string> = {
  recommendation: 'Recomendación',
  feedback: 'Sugerencia',
  complaint: 'Queja',
  question: 'Pregunta'
};

const fetchReclamaciones = async () => {
  try {
    const res = await api.get('/reclamaciones');
    reclamaciones.value = res.data;
  } catch (error) {
    console.error('Error al cargar reclamaciones:', error);
  }
};

const filtrados = computed(() => {
  if (filtroTipo.value === 'Todos') return reclamaciones.value;
  return reclamaciones.value.filter(r => r.tipo_mensaje === filtroTipo.value);
});

const contadorPorTipo = computed(() => {
  return tiposDisponibles.reduce((acc, tipo) => {
    acc[tipo.value] = tipo.value === 'Todos'
      ? reclamaciones.value.length
      : reclamaciones.value.filter(r => r.tipo_mensaje === tipo.value).length;
    return acc;
  }, {} as Record<string, number>);
});

onMounted(fetchReclamaciones);
</script>

<template>
  <div class="admin-dashboard">
    <AdminSidebar />
    <main class="admin-main">
      <div class="admin-content">
        
        <div class="page-header">
          <h1 class="page-title">Libro de Reclamaciones</h1>
          <p class="page-subtitle">Gestiona y responde a los comentarios de tus clientes</p>
        </div>

        <div class="stats-grid">
          <div 
            v-for="tipo in tiposDisponibles" 
            :key="tipo.value" 
            class="stat-card stat-card--light"
            :class="{ 'stat-card--active': filtroTipo === tipo.value }"
            @click="filtroTipo = tipo.value"
          >
            <span class="stat-label">{{ tipo.label.toUpperCase() }}</span>
            <div class="stat-value">{{ contadorPorTipo[tipo.value] }}</div>
          </div>
        </div>

        <div class="table-container">
          <table class="reclamos-table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CLIENTE</th>
                <th>TIPO</th>
                <th>CALIF.</th>
                <th>MENSAJE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filtrados" :key="item.id">
                <td>{{ new Date(item.fecha_creacion).toLocaleDateString() }}</td>
                <td>
                  <div class="cell-name">{{ item.nombre }}</div>
                  <small class="cell-email">{{ item.email }}</small>
                </td>
                <td><span :class="['badge', item.tipo_mensaje]">{{ labelPorTipo[item.tipo_mensaje] || item.tipo_mensaje }}</span></td>
                <td><span class="star-rating">★ {{ item.calificacion }}</span></td>
                <td class="msg-cell">{{ item.mensaje }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* Importamos estilos base del Dashboard */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Lato:wght@300;400;600;700&display=swap');

.admin-dashboard { display: flex; min-height: 100vh; background: #fff; font-family: 'Lato', sans-serif; }
.admin-main { flex: 1; display: flex; flex-direction: column; overflow: auto; }
.admin-content { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.25rem 2.75rem; }

.page-title { font-family: 'Noto Serif', serif; font-size: 1.8rem; font-weight: 700; color: #3f0006; margin: 0; }
.page-subtitle { font-size: 0.8rem; color: #7c5730; margin-bottom: 1rem; }

/* Grid de Filtros estilo Stat Card */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
.stat-card { border-radius: 14px; padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; cursor: pointer; transition: 0.2s; border: 1px solid #e8d5d5; }
.stat-card--light { background: #fef9ef; }
.stat-card--active { background: #8b1a2e; border-color: #8b1a2e; }
.stat-card--active .stat-label { color: rgba(255,255,255,0.7); }
.stat-card--active .stat-value { color: #fff; }

.stat-label { font-size: 0.65rem; font-weight: 800; color: #9e8080; }
.stat-value { font-family: 'Noto Serif', serif; font-size: 1.5rem; font-weight: 700; color: #3f0006; }

/* Tabla */
.table-container { background: #fff; border: 1px solid #eee; border-radius: 14px; overflow: hidden; }
.reclamos-table { width: 100%; border-collapse: collapse; text-align: left; }
.reclamos-table th { padding: 1rem; background: #fdfdfd; font-size: 0.7rem; color: #9e8080; letter-spacing: 0.05em; }
.reclamos-table td { padding: 1rem; border-top: 1px solid #eee; font-size: 0.85rem; color: #4a3f3f; }

.cell-name { font-weight: 700; color: #3f0006; }
.cell-email { color: #7c5730; }

.badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.recommendation { background: #dcfce7; color: #166534; }
  .feedback { background: #dbeafe; color: #1e40af; }
  .complaint { background: #fee2e2; color: #991b1b; }
  .question { background: #ede9fe; color: #3730a3; }

.star-rating { color: #d97706; font-weight: 700; }
.msg-cell { max-width: 400px; }
</style>