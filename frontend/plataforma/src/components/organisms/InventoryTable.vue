<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  items: {
    id: number
    name: string
    desc: string
    img: string
    stockLabel: string
    stockType: 'ok' | 'low' | 'out'
    price: string
  }[]
}>()

const toggles = ref<Record<number, boolean>>({ 1: true, 2: true, 3: false })
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">Inventario</h2>
        <p class="card-subtitle">Productos que requieren atención</p>
      </div>
      <a href="#" class="link-action">Ver todos</a>
    </div>

    <table class="inv-table">
      <thead>
        <tr>
          <th>PRODUCTOS</th>
          <th>STOCK</th>
          <th>PRECIO</th>
          <th>ESTADO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <div class="prod-cell">
              <img :src="item.img" :alt="item.name" class="prod-img" />
              <div>
                <div class="prod-name">{{ item.name }}</div>
                <div class="prod-desc">{{ item.desc }}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="stock-badge" :class="`stock--${item.stockType}`">
              {{ item.stockLabel }}
            </span>
          </td>
          <td class="price-cell">{{ item.price }}</td>
          <td>
            <button
              class="toggle"
              :class="{ 'toggle--on': toggles[item.id] }"
              @click="toggles[item.id] = !toggles[item.id]"
            >
              <span class="toggle-thumb" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Lato:wght@400;600;700&display=swap');

.card { background: #fef9ef; border: 1px solid #e8d5d5; border-radius: 14px; padding: 1.25rem; }
.card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
.card-title { font-family: 'Noto Serif', serif; font-size: 24px; font-weight: 700; color: #3f0006; margin: 0; }
.card-subtitle { font-size: 0.75rem; color: #9e8080; margin: 0.15rem 0 0; }
.link-action { font-size: 0.78rem; color: #8b1a2e; font-weight: 700; text-decoration: none; }

.inv-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; table-layout: fixed; }
.inv-table th, .inv-table td { text-align: left; padding: 0.75rem 0.5rem; }
.inv-table th { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; color: #574140; border-bottom: 1px solid #e8d5d5; }
.inv-table td { border-bottom: 1px solid #fdf6f0; vertical-align: middle; }
.inv-table tr:last-child td { border-bottom: none; }
.inv-table th:nth-child(1), .inv-table td:nth-child(1) { width: 45%; }
.inv-table th:nth-child(2), .inv-table td:nth-child(2) { width: 18%; }
.inv-table th:nth-child(3), .inv-table td:nth-child(3) { width: 18%; }
.inv-table th:nth-child(4), .inv-table td:nth-child(4) { width: 19%; }

.prod-cell { display: flex; align-items: center; gap: 0.6rem; }
.prod-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.prod-name { font-weight: 700; color: #2a1a1a; font-size: 0.82rem; }
.prod-desc { font-size: 0.7rem; color: #9e8080; }

.stock-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.stock--ok  { background: #e6f4ee; color: #2e7d52; }
.stock--low { background: #fff4e0; color: #b45309; }
.stock--out { background: #fde8e8; color: #9b1c1c; }
.price-cell { font-weight: 700; color: #2a1a1a; }

.toggle { width: 34px; height: 19px; background: #ddd; border: none; border-radius: 20px; cursor: pointer; position: relative; transition: background 0.25s; padding: 0; }
.toggle--on { background: #8b1a2e; }
.toggle-thumb { position: absolute; top: 2.5px; left: 2.5px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: transform 0.25s; display: block; }
.toggle--on .toggle-thumb { transform: translateX(15px); }
</style>