<template>
  <NavBar />
  <div :class="$style.product" :data-dark="isDark ? 'dark' : 'light'">
    <b :class="$style.stVezz">ST. VEZZ - BEM VINDO</b>
    <div :class="$style.fotos01">
      <img :class="$style.fotoIcon" alt="Look 1" src="@/assets/lookbook/1.jpg" />
      <img :class="$style.fotoIcon" alt="Look 2" src="@/assets/lookbook/2.jpg" />
      <img :class="$style.fotoIcon" alt="Look 3" src="@/assets/lookbook/3.jpg" />
    </div>
    <div :class="$style.fotos01">
      <img :class="$style.fotoIcon" alt="Look 4" src="@/assets/lookbook/4.jpg" />
      <img :class="$style.fotoIcon" alt="Look 5" src="@/assets/lookbook/5.jpg" />
      <img :class="$style.fotoIcon" alt="Look 6" src="@/assets/lookbook/6.jpg" />
    </div>
    <div :class="$style.fotos01">
      <img :class="$style.fotoIcon" alt="Look 7" src="@/assets/lookbook/7.jpg" />
      <img :class="$style.fotoIcon" alt="Look 8" src="@/assets/lookbook/8.png" />
      <img :class="$style.fotoIcon" alt="Look 9" src="@/assets/lookbook/9.jpg" />
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDarkModeStore } from '@/stores/darkMode'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const darkModeStore = useDarkModeStore()
const isDark = computed(() => darkModeStore.isDark)
</script>

<style module>
:global(:root) {
  --lookbook-title: #212121;
  --lookbook-bg: #fff;
}
:global(:root.dark-mode) {
  --lookbook-title: #fff;
  --lookbook-bg: #181818;
}

.product {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 24px 32px;
  box-sizing: border-box;
  gap: 32px;
  text-align: center;
  font-size: 36px;
  color: var(--lookbook-title);
  font-family: Roboto, sans-serif;
  background: var(--lookbook-bg);
  transition: background 0.3s, color 0.3s;
}

.stVezz {
  position: relative;
  letter-spacing: 1.25px;
  line-height: 50px;
  font-size: 2.2rem;
  color: var(--lookbook-title);
  font-weight: 700;
  margin-bottom: 16px;
}

.fotos01 {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 8px;
}

.fotoIcon {
  width: 391.4px;
  height: 371.1px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  background: #eee;
  transition: box-shadow 0.3s;
}

@media (max-width: 1200px) {
  .fotoIcon {
    width: 260px;
    height: 240px;
  }
}

@media (max-width: 900px) {
  .fotos01 {
    gap: 16px;
  }
  .fotoIcon {
    width: 180px;
    height: 160px;
  }
}

@media (max-width: 600px) {
  .product {
    padding: 32px 4px 16px;
    font-size: 22px;
  }
  .fotos01 {
    flex-direction: column;
    gap: 12px;
  }
  .fotoIcon {
    width: 90vw;
    max-width: 320px;
    height: auto;
  }
  .stVezz {
    font-size: 1.2rem;
    line-height: 32px;
  }
}
</style>
