<script setup lang="ts">
import Adminsidebar from "../components/organisms/AdminSidebar.vue";
import ProductsPanel from "../components/organisms/ProductsPanel.vue";
</script>

<template>
  <div class="layout">
    <Adminsidebar />
    <main class="layout-content" id="main-content">
      <ProductsPanel />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: "Lato", sans-serif;
}
.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>