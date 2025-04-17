<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <p class="line">Elegância na</p>
        <p class="line">Medida do seu Tempo</p>
      </div>
      <button class="hero-button">➝ VISITE NOSSO CATÁLOGO</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
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
  border: 1px solid black;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 40px;
  transition: all 0.3s ease;
}

.hero-button:hover {
  background: black;
  color: white;
}
</style>
