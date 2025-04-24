<script setup>
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProductCards from './components/ProductCards.vue'
import CelebrityCard from './components/CelebrityCard.vue'
import Aboud from './components/About.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
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