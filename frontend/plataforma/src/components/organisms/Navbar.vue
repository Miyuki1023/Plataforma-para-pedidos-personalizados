<script setup lang="ts">
import BaseIcon from '../atoms/BaseIcon.vue'

</script>

<template>
  <header class="navbar">
    <button class="icon-btn">
      <BaseIcon name="menu" :size="20" />
    </button>

    <div class="navbar-brand">Vainilla y miel</div>

    <div class="navbar-actions">
      <button class="icon-btn"><BaseIcon name="search" :size="20" /></button>
      <button class="icon-btn"><BaseIcon name="user"   :size="20" /></button>
      <button class="icon-btn"><BaseIcon name="cart"   :size="20" /></button>
    </div>
  </header>
</template>

