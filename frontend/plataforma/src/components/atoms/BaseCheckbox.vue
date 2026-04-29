<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <label class="base-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      class="base-checkbox__input"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="base-checkbox__custom" />
    <span class="base-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<style scoped>
.base-checkbox {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.base-checkbox__input {
  display: none;
}

.base-checkbox__custom {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #c9a8a8;
  background: #fff;
  flex-shrink: 0;
  transition: border-color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-checkbox__input:checked + .base-checkbox__custom {
  border-color: #8b1a2e;
  background: #8b1a2e;
}

.base-checkbox__input:checked + .base-checkbox__custom::after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
}

.base-checkbox__label {
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: #6b5050;
  line-height: 1.4;
}

.base-checkbox__label a {
  color: #8b1a2e;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>