<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'
import { apiService } from '../../modules/service/api.service'

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

const categories = ref<string[]>([])

const fetchCategories = async () => {
  try {
    const response: any = await apiService.get('/categorias')

    const data = response?.data ?? response
    const rawCategories = Array.isArray(data) ? data : (data?.categories || [])
    const normalizedCategories = rawCategories.map((c: any): string => {
      const val = (typeof c === 'object' && c !== null)
        ? (c.nombre || c.categoria)
        : c
      return String(val || '').trim().toUpperCase()
    })

    categories.value = Array.from(new Set<string>(normalizedCategories)).filter(Boolean)
  } catch (err) {
    console.error('Error al cargar categorías:', err)
  }
}

onMounted(fetchCategories)

const isSelected = (category: string) => {

  return props.selectedCategories.includes(
    category
  )
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
    v-for="category in categories"
    :key="category"
    :model-value="isSelected(category)"
    @update:modelValue="
      $emit('toggle-category', category)
    "
  >
    {{ category }}
  </BaseCheckbox>

</div>

    </div>

  </aside>

</template>