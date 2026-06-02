<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface OrderItem {
  id: string | number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  title?: string
  client?: string
  date: string
  status: string
  total: number
  paymentMethod?: string
  paymentCode?: string
  delivery?: string
  receipt: string
  items?: OrderItem[]
}

const orders = ref<Order[]>([])

const loadOrders = () => {
  orders.value = JSON.parse(localStorage.getItem('orderHistory') || '[]')
}

const downloadReceipt = (receipt: string, title: string) => {
  const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Boleta-${title}.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
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
      <button class="btn-text-action" type="button" @click="loadOrders">Actualizar</button>
    </div>

    <div v-if="orders.length === 0" class="empty-msg">
      No hay pedidos registrados todavía. Finaliza una compra para crear tu primera boleta.
    </div>

    <div v-else class="premium-orders-grid">
      <article v-for="order in orders" :key="order.id" class="order-history-card">
        <div class="order-card-header">
          <div>
            <p class="order-card-title">{{ order.title || `Pedido ${order.id}` }}</p>
            <p class="order-card-date">{{ order.date }}</p>
          </div>
          <span class="order-status">{{ order.status }}</span>
        </div>

        <div class="order-card-meta">
          <p>Cliente: <strong>{{ order.client || 'Invitado' }}</strong></p>
          <p>Método: <strong>{{ order.paymentMethod || 'Yape / Plin' }}</strong></p>
          <p>Entrega: <strong>{{ order.delivery || 'No especificada' }}</strong></p>
        </div>

        <p class="order-card-total">Total: S/ {{ order.total.toFixed(2) }}</p>

        <button class="page-btn order-download-btn" type="button" @click="downloadReceipt(order.receipt, order.title || order.id)">
          Descargar boleta
        </button>
      </article>
    </div>
  </section>
</template>