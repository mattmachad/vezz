<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProductCards from './components/ProductCards.vue'
import CelebrityCard from './components/CelebrityCard.vue'
import Aboud from './components/About.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const cart = ref()

onMounted(() => {
  // Initialize store after app is mounted
  cart.value = useCartStore()
})
</script>


<template>
  <div v-if="route.path === '/'">
    <NavBar />
    <HeroSection />
    <ProductCards />
    <CelebrityCard />
    <Aboud />
    <Footer />
  </div>

  <router-view v-else />
</template>


<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>