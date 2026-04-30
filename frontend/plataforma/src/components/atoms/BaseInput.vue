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

<style scoped>
.base-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  border: 1.5px solid #e8d5d5;
  border-radius: 50px;
  padding: 0.85rem 1.25rem;
  transition: border-color 0.25s, box-shadow 0.25s;
  width: 100%;
}
.base-input-wrapper:focus-within {
  border-color: #8b1a2e;
  box-shadow: 0 0 0 3px rgba(139, 26, 46, 0.08);
}
.base-input-icon {
  display: flex;
  align-items: center;
  color: #8b1a2e;
  flex-shrink: 0;
}
.base-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: #3a2020;
}
.base-input::placeholder {
  color: #bfa8a8;
}
</style>