<script setup lang="ts">
defineProps<{
  label: string
  extra?: string
  options: string[]
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>

  <div class="topping-group">

    <div class="topping-header">

      <p class="topping-label">
        {{ label }}
      </p>

      <span class="topping-extra">
        {{ extra }}
      </span>

    </div>

    <select
      class="topping-select"
      :value="modelValue"
      @change="
        $emit(
          'update:modelValue',
          ($event.target as HTMLSelectElement).value
        )
      "
    >

      <option value="">
        Elegir opción
      </option>

      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>

    </select>

  </div>

</template>