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

      <button class="hamburger" @click="toggleMobileMenu" aria-label="Abrir menu"
        v-show="isMobile && !isMobileMenuOpen">
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
              <router-link v-if="isUserLoggedIn" to="/wishlist" class="mobile-link" @click="closeMobileMenu">Favoritos</router-link>
              
              <div v-if="isUserLoggedIn" class="mobile-profile-menu">
                <button class="mobile-link mobile-profile-button" @click.prevent="toggleMobileProfileMenu">
                  Perfil
                  <svg class="mobile-dropdown-arrow" :class="{ 'open': showMobileProfileMenu }" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                
                <transition name="slide">
                  <div v-show="showMobileProfileMenu" class="mobile-profile-submenu">
                    <router-link to="/editprofile" class="mobile-submenu-item" @click="closeMobileMenu">
                      Editar Perfil
                    </router-link>
                    <button class="mobile-submenu-item" @click="handleMobileLogout">
                      Logout
                    </button>
                  </div>
                </transition>
              </div>
              
              <router-link v-else to="/login" class="mobile-link" @click="closeMobileMenu">
                Login
              </router-link>
              
              <router-link v-if="isUserLoggedIn" to="/checkout" class="mobile-link" @click="closeMobileMenu">Carrinho</router-link>
            </div>
          </nav>
        </div>
      </transition>

      <div class="icons">
        <button class="dark-mode-btn" @click="toggleDarkMode">
          <img class="icon" :alt="darkModeStore.isDark ? 'Modo Claro' : 'Modo Escuro'" :src="darkModeIcon" />
        </button>
        <router-link v-if="isUserLoggedIn" to="/wishlist" class="wishlist-link">
          <img class="icon" alt="Favoritos" :src="darkModeStore.isDark ? favoriteIconWhite : favoriteIcon" />
          <span v-if="favoritesCount > 0" class="favorites-badge">{{ favoritesCount }}</span>
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
          <div class="profile-menu">
            <button v-if="isUserLoggedIn" class="profile-button" type="button" @click.stop="toggleProfileMenu">
              <img class="icon" alt="Conta" :src="darkModeStore.isDark ? accountIconWhite : accountIcon" />
            </button>
            <router-link v-else to="/login">
              <img class="icon" alt="Conta" :src="darkModeStore.isDark ? accountIconWhite : accountIcon" />
            </router-link>
            
            <div v-if="isUserLoggedIn && showProfileMenu" class="profile-dropdown" v-click-outside="closeProfileMenu">
              <router-link to="/editprofile" class="dropdown-item" @click="closeProfileMenu">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>Editar Perfil</span>
              </router-link>
              <button class="dropdown-item" @click="handleLogout">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
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
import type { Directive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useDarkModeStore } from '@/stores/darkMode'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'
import type { CartItem } from '@/stores/cart'
import darkModeIconSrc from '@/assets/dark_mode.svg'
import lightModeIconSrc from '@/assets/light_mode.svg'
import lightModeIconWhite from '@/assets/light_mode-white.svg'
import logoLight from '@/assets/vezz-logo.png'
import logoDark from '@/assets/vezz-logo-white.svg'
import favoriteIcon from '@/assets/favorite.svg'
import favoriteIconWhite from '@/assets/favorite-white.svg'
import accountIcon from '@/assets/account_circle.svg'
import accountIconWhite from '@/assets/account_circle-white.svg'
import cartIcon from '@/assets/shopping_bag.svg'
import cartIconWhite from '@/assets/shopping_bag-white.svg'

const router = useRouter()
const cartStore = ref(useCartStore())
const darkModeStore = useDarkModeStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const showProfileMenu = ref(false)
const showMobileProfileMenu = ref(false)

const itemCount = computed(() => {
  if (!cartStore.value?.items) return 0
  return cartStore.value.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
})

const favoritesCount = computed(() => {
  return favoritesStore.favorites.length
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
  return authStore.isLoggedIn
})

const toggleProfileMenu = (event: Event) => {
  event.stopPropagation()
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const handleLogout = () => {
  authStore.logout()
  cartStore.value.clearCart()
  closeProfileMenu()
  router.push('/')
}

const toggleMobileProfileMenu = () => {
  showMobileProfileMenu.value = !showMobileProfileMenu.value
}

const handleMobileLogout = () => {
  authStore.logout()
  cartStore.value.clearCart()
  closeMobileMenu()
  router.push('/')
}

// Click outside directive
const vClickOutside: Directive = {
  beforeMount: (el: HTMLElement, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: (el: HTMLElement) => {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}

// Close menu when clicking outside
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', (event) => {
    if (showProfileMenu.value) {
      const target = event.target as HTMLElement
      const menu = document.querySelector('.profile-dropdown')
      const button = document.querySelector('.profile-button')
      if (menu && !menu.contains(target) && button && !button.contains(target)) {
        closeProfileMenu()
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', closeProfileMenu)
})

// Extend HTMLElement to include our custom event
declare global {
  interface HTMLElement {
    clickOutsideEvent?: (event: Event) => void;
  }
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.mobile-menu {
  background: var(--nav-bg);
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.12);
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
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.3s;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}

.nav-link,
.mobile-link {
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

.nav-link:hover,
.mobile-link:hover {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

.profile-menu {
  position: relative;
  display: inline-block;
}

.profile-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--nav-bg);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

/* Mobile adjustments */
@media (max-width: 900px) {
  .profile-dropdown {
    display: none;
  }
}

:root {
  --hover-bg: rgba(0, 0, 0, 0.04);
  --border-color: rgba(0, 0, 0, 0.12);
}

:root.dark-mode {
  --hover-bg: rgba(255, 255, 255, 0.08);
  --border-color: rgba(255, 255, 255, 0.12);
}

.mobile-profile-menu {
  width: 100%;
}

.mobile-profile-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border: none;
  background: none;
  font-family: inherit;
  padding: 0;
}

.mobile-dropdown-arrow {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.mobile-dropdown-arrow.open {
  transform: rotate(180deg);
}

.mobile-profile-submenu {
  padding-left: 16px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-submenu-item {
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.25px;
  opacity: 0.85;
  text-transform: uppercase;
  background: none;
  border: none;
  font-family: inherit;
  text-align: left;
  padding: 0;
  cursor: pointer;
}

.mobile-submenu-item:hover {
  opacity: 0.6;
  color: var(--primary-color);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.wishlist-link {
  position: relative;
  display: inline-block;
}

.favorites-badge {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
