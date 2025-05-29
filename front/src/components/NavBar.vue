<template>
  <header class="header">
    <div class="container">
      <router-link to="/">
        <img class="nav-icon" alt="Logo VEZZ" :src="logoSrc" />
      </router-link>

      <nav class="main-menu">
        <router-link to="/products" class="nav-link">CATÁLOGO</router-link>
        <a href="#" class="nav-link">LOOKBOOK</a>
        <router-link to="/about" class="nav-link">SOBRE</router-link>
      </nav>

      <div class="icons">
        <button class="dark-mode-btn" @click="toggleDarkMode">
          <img class="icon" :alt="darkModeStore.isDark ? 'Modo Claro' : 'Modo Escuro'" :src="darkModeIcon" />
        </button>
        <router-link to="/">
          <img class="icon" alt="Buscar" :src="darkModeStore.isDark ? searchIconWhite : searchIcon" />
        </router-link>
        <router-link to="/">
          <img class="icon" alt="Favoritos" :src="darkModeStore.isDark ? favoriteIconWhite : favoriteIcon" />
        </router-link>
        <router-link to="/login">
          <img class="icon" alt="Conta" :src="darkModeStore.isDark ? accountIconWhite : accountIcon" />
        </router-link>
        <router-link to="/checkout" class="cart-link">
          <img class="icon" alt="Carrinho" :src="darkModeStore.isDark ? cartIconWhite : cartIcon" />
          <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import type { CartItem } from '@/stores/cart'
import darkModeIconSrc from '@/assets/dark_mode.svg'
import lightModeIconSrc from '@/assets/light_mode.svg'
import lightModeIconWhite from '@/assets/light_mode-white.svg'
import logoLight from '@/assets/vezz-logo.png'
import logoDark from '@/assets/vezz-logo-white.svg'
import searchIcon from '@/assets/search.svg'
import searchIconWhite from '@/assets/search-white.svg'
import favoriteIcon from '@/assets/favorite.svg'
import favoriteIconWhite from '@/assets/favorite-white.svg'
import accountIcon from '@/assets/account_circle.svg'
import accountIconWhite from '@/assets/account_circle-white.svg'
import cartIcon from '@/assets/shopping_bag.svg'
import cartIconWhite from '@/assets/shopping_bag-white.svg'

const cartStore = ref(useCartStore())
const darkModeStore = useDarkModeStore()

const itemCount = computed(() => {
  if (!cartStore.value?.items) return 0
  return cartStore.value.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
})

const darkModeIcon = computed(() => {
  if (darkModeStore.isDark) {
    return lightModeIconWhite
  }
  return darkModeIconSrc
})

const logoSrc = computed(() => {
  return darkModeStore.isDark ? logoDark : logoLight
})

const toggleDarkMode = () => {
  darkModeStore.toggleDarkMode()
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.header {
  width: 100%;
  background-color: var(--nav-bg);
  box-shadow: 0px 10px 21px var(--nav-shadow);
  font-family: 'Roboto', sans-serif;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-icon {
  width: 104px;
  height: auto;
}

.main-menu {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-color);
  text-decoration: none;
  letter-spacing: 1.25px;
  transition: opacity 0.2s, color 0.3s;
}

.nav-link:hover {
  opacity: 0.7;
}

.icons {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 24px;
}

.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: opacity 0.2s, color 0.3s;
  display: block;
  vertical-align: middle;
  color: var(--text-color);
  opacity: 0.6;
}

.icon:hover {
  opacity: 0.4;
}

.cart-link {
  position: relative;
  display: inline-block;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #439cd3;
  color: white;
  border-radius: 50%;
  padding: 2px;
  min-width: 18px;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.dark-mode-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  line-height: 0;
}

.dark-mode-btn .icon {
  width: 24px;
  height: 24px;
}

:root {
  --nav-bg: #fff;
  --nav-shadow: 0px 10px 21px rgba(0, 0, 0, 0.15);
  --text-color: #212121;
}

:root.dark-mode {
  --nav-bg: #212121;
  --nav-shadow: 0px 10px 21px rgba(255, 255, 255, 0.15);
  --text-color: #fff;
}
</style>
