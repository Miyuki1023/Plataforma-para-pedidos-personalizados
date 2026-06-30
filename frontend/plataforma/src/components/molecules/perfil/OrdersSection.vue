<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '../../../lib/api'

interface OrderItem {
  id: string | number
  name: string
  quantity: number
  price: number
  options?: string
}

interface Order {
  id_pedido: string | number
  id_cliente: number
  fecha_creacion: string
  estado_pedido: string
  total: number
  cliente_nombre?: string
  receipt?: string
  items?: OrderItem[] // Detalles del pedido
  metodo_pago?: string
  direccion_entrega?: string
  costo_envio?: number
  fecha_entrega_elegida?: string
  hora_entrega_elegida?: string
}

const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Paginación
const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => Math.max(1, Math.ceil(orders.value.length / itemsPerPage)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return orders.value.slice(start, start + itemsPerPage)
})

const loadOrders = async () => {
  try {
    loading.value = true
    error.value = null
    // ✅ Llamar a API en lugar de localStorage
    const data = await apiService.get('/orders')
    orders.value = data.orders || []
  } catch (err: any) {
    error.value = err?.message || 'Error al cargar pedidos'
    console.error('Error loading orders:', err)
  } finally {
    loading.value = false
  }
}

const downloadReceipt = (order: Order) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const fechaRepo = new Date(order.fecha_creacion).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  const diaSemana = new Date(order.fecha_creacion).toLocaleDateString('es-PE', { weekday: 'long' });
  
  const itemsHtml = (order.items || []).map(item => {
    const priceStr = Number(item.price).toFixed(2);
    const optionsInfo = item.options ? `Extra: ${item.options}` : '';
    return `
      <div class="producto">
        <div class="producto-info">
          <h4>${item.name}</h4>
          <div class="tags">
            Cantidad: ${item.quantity} <br>
            ${optionsInfo}
          </div>
        </div>
        <div class="precio">S/ ${priceStr}</div>
      </div>
    `;
  }).join('');

  const productsListHtml = itemsHtml || `
    <div class="producto">
      <div class="producto-info"><h4>Pedido General #${order.id_pedido}</h4></div>
      <div class="precio">S/ ${Number(order.total - (order.costo_envio || 0)).toFixed(2)}</div>
    </div>
  `;

  const deliveryAddress = order.direccion_entrega || 'Recojo en tienda';
  const paymentMethod = order.metodo_pago || 'Yape / Tarjeta';
  const deliveryTime = order.hora_entrega_elegida || '09:00 - 18:00';
  const deliveryDate = order.fecha_entrega_elegida || fechaRepo;
  const shippingCost = Number(order.costo_envio || 10).toFixed(2);
  const totalAmount = Number(order.total).toFixed(2);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; padding: 20px; color: #2a1a1a; }
        .boleta { width: 380px; background: #fff3ee; border-radius: 18px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin: auto; border: 1px solid #f7d7c4; }
        .titulo { text-align: center; font-size: 24px; font-weight: bold; color: #7a3b2e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .info-box { display: flex; justify-content: space-between; background: #fbe9e2; padding: 12px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; border: 1px solid #f7d7c4; }
        .section-title { font-weight: bold; margin: 15px 0 10px; color: #5a2d23; font-size: 14px; border-bottom: 1px solid #f7d7c4; padding-bottom: 5px; }
        .producto { display: flex; justify-content: space-between; background: #fff; padding: 12px; border-radius: 12px; align-items: center; margin-bottom: 8px; }
        .producto-info h4 { margin: 0; font-size: 14px; color: #333; }
        .tags { font-size: 11px; color: #888; margin-top: 4px; line-height: 1.4; }
        .precio { font-weight: bold; color: #7a3b2e; font-size: 14px; }
        .linea { display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px; }
        .total { font-weight: bold; font-size: 18px; color: #7a3b2e; border-top: 2px dashed #f7d7c4; padding-top: 10px; margin-top: 15px; }
        .box { background: #fff; padding: 12px; border-radius: 12px; margin-top: 10px; font-size: 12px; border: 1px solid #f7d7c4; }
        .footer { text-align: center; margin-top: 25px; font-size: 14px; color: #7a3b2e; font-style: italic; }
        @media print { body { padding: 0; } .boleta { box-shadow: none; border: 1px solid #eee; } }
      </style>
    </head>
    <body>
      <div class="boleta">
        <div class="titulo">Vainilla y Miel</div>
        
        <div class="info-box">
          <div>
            <strong>Fecha elegida</strong><br>
            ${deliveryDate}<br>
            <span style="text-transform: capitalize;">${diaSemana}</span>
          </div>
          <div style="text-align: right;">
            <strong>Hora</strong><br>
            ${deliveryTime}
          </div>
        </div>

        <div class="section-title">Productos</div>
        ${productsListHtml}

        <div class="section-title">Resumen</div>
        <div class="linea">
          <span>Transporte</span>
          <span>S/ ${shippingCost}</span>
        </div>

        <div class="linea total">
          <span>Precio Total</span>
          <span>S/ ${totalAmount}</span>
        </div>

        <div class="box">
          <strong>Método de pago</strong><br>
          💳 ${paymentMethod}
        </div>

        <div class="box">
          <strong>Dirección de entrega</strong><br>
          📍 ${deliveryAddress}<br>
          Lima, Perú
        </div>

        <div class="footer">
          Gracias por su compra 💖
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      <\/script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

onMounted(loadOrders)
</script>

<template>
  <section class="premium-section">
    <div class="premium-section-header">
      <div>
        <h2 class="section-title">Historial de Pedidos</h2>
        <p class="section-description">Tus compras recientes quedan guardadas para que puedas revisarlas fácilmente.</p>
      </div>
      <button class="btn-text-action" type="button" @click="loadOrders" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <div v-else-if="orders.length === 0" class="empty-msg">
      No hay pedidos registrados todavía. Finaliza una compra para crear tu primera boleta.
    </div>

    <div v-else class="premium-orders-grid">
      <article v-for="order in paginatedOrders" :key="order.id_pedido" class="order-history-card">
        <div class="order-card-header">
          <div>
            <p class="order-card-title">Pedido #{{ order.id_pedido }}</p>
            <p class="order-card-date">{{ new Date(order.fecha_creacion).toLocaleDateString('es-PE') }}</p>
          </div>
          <span class="order-status">{{ order.estado_pedido }}</span>
        </div>

        <div class="order-card-meta">
          <p>Cliente: <strong>{{ order.cliente_nombre || 'Usuario' }}</strong></p>
        </div>

        <p class="order-card-total">Total: S/ {{ Number(order.total).toFixed(2) }}</p>

        <button class="page-btn order-download-btn" type="button" @click="downloadReceipt(order)">
          Descargar boleta
        </button>
      </article>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="orders-pagination">
      <button
        class="page-btn"
        :disabled="currentPage <= 1"
        @click="currentPage--"
      >
        ← Anterior
      </button>
      <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
      >
        Siguiente →
      </button>
    </div>
  </section>
</template>
