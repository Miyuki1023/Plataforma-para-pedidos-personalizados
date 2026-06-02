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
    <div class="avatar-container">
      <UserAvatar :src="image" :size="100" :alt="name" />
      <div class="status-indicator"></div>
    </div>

    <div class="header-info">
      <h1 class="user-title">{{ name }}</h1>

      <span class="badge">
        <span class="badge-icon">✨</span>
        Miembro Exclusivo
      </span>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 10px 0;
}

.avatar-container {
  position: relative;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.02);
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: #2ecc71;
  border: 3.5px solid #fff;
  border-radius: 50%;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-title {
  color: #2a1a1a;
  font-family: 'Noto Serif', serif;
  font-size: 42px;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.badge {
  width: fit-content;
  background: linear-gradient(135deg, #fff 0%, #fdf6ee 100%);
  border: 1px solid #ead8c8;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  color: #8b3134;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}
</style>