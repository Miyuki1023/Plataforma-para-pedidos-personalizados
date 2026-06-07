<script setup lang="ts">

interface Props {
  name: string
  image: string
}

defineProps<Props>()
</script>

<template>
  <div class="profile-header">
   

    <div class="header-info">
      <h1 class="user-title">{{ name }}</h1>

      <span class="badge" role="status">
        <span class="badge-icon">✨</span>
        Miembro Exclusivo
      </span>
    </div>
  </div>
</template>
<style>
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;

  padding:  36px;

  border: 1px solid rgba(139, 49, 52, 0.12);
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);

  box-shadow: 0 6px 18px rgba(0,0,0,0.05);

  transition: all 0.25s ease;

  /* UX: mejora legibilidad en layouts oscuros/claros */
  color: #2a1a1a;
}

.profile-header:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(139, 49, 52, 0.12);
}

/* ========================= AVATAR ========================= */
.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.status-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;

  width: 14px;
  height: 14px;

  background: #22c55e;

  border: 2px solid #fff;
  border-radius: 50%;

  box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
}

/* ========================= INFO ========================= */
.header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* UX: evita overflow */
}

.user-title {
  font-family: 'Noto Serif', serif;
  font-weight: 700;

  margin: 0;

  color: #2a1a1a;

  /* jerarquía visual */
  font-size: 32px;
  line-height: 1.2;

  letter-spacing: -0.4px;

  /* UX: evita cortes */
  word-break: break-word;
}

/* ========================= BADGE ========================= */
.badge {
  width: fit-content;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 6px 12px;

  font-size: 13px;
  font-weight: 600;

  color: #8b3134;

  background: linear-gradient(135deg, #fff, #fdf6ee);

  border: 1px solid rgba(139, 49, 52, 0.18);
  border-radius: 999px;

  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* ========================= RESPONSIVE ========================= */

/* 📱 Mobile */
@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;

    gap: 14px;
    padding: 16px;
  }

  .user-title {
    font-size: 22px;
  }
}

/* 📱 Tablet */
@media (min-width: 481px) and (max-width: 768px) {
  .user-title {
    font-size: 26px;
  }
}

/* 💻 Laptop */
@media (min-width: 769px) and (max-width: 1024px) {
  .user-title {
    font-size: 30px;
  }
}

/* 🖥 Desktop */
@media (min-width: 1025px) {
  .user-title {
    font-size: 34px;
  }
}

/* 🖥 Ultra Wide */
@media (min-width: 1440px) {
  .profile-header {
    padding: 22px 28px;
  }

  .user-title {
    font-size: 38px;
  }
}

/* ========================= ACCESSIBILITY ========================= */

/* reduce motion (WCAG) */
@media (prefers-reduced-motion: reduce) {
  .profile-header {
    transition: none;
  }

  .profile-header:hover {
    transform: none;
  }
}
</style>