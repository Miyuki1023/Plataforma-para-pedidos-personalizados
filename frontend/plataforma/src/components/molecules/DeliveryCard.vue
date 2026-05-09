<!-- molecules/DeliveryCard.vue -->

<script setup lang="ts">

defineProps<{
  day: string
  schedule: string
}>()

defineEmits([
  'update:day',
  'update:schedule'
])

const days = [

  {
    label: 'May 12',
    day: 'Lunes'
  },

  {
    label: 'May 13',
    day: 'Martes'
  },

  {
    label: 'May 14',
    day: 'Miércoles'
  }
]

</script>

<template>

  <div class="delivery-card">

    <h2 class="delivery-title">
      Detalles de Entrega
    </h2>

    <!-- DAYS -->
    <div class="delivery-group">

      <p class="group-label">
        Día seleccionado
      </p>

      <div class="days-grid">

        <button
          v-for="d in days"
          :key="d.label"
          class="day-btn"
          :class="{ active: day === d.label }"
          @click="$emit('update:day', d.label)"
        >
          <strong>{{ d.label }}</strong>

          <span>{{ d.day }}</span>

        </button>

      </div>

    </div>

    <!-- SCHEDULE -->
    <div class="delivery-group">

      <p class="group-label">
        Ventana de entrega
      </p>

      <select
        class="schedule-select"
        :value="schedule"
        @change="
          $emit(
            'update:schedule',
            ($event.target as HTMLSelectElement).value
          )
        "
      >
        <option>
          Mañana (07:00 - 09:00)
        </option>

        <option>
          Tarde (12:00 - 03:00)
        </option>

        <option>
          Noche (06:00 - 09:00)
        </option>

      </select>

    </div>

  </div>

</template>

<style scoped>

.delivery-card {

  padding: 2rem;

  border-radius: 2rem;

  background: white;

  border: 1px solid #ead8c8;
}

.delivery-title {

  font-size: 1.7rem;

  font-weight: 800;

  color: #2f2f2f;

  margin-bottom: 1.5rem;
}

.delivery-group {

  display: flex;

  flex-direction: column;

  gap: 1rem;

  margin-bottom: 1.5rem;
}

.group-label {

  font-size: .8rem;

  font-weight: 800;

  letter-spacing: 2px;

  text-transform: uppercase;

  color: #8b3134;
}

.days-grid {

  display: flex;

  gap: .8rem;
}

.day-btn {

  flex: 1;

  border: 1px solid #ead8c8;

  background: white;

  border-radius: 1rem;

  padding: 1rem;

  cursor: pointer;

  display: flex;

  flex-direction: column;

  gap: .3rem;

  transition: .25s;
}

.day-btn.active {

  background: #8b3134;

  color: white;
}

.schedule-select {

  width: 100%;

  border: none;

  outline: none;

  padding: 1rem;

  border-radius: 1rem;

  background: #f7e6cf;

  color: #5a3a2a;
}

</style>