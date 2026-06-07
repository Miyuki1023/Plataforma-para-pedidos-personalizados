<script setup lang="ts">
defineProps<{
  orders: {
    id: string
    amount: string
    time: string
    items: string
    status: string
    statusType: 'process' | 'done' | 'delivered'
  }[]
}>()
</script>

<template>
  <div class="card orders-card">
    <h2 class="card-title">Pedidos en tiempo real</h2>

    <div class="order-list">
      <div
        v-for="(order, i) in orders"
        :key="order.id"
        class="order-item"
        :class="{ 'order-item--first': i === 0 }"
      >
        <div class="order-top">
          <span class="order-id">{{ order.id }}</span>
          <span class="order-amount">{{ order.amount }}</span>
        </div>
        <div class="order-time">{{ order.time }} AGO</div>
        <div class="order-items">{{ order.items }}</div>
        <div class="order-footer">
          <span class="order-badge" :class="`badge--${order.statusType}`">
            {{ order.status }}
          </span>
          <span
            v-if="order.statusType === 'delivered'"
            class="material-symbols-outlined delivered-icon"
          >done_all</span>
        </div>
      </div>
    </div>

    <button class="btn-download">
      <span class="material-symbols-outlined" style="font-size:15px">download</span>
      Download Report (.CSV)
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Noto+Serif:wght@700&family=Lato:wght@400;600;700;800&display=swap');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal; font-style: normal;
  line-height: 1; letter-spacing: normal;
  text-transform: none; display: inline-block;
  white-space: nowrap; direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.card { background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; padding: 1.25rem; display: flex; flex-direction: column; }
.card-title { font-family: 'Noto Serif', serif; font-size: 20px; font-weight: 700; color: #3f0006; margin: 0 0 0.25rem; }

.order-list { display: flex; flex-direction: column; gap: 0.65rem; margin: 0.75rem 0; }
.order-item { padding: 0.75rem; background: #fff; border-radius: 10px; display: flex; flex-direction: column; gap: 0.2rem; border-left: 3px solid #e8d5d5; }
.order-item--first { border-left-color: #c28c18; }

.order-top { display: flex; justify-content: space-between; align-items: center; }
.order-id { font-weight: 800; font-size: 0.82rem; color: #3f0006; }
.order-amount { font-weight: 700; font-size: 0.82rem; color: #2a1a1a; }
.order-time { font-size: 0.68rem; color: #bfa8a8; text-transform: uppercase; letter-spacing: 0.04em; }
.order-items { font-size: 0.72rem; color: #9e8080; line-height: 1.4; }
.order-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.2rem; }

.order-badge { display: inline-block; padding: 0.18rem 0.55rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em; }
.badge--process   { background: #fff4e0; color: #b45309; }
.badge--done      { background: #e6f4ee; color: #2e7d52; }
.badge--delivered { background: #f0e0e0; color: #9e8080; }

.delivered-icon { font-size: 16px !important; color: #9e8080; }

.btn-download { display: flex; align-items: center; justify-content: center; gap: 0.4rem; width: 100%; padding: 0.55rem; background: transparent; border: 1px solid #e8d5d5; border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 0.75rem; color: #9e8080; cursor: pointer; transition: border-color 0.2s, color 0.2s; margin-top: auto; }
.btn-download:hover { border-color: #8b1a2e; color: #8b1a2e; }
</style>