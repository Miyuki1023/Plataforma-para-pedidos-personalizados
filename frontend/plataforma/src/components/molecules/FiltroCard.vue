<script setup lang="ts">
import BaseCheckbox from '../atoms/BaseCheckbox.vue'

const props = defineProps<{
  minPrice: number
  maxPrice: number
  selectedCategories: string[]
}>()

defineEmits([
  'update:minPrice',
  'update:maxPrice',
  'toggle-category'
])

const isSelected = (category: string) => {
  return props.selectedCategories.includes(category)
}
</script>

<template>

  <aside class="filter-card">

    <!-- HEADER -->
    <div class="filter-header">

      <span class="filter-line" />

      <h3 class="filter-title">
        Filtrar productos
      </h3>

    </div>

    <!-- PRICE -->
    <div class="filter-group">

      <p class="filter-label">
        Rango de precio
      </p>

      <!-- MIN -->
      <div class="slider-wrapper">

        <label class="slider-label">
          Precio mínimo
        </label>

        <input
          :value="minPrice"
          type="range"
          min="20"
          max="400"
          step="5"
          class="slider"
          @input="
            $emit(
              'update:minPrice',
              Number(
                ($event.target as HTMLInputElement).value
              )
            )
          "
        />

      </div>

      <!-- MAX -->
      <div class="slider-wrapper">

        <label class="slider-label">
          Precio máximo
        </label>

        <input
          :value="maxPrice"
          type="range"
          min="20"
          max="400"
          step="5"
          class="slider"
          @input="
            $emit(
              'update:maxPrice',
              Number(
                ($event.target as HTMLInputElement).value
              )
            )
          "
        />

      </div>

      <!-- VALUES -->
      <div class="price-values">

        <div class="price-box">

          <span class="price">
            S/ {{ minPrice }}
          </span>

          <p class="price-text">
            Mínimo
          </p>

        </div>

        <div class="price-box">

          <span class="price">
            S/ {{ maxPrice }}
          </span>

          <p class="price-text">
            Máximo
          </p>

        </div>

      </div>

    </div>

    <!-- CATEGORY -->
    <div class="filter-group">

      <p class="filter-label">
        Categorías
      </p>

      <div class="filter-options">

        <BaseCheckbox
          :model-value="isSelected('TORTAS')"
          @update:modelValue="
            $emit('toggle-category', 'TORTAS')
          "
        >
          Tortas
        </BaseCheckbox>

        <BaseCheckbox
          :model-value="isSelected('CHEESECAKES')"
          @update:modelValue="
            $emit('toggle-category', 'CHEESECAKES')
          "
        >
          Cheesecakes
        </BaseCheckbox>

        <BaseCheckbox
          :model-value="isSelected('GALLETAS')"
          @update:modelValue="
            $emit('toggle-category', 'GALLETAS')
          "
        >
          Galletas
        </BaseCheckbox>

        <BaseCheckbox
          :model-value="isSelected('OTROS')"
          @update:modelValue="
            $emit('toggle-category', 'OTROS')
          "
        >
          Otros
        </BaseCheckbox>

      </div>

    </div>

  </aside>

</template>