<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  options?: { label: string; value: string }[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="base-input-wrapper" :class="{ 'base-input--disabled': disabled }">
    <span class="base-input-icon">
      <slot name="icon" />
    </span>

    <!-- SELECT -->
    <select
      v-if="type === 'select'"
      :value="modelValue"
      :disabled="disabled"
      class="base-input"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>Selecciona tu sexo</option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- INPUT -->
    <input
      v-else
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      class="base-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>