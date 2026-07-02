<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '../atoms/BaseButton.vue'
import FavoriteIcon from '../atoms/FavoriteIcon.vue'
import { useFavoritesStore } from '../../stores/favorites'

interface Props {
  id: string | number
  name: string
  price: number
  description?: string
  imageUrl?: string
  category?: string
  isNew?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  name: 'Producto',
  price: 0,
  description: '',
  imageUrl: '',
  category: '',
  isNew: false
})

const router = useRouter()
const favStore = useFavoritesStore()

// ✅ Sanitize
const safeId = computed(() => String(props.id ?? 0).replace('id:', ''))
const safeName = computed(() => props.name || 'Producto')
const safePrice = computed(() => Number(props.price) || 0)
const safeImageUrl = computed(() => props.imageUrl || '')
const safeCategory = computed(() => props.category || '')
const safeDescription = computed(() => props.description || '')

const goToProduct = () => {
  if (!safeId.value || safeId.value === '0') return
  router.push(`/producto/${safeId.value}`)
}

const toggleFavorite = () => {
  favStore.toggleFavorite({
    id: safeId.value,
    name: safeName.value,
    price: safePrice.value,
    imageUrl: safeImageUrl.value
  })
}
</script>

<template>
  <article
    v-if="safeId && safeId !== '0'"
    class="product-card"
  >

    <!-- IMAGE -->
    <div class="card-image-wrapper">

      <img
        v-if="safeImageUrl"
        :src="safeImageUrl"
        :alt="safeName"
        class="card-image"
        width="300"
        height="300"
        loading="lazy"
        decoding="async"
      />
      <div
        v-else
        class="card-image-placeholder"
      >
        <span>📸</span>
      </div>

      <span v-if="props.isNew" class="badge-new">
        NUEVO
      </span>

      <!-- ❤️ FAVORITO -->
      <FavoriteIcon
        :active="favStore.isFavorite(safeId)"
        @toggle="toggleFavorite"
        class="fav-icon"
      />

    </div>

    <!-- BODY -->
    <div class="card-body">

      <span v-if="safeCategory" class="card-category">
        {{ safeCategory }}
      </span>

      <h3 class="card-name">
        {{ safeName }}
      </h3>

      <p v-if="safeDescription" class="card-desc">
        {{ safeDescription }}
      </p>

      <p class="card-price">
        S/ {{ safePrice }}
      </p>

      <BaseButton
        class="btn-card"
        @click="goToProduct"
      >
        Ver detalles
      </BaseButton>

    </div>

  </article>
</template>
