<script setup lang="ts">
import UserAvatar from '../../atoms/BaseAvatar.vue'

interface Props {
  name: string
  image: string
}

defineProps<Props>()
</script>

<template>
  <div class="profile-header">
    <UserAvatar :image="image" />

    <div>
      <h1>{{ name }}</h1>

      <span class="badge">
        Usuario concurrente
      </span>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

h1 {
  color: #7a2023;
  font-size: 42px;
}

.badge {
  background: white;
  border: 1px solid #d8b4b4;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}
</style>