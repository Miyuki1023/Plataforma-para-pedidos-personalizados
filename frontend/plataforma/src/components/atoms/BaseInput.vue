<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="base-input-wrapper">
    <span class="base-input-icon">
      <slot name="icon" />
    </span>
    <input
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      class="base-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>