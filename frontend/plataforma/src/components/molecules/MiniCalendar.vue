<script setup lang="ts">
import { ref } from 'vue'

const today = new Date()
const selectedDay = ref(14)
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const dayNames = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM']

// Dias con eventos
const busyDays: Record<number, 'alta' | 'dot' | 'selected'> = {
  3:  'dot',
  4:  'alta',
  5:  'dot',
  7:  'selected',
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number) {
  // 0=Sun → convert to Mon-based
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

const daysInMonth = getDaysInMonth(currentMonth.value, currentYear.value)
const firstDay    = getFirstDayOfMonth(currentMonth.value, currentYear.value)

const calendarCells = Array.from({ length: 35 }, (_, i) => {
  const day = i - firstDay + 1
  return day > 0 && day <= daysInMonth ? day : null
})

function prevMonth() { if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- } else currentMonth.value-- }
function nextMonth() { if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ } else currentMonth.value++ }
</script>

<template>
  <div class="mini-cal">
    <div class="cal-header">
      <span class="cal-title">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
      <div class="cal-nav">
        <button class="cal-nav-btn" @click="prevMonth">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="cal-today-btn">Hoy</button>
        <button class="cal-nav-btn" @click="nextMonth">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <div class="cal-grid">
      <div v-for="d in dayNames" :key="d" class="cal-day-name">{{ d }}</div>

      <button
        v-for="(day, i) in calendarCells"
        :key="i"
        class="cal-cell"
        :class="{
          'cal-cell--empty':    !day,
          'cal-cell--selected': day === selectedDay,
          'cal-cell--alta':     day !== null && busyDays[day] === 'alta',
          'cal-cell--dot':      day !== null && busyDays[day] === 'dot',
          'cal-cell--today':    day === today.getDate() && currentMonth === today.getMonth(),
        }"
        :disabled="!day"
        @click="day && (selectedDay = day)"
      >
        <span v-if="day" class="day-num">{{ day }}</span>
        <span v-if="day && busyDays[day] === 'alta'" class="day-tag">ALTA<br>CARGA</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mini-cal {
  background: #F8F3E9;
  border-radius: 24px;
  padding: 1.1rem 1.25rem;
}
.cal-header {
  padding: 0 2.5rem;
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}
.cal-title {
  font-family: 'Noto Serif', sans-serif;
  font-size: 1rem; font-weight: 800;
  color: #2a1a1a;
}
.cal-nav { display: flex; align-items: center; gap: 0.4rem; }
.cal-nav-btn {
  width: 26px; height: 26px;
  background: transparent; border: none;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #9e8080; transition: background 0.2s;
}
.cal-nav-btn:hover { background: #f5ece4; color: #8b1a2e; }
.cal-today-btn {
  padding: 0.2rem 0.6rem;
  background: #f4e9e0; border: none;
  border-radius: 24px;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem; font-weight: 700;
  color: #8b1a2e; cursor: pointer;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.cal-day-name {
  font-family: 'Lato', sans-serif;
  font-size: 0.62rem; font-weight: 800;
  letter-spacing: 0.06em; color: #9e8080;
  text-align: center; padding: 0.3rem 0;
}
.cal-cell {
  border: none; background: transparent;
  border-radius: 18px; cursor: pointer;
  min-height: 44px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1px; padding: 2px;
  transition: background 0.15s;
  position: relative;
}
.cal-cell:hover:not(:disabled):not(.cal-cell--selected) { background: #f5ece4; }
.cal-cell--empty { cursor: default; }
.day-num {
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem; font-weight: 600;
  color: #2a1a1a;
}
.cal-cell--selected {
  background: #8b1a2e !important;
  border-radius: 24px;
}
.cal-cell--selected .day-num { color: #fff; font-weight: 800; }

.cal-cell--alta { background: #fdf0e8; border-radius: 10px; }
.cal-cell--alta .day-num { color: #2a1a1a; }
.day-tag {
  font-family: 'Lato', sans-serif;
  font-size: 0.45rem; font-weight: 800;
  letter-spacing: 0.04em;
  color: #b45309; line-height: 1.2;
  text-align: center;
}

.cal-cell--dot::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #8b1a2e;
}
.cal-cell--today .day-num {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>