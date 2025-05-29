<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <p class="line">Elegância na</p>
        <p class="line">Medida do seu Tempo</p>
      </div>
      <button class="hero-button" @click="goToProducts">➝ VISITE NOSSO CATÁLOGO</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.hero {
  background-image: url('@/assets/bg-header.png');
  background-size: cover;
  background-position: center;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-content {
  text-align: center;
  color: white;
  font-family: 'Roboto Serif', serif;
  text-shadow: 1px 1px 20px rgba(0, 0, 0, 0.4);
}

.hero-text {
  font-size: 64px;
  line-height: 1.1;
  margin-bottom: 32px;
}

.line {
  margin: 0;
}

.hero-button {
  background: white;
  color: black;
  border: 2px solid black;
  padding: 16px 32px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 40px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.hero-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.hero-button:hover::before {
  left: 100%;
}

.hero-button:hover {
  background: black;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.hero-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
