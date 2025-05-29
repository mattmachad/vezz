<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { useAuthStore } from '@/stores/auth'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProductCards from './components/ProductCards.vue'
import CelebrityCard from './components/CelebrityCard.vue'
import Aboud from './components/About.vue'
import Footer from './components/Footer.vue'
import '@/assets/styles/theme.css'

const route = useRoute()
const cart = ref()
const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()

onMounted(() => {
  // Initialize store after app is mounted
  cart.value = useCartStore()
  // Initialize dark mode
  darkModeStore.init()
  // Initialize auth store
  authStore.init()
})
</script>


<template>
  <div class="app">
    <div v-if="route.path === '/'">
      <NavBar />
      <HeroSection />
      <ProductCards />
      <CelebrityCard />
      <Aboud />
      <Footer />
    </div>

    <router-view v-else />
  </div>
</template>


<style>
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.app {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>