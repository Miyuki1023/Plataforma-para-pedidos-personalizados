<script setup lang="ts">
import BaseInput from '../../atoms/BaseInput.vue'
import PrimaryButton from '../../atoms/PrimaryButton.vue'

interface Props {
  name: string
  phone: string
  email: string
  address: string
}

const props = defineProps<Props>()
</script>

<template>
  <aside class="premium-sidebar">
    <h2 class="sidebar-title">Información Personal</h2>

    <div class="sidebar-form">
      <BaseInput
        label="Nombre Completo"
        :model-value="name"
      />

      <BaseInput
        label="Teléfono"
        :model-value="phone"
      />

      <BaseInput
        label="Correo Electrónico"
        :model-value="email"
      />

      <BaseInput
        label="Dirección de Envío"
        :model-value="address"
      />
    </div>

    <PrimaryButton class="btn-save-profile" text="Guardar Cambios" />
  </aside>
</template>