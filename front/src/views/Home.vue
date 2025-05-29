<template>
  <div class="home">
    <NavBar />
    <div class="banner">
      <div class="text">
        <h1>VEZZ STORE</h1>
        <p>Elegância e estilo para todas as ocasiões</p>
      </div>
    </div>
    <ProductCards />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import ProductCards from '@/components/ProductCards.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #fff;
}

.banner {
  width: 100%;
  height: 500px;
  background-image: url('@/assets/banner.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 72px;
}

.text {
  color: #fff;
}

.text h1 {
  font-size: 64px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 1.25px;
}

.text p {
  font-size: 24px;
  letter-spacing: 0.94px;
}
</style> 