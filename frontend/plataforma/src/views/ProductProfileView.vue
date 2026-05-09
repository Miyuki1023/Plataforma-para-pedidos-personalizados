<script setup lang="ts">

import Navbar from '../components/organisms/Navbar.vue'

import ProductProfile from '../components/organisms/products/ProductProfile.vue'

import RelatedProducts from '../components/organisms/products/RelatedProducts.vue'

import Footer from '../components/organisms/Footer.vue'

</script>

<template>

  <div class="profile-view">

    <Navbar />

    <ProductProfile />

    <RelatedProducts />

    <Footer />

  </div>

</template>