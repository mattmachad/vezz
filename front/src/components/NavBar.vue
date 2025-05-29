<template>
  <header class="header">
    <div class="container">
      <router-link to="/">
        <img class="nav-icon" alt="Logo VEZZ" :src="logoSrc" />
      </router-link>

      <nav class="main-menu" :class="{ hidden: isMobileMenuOpen }">
        <router-link to="/products" class="nav-link" @click="closeMobileMenu">CATÁLOGO</router-link>
        <router-link to="/lookbook" class="nav-link" @click="closeMobileMenu">LOOKBOOK</router-link>
        <router-link to="/about" class="nav-link" @click="closeMobileMenu">SOBRE</router-link>
      </nav>

      <button class="hamburger" @click="toggleMobileMenu" aria-label="Abrir menu" v-show="isMobile && !isMobileMenuOpen">
        <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
        <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
        <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
      </button>

      <transition name="mobile-menu-fade">
        <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click.self="closeMobileMenu">
          <nav class="mobile-menu">
            <button class="hamburger close-x" @click="closeMobileMenu" aria-label="Fechar menu">
              <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
              <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
              <span :class="{ 'bar': true, 'open': isMobileMenuOpen }"></span>
            </button>
            <router-link to="/products" class="nav-link" @click="closeMobileMenu">CATÁLOGO</router-link>
            <router-link to="/lookbook" class="nav-link" @click="closeMobileMenu">LOOKBOOK</router-link>
            <router-link to="/about" class="nav-link" @click="closeMobileMenu">SOBRE</router-link>
            <div class="mobile-icons">
              <router-link to="/" class="mobile-link" @click="closeMobileMenu">Buscar</router-link>
              <router-link v-if="isUserLoggedIn" to="/wishlist" class="mobile-link" @click="closeMobileMenu">Favoritos</router-link>
              <router-link to="/login" class="mobile-link" @click="closeMobileMenu">Perfil</router-link>
              <router-link v-if="isUserLoggedIn" to="/checkout" class="mobile-link" @click="closeMobileMenu">Sacola</router-link>
            </div>
          </nav>
        </div>
      </transition>

      <div class="icons">
        <button class="dark-mode-btn" @click="toggleDarkMode">
          <img class="icon" :alt="darkModeStore.isDark ? 'Modo Claro' : 'Modo Escuro'" :src="darkModeIcon" />
        </button>
        <router-link to="/">
          <img class="icon" alt="Buscar" :src="darkModeStore.isDark ? searchIconWhite : searchIcon" />
        </router-link>
        <router-link v-if="isUserLoggedIn" to="/wishlist">
          <img class="icon" alt="Favoritos" :src="darkModeStore.isDark ? favoriteIconWhite : favoriteIcon" />
        </router-link>
        <div class="profile-container">
          <div class="auth-status">
            <svg v-if="!isUserLoggedIn" class="auth-icon logged-out" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <svg v-else class="auth-icon logged-in" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <router-link to="/login">
            <img class="icon" alt="Conta" :src="darkModeStore.isDark ? accountIconWhite : accountIcon" />
          </router-link>
        </div>
        <router-link v-if="isUserLoggedIn" to="/checkout" class="cart-link">
          <img class="icon" alt="Carrinho" :src="darkModeStore.isDark ? cartIconWhite : cartIcon" />
          <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { useAuthStore } from '@/stores/auth'
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
const authStore = useAuthStore()

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

const isMobile = ref(false)
const isMobileMenuOpen = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 900
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const isUserLoggedIn = computed(() => {
  return !!localStorage.getItem('user')
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
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
  position: relative;
}

.nav-icon {
  width: 104px;
  height: auto;
}

.main-menu {
  display: flex;
  gap: 24px;
}

.main-menu.hidden {
  display: none;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1201;
}

.hamburger .bar {
  width: 28px;
  height: 3px;
  background: var(--text-color);
  margin: 4px 0;
  border-radius: 2px;
  transition: 0.3s;
}

.hamburger .bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger .bar.open:nth-child(2) {
  opacity: 0;
}
.hamburger .bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 900px) {
  .main-menu {
    display: none;
  }
  .main-menu.hidden {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.mobile-menu {
  background: var(--nav-bg);
  box-shadow: -2px 0 16px rgba(0,0,0,0.12);
  width: 220px;
  height: 100vh;
  padding: 48px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  animation: slideInMenu 0.3s;
  position: relative;
}

@keyframes slideInMenu {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.mobile-menu-fade-enter-active, .mobile-menu-fade-leave-active {
  transition: opacity 0.3s;
}
.mobile-menu-fade-enter-from, .mobile-menu-fade-leave-to {
  opacity: 0;
}

.nav-link, .mobile-link {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-color);
  text-decoration: none;
  letter-spacing: 1.25px;
  transition: opacity 0.2s, color 0.3s;
  font-family: 'Roboto', sans-serif;
  opacity: 0.85;
}

.nav-link:hover, .mobile-link:hover {
  opacity: 0.6;
  color: var(--primary-color);
}

.icons {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 24px;
}

@media (max-width: 900px) {
  .icons {
    display: none;
  }
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

.profile-container {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-status {
  position: absolute;
  top: -10px;
  right: -5px;
  background: var(--nav-bg);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  z-index: 10;
}

.auth-icon {
  width: 12px;
  height: 12px;
}

.auth-icon path {
  fill: currentColor;
}

/* Make the selectors more specific and force the colors */
.profile-container .auth-status .auth-icon.logged-in {
  color: #28a745 !important;
}

.profile-container .auth-status .auth-icon.logged-out {
  color: #ff0000 !important;
}

/* Remove any other color inheritance */
.profile-container .auth-status svg {
  color: unset;
}

:root {
  --nav-bg: #fff;
  --nav-shadow: 0px 10px 21px rgba(0, 0, 0, 0.15);
  --text-color: #212121;
  --auth-icon-color: #dc3545;
}

:root.dark-mode {
  --nav-bg: #212121;
  --nav-shadow: 0px 10px 21px rgba(255, 255, 255, 0.15);
  --text-color: #fff;
  --auth-icon-color: #28a745;
}

.mobile-icons {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-bottom: 32px;
  padding-left: 0;
}

.mobile-link {
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 1.25px;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.3s;
  text-transform: uppercase;
  padding-left: 0;
}

.mobile-link:hover {
  opacity: 0.6;
  color: var(--primary-color);
}

.hamburger.close-x {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1300;
  margin: 0;
}
</style>
