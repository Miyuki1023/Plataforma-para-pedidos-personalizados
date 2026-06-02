<script setup lang="ts">
import EmployeeSidebar from "../components/organisms/Employe/EmployeeSidebar.vue";
import AppTopBar from "../components/organisms/Employe/AppTopBar.vue";
import ProductsPanel from "../components/organisms/Employe/ProductsPanel.vue";
</script>

<template>
  <div class="layout">
    <EmployeeSidebar />
    <div class="layout-content">
      <AppTopBar />
      <ProductsPanel />
    </div>
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
